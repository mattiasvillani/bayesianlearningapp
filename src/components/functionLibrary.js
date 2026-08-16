import * as d3 from "npm:d3";
import {hexbin as d3Hexbin} from "npm:d3-hexbin";

// Chrome serializes resolved color-mix() results as a "color(srgb r g b)"
// function, which d3-color's parser doesn't understand (it silently returns
// null, collapsing any interpolation built on it to a single constant
// color). Convert that form to a plain rgb() string d3 can parse.
function normalizeColor(value) {
  const m = /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)$/.exec(value);
  if (!m) return value;
  const [, r, g, b, a] = m;
  const to255 = (c) => Math.round(parseFloat(c) * 255);
  return a === undefined
    ? `rgb(${to255(r)}, ${to255(g)}, ${to255(b)})`
    : `rgba(${to255(r)}, ${to255(g)}, ${to255(b)}, ${a})`;
}

// getComputedStyle on a custom property returns its raw, unresolved value
// (e.g. a literal "color-mix(...)" string), not the concrete color it paints
// with. Assigning it to a real property like `color` forces the browser to
// resolve var()/color-mix() chains into a concrete color.
export function themeColor(varName, fallback) {
  if (typeof document === "undefined") return fallback;
  const probe = document.createElement("div");
  probe.style.display = "none";
  probe.style.color = `var(${varName})`;
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).color;
  document.body.removeChild(probe);
  return normalizeColor(value) || fallback;
}

// Builds the {x: [x1, x2, x3], density} grid that ternaryDensity expects,
// scanning the 2-simplex at the given resolution.
export function ternaryGrid(resolution, pdf) {
  const density = [];
  for (let i = 1; i < resolution; i++) {
    for (let j = 1; j < resolution - i; j++) {
      const x1 = i / resolution;
      const x2 = j / resolution;
      const x3 = Math.max(0, 1 - x1 - x2);
      const x = [x1, x2, x3];
      density.push({x, density: pdf(x)});
    }
  }
  return density;
}

// Builds the {x1, x2, pdf} grid that hexbinDensity expects, scanning a
// rectangular [x1Domain] x [x2Domain] region at the given resolution.
export function hexbinGrid(resolution, x1Domain, x2Domain, pdf) {
  const [x1lo, x1hi] = x1Domain;
  const [x2lo, x2hi] = x2Domain;
  const grid = [];
  for (const x1 of d3.range(x1lo, x1hi, (x1hi - x1lo) / resolution)) {
    for (const x2 of d3.range(x2lo, x2hi, (x2hi - x2lo) / resolution)) {
      grid.push({x1, x2, pdf: pdf([x1, x2])});
    }
  }
  return grid;
}

// Renders a standalone color-scale legend for a density value range, as
// either a vertical or horizontal gradient bar with tick labels — for
// pairing with hexbinDensity/ternaryDensity plots elsewhere on a page.
export function densityLegend(domain, options = {}) {
  const opts = Object.assign({
    orientation: "vertical",
    length: 300,
    thickness: 12,
    color: "#08306b",
    background: themeColor("--theme-background-a", "#ffffff"),
    stroke: themeColor("--theme-foreground", "#1b1e23"),
    label: "pdf",
    ticks: 4,
    scale: "linear",
    tickFontSize: "9px",
    labelFontSize: "10px"
  }, options);

  // "sqrt" stretches color contrast across the low end of the value range
  // (matches a scaleSequentialSqrt-style color scale) instead of spending
  // most of the gradient's visible range on values near the peak.
  const colorAt = opts.scale === "sqrt"
    ? (t) => d3.interpolateRgb(opts.background, opts.color)(Math.sqrt(t))
    : (t) => d3.interpolateRgb(opts.background, opts.color)(t);

  const [lo, hi] = domain;
  const vertical = opts.orientation === "vertical";
  const labelSpace = parseFloat(opts.labelFontSize) + 6;
  const tickSpace = parseFloat(opts.tickFontSize) + 19;
  const width = vertical ? opts.thickness + tickSpace : opts.length;
  const height = vertical ? opts.length + labelSpace : opts.thickness + tickSpace + labelSpace;

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  const gradId = `density-legend-${Math.random().toString(36).slice(2)}`;
  const gradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", gradId)
    .attr("x1", vertical ? "0%" : "0%").attr("x2", vertical ? "0%" : "100%")
    .attr("y1", vertical ? "100%" : "0%").attr("y2", vertical ? "0%" : "0%");
  d3.range(0, 1.001, 0.05).forEach((t) => {
    gradient.append("stop")
      .attr("offset", `${t * 100}%`)
      .attr("stop-color", colorAt(t));
  });

  const barX = 0;
  const barY = labelSpace;
  const barLength = opts.length;

  svg.append("rect")
    .attr("x", barX)
    .attr("y", barY)
    .attr("width", vertical ? opts.thickness : barLength)
    .attr("height", vertical ? barLength : opts.thickness)
    .attr("fill", `url(#${gradId})`)
    .attr("stroke", opts.stroke)
    .attr("stroke-width", 0.5);

  const legendScale = vertical
    ? d3.scaleLinear().domain([lo, hi]).range([barY + barLength, barY])
    : d3.scaleLinear().domain([lo, hi]).range([barX, barX + barLength]);
  const axis = vertical
    ? d3.axisRight(legendScale)
    : d3.axisBottom(legendScale);

  svg.append("g")
    .attr("transform", vertical ? `translate(${opts.thickness}, 0)` : `translate(0, ${barY + opts.thickness})`)
    .call(axis.ticks(opts.ticks).tickSize(3).tickFormat(d3.format(".2f")))
    .call((g) => g.select(".domain").remove())
    .call((g) => g.selectAll("text").attr("fill", opts.stroke).attr("font-size", opts.tickFontSize))
    .call((g) => g.selectAll("line").attr("stroke", opts.stroke));

  svg.append("text")
    .attr("x", vertical ? barX : barX)
    .attr("y", vertical ? labelSpace - 5 : height - 4)
    .attr("fill", opts.stroke)
    .attr("font-size", opts.labelFontSize)
    .text(opts.label);

  return svg.node();
}

// Renders a hexbin-based 2D density plot over a plain Cartesian domain,
// using the same background-to-color gradient style as ternaryDensity.
export function hexbinDensity(grid, resolution, options = {}) {
  const opts = Object.assign({
    size: 400,
    margin: {left: 40, top: options.legend ? 55 : 20, right: 20, bottom: 40},
    xDomain: d3.extent(grid, (d) => d.x1),
    yDomain: d3.extent(grid, (d) => d.x2),
    xLabel: "x₁",
    yLabel: "x₂",
    color: "#08306b",
    background: themeColor("--theme-background-a", "#ffffff"),
    stroke: themeColor("--theme-foreground", "#1b1e23"),
    contours: true,
    contourColor: "black",
    contourLevels: 4,
    legend: false,
    legendLabel: "pdf",
    tickFontSize: "11px",
    labelFontSize: "12px"
  }, options);

  const [pdfMin, pdfMax] = d3.extent(grid, (d) => d.pdf);
  const fillScale = d3.scaleSequential(d3.interpolateRgb(opts.background, opts.color)).domain([pdfMin, pdfMax]);

  const svg = d3.create("svg")
    .attr("width", opts.size)
    .attr("height", opts.size)
    .attr("viewBox", [0, 0, opts.size, opts.size])
    .attr("style", "max-width: 100%; height: auto;");

  const x = d3.scaleLinear().domain(opts.xDomain).range([opts.margin.left, opts.size - opts.margin.right]);
  const y = d3.scaleLinear().domain(opts.yDomain).range([opts.size - opts.margin.bottom, opts.margin.top]);

  const removeLine = (g) => g.select(".domain").remove();
  const styleAxis = (g) => g
    .call((s) => s.selectAll("text").attr("fill", opts.stroke).attr("font-size", opts.tickFontSize))
    .call((s) => s.selectAll("line,path").attr("stroke", opts.stroke));

  const hexagonSize = (x(opts.xDomain[0] + (opts.xDomain[1] - opts.xDomain[0]) / resolution) - x(opts.xDomain[0])) / Math.cos(Math.PI / 6) + 1;
  const hexbin = d3Hexbin();

  svg.append("g")
    .selectAll(".hexbin-point")
    .data(grid)
    .join("path")
    .attr("class", "hexbin-point")
    .attr("transform", (d) => `translate(${x(d.x1)}, ${y(d.x2)})`)
    .attr("fill", (d) => fillScale(d.pdf))
    .attr("d", hexbin.hexagon(hexagonSize));

  if (opts.legend) {
    const legendWidth = opts.size - opts.margin.left - opts.margin.right;
    const legendHeight = 10;
    const legendY = 10;
    const gradId = `hexbin-legend-${Math.random().toString(36).slice(2)}`;

    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", gradId)
      .attr("x1", "0%").attr("x2", "100%")
      .attr("y1", "0%").attr("y2", "0%");
    d3.range(0, 1.001, 0.1).forEach((t) => {
      gradient.append("stop")
        .attr("offset", `${t * 100}%`)
        .attr("stop-color", fillScale(pdfMin + t * (pdfMax - pdfMin)));
    });

    svg.append("rect")
      .attr("x", opts.margin.left)
      .attr("y", legendY)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("fill", `url(#${gradId})`)
      .attr("stroke", opts.stroke)
      .attr("stroke-width", 0.5);

    const legendScale = d3.scaleLinear().domain([pdfMin, pdfMax]).range([opts.margin.left, opts.margin.left + legendWidth]);

    svg.append("g")
      .attr("transform", `translate(0, ${legendY + legendHeight})`)
      .call(d3.axisBottom(legendScale).ticks(4).tickSize(3).tickFormat(d3.format(".2f")))
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll("text").attr("fill", opts.stroke).attr("font-size", "9px"))
      .call((g) => g.selectAll("line").attr("stroke", opts.stroke));

    svg.append("text")
      .attr("x", opts.margin.left)
      .attr("y", legendY - 3)
      .attr("fill", opts.stroke)
      .attr("font-size", "10px")
      .text(opts.legendLabel);
  }

  if (opts.contours) {
    // grid is built x1-outer/x2-inner (see hexbinGrid), so x2 is the
    // fastest-varying index — that's the "width" dimension d3.contours expects.
    // Use the exact same lo + i*step formula hexbinGrid used to place each
    // point, rather than re-deriving it from the domain span: d3.range
    // excludes its endpoint, so the grid never actually reaches xDomain[1]/
    // yDomain[1], and a domain-span-based formula would stretch the contour
    // geometry relative to the hexagons it's supposed to trace.
    const nx1 = resolution;
    const nx2 = resolution;
    const dx1 = (opts.xDomain[1] - opts.xDomain[0]) / resolution;
    const dx2 = (opts.yDomain[1] - opts.yDomain[0]) / resolution;
    const levels = Array.isArray(opts.contourLevels)
      ? opts.contourLevels
      : d3.range(1, opts.contourLevels + 1).map((i) => (i / (opts.contourLevels + 1)) * pdfMax);

    const contours = d3.contours().size([nx2, nx1]).thresholds(levels)(grid.map((d) => d.pdf));

    const contourPath = d3.geoPath(d3.geoTransform({
      point(px, py) {
        const x2val = opts.yDomain[0] + px * dx2;
        const x1val = opts.xDomain[0] + py * dx1;
        this.stream.point(x(x1val), y(x2val));
      }
    }));

    svg.append("g")
      .selectAll(".hexbin-contour")
      .data(contours)
      .join("path")
      .attr("class", "hexbin-contour")
      .attr("d", contourPath)
      .attr("fill", "none")
      .attr("stroke", opts.contourColor)
      .attr("stroke-width", 1);
  }

  svg.append("g")
    .attr("transform", `translate(0, ${opts.size - opts.margin.bottom})`)
    .call(d3.axisBottom(x))
    .call(removeLine)
    .call(styleAxis);

  svg.append("g")
    .attr("transform", `translate(${opts.margin.left}, 0)`)
    .call(d3.axisLeft(y))
    .call(removeLine)
    .call(styleAxis);

  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("fill", opts.stroke)
    .attr("font-size", opts.labelFontSize)
    .attr("x", (opts.margin.left + opts.size - opts.margin.right) / 2)
    .attr("y", opts.size - 4)
    .text(opts.xLabel);

  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("fill", opts.stroke)
    .attr("font-size", opts.labelFontSize)
    .attr("transform", `translate(12, ${(opts.margin.top + opts.size - opts.margin.bottom) / 2}) rotate(-90)`)
    .text(opts.yLabel);

  return svg.node();
}

// Renders a hexbin-based ternary (triangle simplex) density plot.
// Adapted from https://observablehq.com/@mattiasvillani/dirichlet-distribution
export function ternaryDensity(density, resolution, options = {}) {
  const opts = Object.assign({
    size: 400,
    margin: {left: 30, top: 30, right: 30, bottom: 30},
    color: "#08306b",
    background: themeColor("--theme-background-a", "#ffffff"),
    stroke: themeColor("--theme-foreground", "#1b1e23"),
    labels: ["x₁", "x₂", "x₃"]
  }, options);

  const fillScale = d3.scaleSequential(d3.interpolateRgb(opts.background, opts.color))
    .domain(d3.extent(density, (d) => d.density));

  const svg = d3.create("svg")
    .attr("width", opts.size)
    .attr("height", opts.size)
    .attr("viewBox", [0, 0, opts.size, opts.size])
    .attr("style", "max-width: 100%; height: auto;");

  const x = d3.scaleLinear().domain([0, 1]).range([opts.margin.left, opts.size - opts.margin.right]);
  const y = d3.scaleLinear().domain([0, 1]).range([opts.size - opts.margin.bottom, opts.margin.top]);

  const axisBottom = (g) => g.call(d3.axisBottom(x).ticks(4));
  const removeLine = (g) => g.select(".domain").remove();
  const styleAxis = (g) => g
    .call((s) => s.selectAll("text").attr("fill", opts.stroke))
    .call((s) => s.selectAll("line,path").attr("stroke", opts.stroke));

  const hexagonSize = (x(1 / (2 * resolution)) - x(0)) / Math.cos(Math.PI / 6) + 1;

  const corners = [{x: 0.5, y: Math.sqrt(3) / 2}, {x: 0, y: 0}, {x: 1, y: 0}];
  const cornersExpanded = [{x: 0.5, y: Math.sqrt(3) / 2 + 0.1}, {x: -0.1, y: -0.05}, {x: 1.1, y: -0.05}];
  const line = d3.line().x((d) => x(d.x)).y((d) => y(d.y));
  const clipId = `ternary-triangle-${Math.random().toString(36).slice(2)}`;

  svg.append("defs")
    .append("clipPath")
    .attr("id", clipId)
    .append("path")
    .attr("d", line(corners));

  svg.selectAll(".ternary-border")
    .data([[corners[0], corners[1]], [corners[1], corners[2]], [corners[2], corners[0]]])
    .enter()
    .append("line")
    .attr("x1", (d) => x(d[0].x))
    .attr("x2", (d) => x(d[1].x))
    .attr("y1", (d) => y(d[0].y))
    .attr("y2", (d) => y(d[1].y))
    .attr("class", "ternary-border")
    .attr("stroke", opts.stroke);

  const hexbin = d3Hexbin();

  svg.append("g")
    .attr("clip-path", `url(#${clipId})`)
    .selectAll(".ternary-point")
    .data(density)
    .join("path")
    .attr("class", "ternary-point")
    .attr("transform", (d) => `translate(${x(corners[0].x * d.x[0] + corners[1].x * d.x[1] + corners[2].x * d.x[2])}, ${y(corners[0].y * d.x[0] + corners[1].y * d.x[1] + corners[2].y * d.x[2])})`)
    .attr("fill", (d) => fillScale(d.density))
    .attr("d", hexbin.hexagon(hexagonSize));

  svg.selectAll("text.ternary-label")
    .data([[cornersExpanded[0], cornersExpanded[1]], [cornersExpanded[1], cornersExpanded[2]], [cornersExpanded[2], cornersExpanded[0]]])
    .join("text")
    .attr("class", "ternary-label")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-style", "italic")
    .attr("fill", opts.stroke)
    .attr("x", (d) => (x(d[0].x) + x(d[1].x)) / 2)
    .attr("y", (d) => (y(d[0].y) + y(d[1].y)) / 2)
    .text((d, i) => opts.labels[[1, 2, 0][i]]);

  svg.append("g")
    .attr("transform", `translate(0, ${opts.size - opts.margin.bottom})`)
    .call(axisBottom)
    .call(removeLine)
    .call(styleAxis);

  svg.append("g")
    .attr("transform", `translate(${x(1) + opts.margin.right / 2}, ${y(0) + 26}) rotate(-120)`)
    .call(axisBottom)
    .call(removeLine)
    .call((g) => g.selectAll("text").attr("transform", "translate(11, 22) rotate(120)"))
    .call(styleAxis);

  svg.append("g")
    .attr("transform", `translate(${x(0.5) + opts.margin.left / 2}, ${y(Math.sqrt(3) / 2) - 26}) rotate(120)`)
    .call(axisBottom)
    .call(removeLine)
    .call((g) => g.selectAll("text").attr("transform", "translate(-11, 22) rotate(-120)"))
    .call(styleAxis);

  return svg.node();
}
