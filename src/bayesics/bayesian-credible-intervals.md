---
title: Bayesian credible intervals
toc: false
---

# Bayesian credible intervals

_A 95% posterior credible interval ${tex`[l,u]`} for an unknown parameter ${tex`\theta`} is an interval which contains ${tex`\theta`} with ${tex`0.95`} probability conditional on the observed data ${tex`\boldsymbol{x}`}:_

${tex.block`\Pr(\theta \in [l,u] \mid \boldsymbol{x}) = 0.95`}

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
function makeDistribution(distType, p) {
  switch (distType) {
    case "normal":
      return {pdf: (x) => jStat.normal.pdf(x, p[0], p[1]), support: [-Infinity, Infinity]};
    case "binormal mixture":
      return {pdf: (x) => p[4] * jStat.normal.pdf(x, p[0], p[2]) + (1 - p[4]) * jStat.normal.pdf(x, p[1], p[3]), support: [-Infinity, Infinity]};
    case "trinormal mixture":
      return {pdf: (x) => p[6] * jStat.normal.pdf(x, p[0], p[3]) + p[7] * jStat.normal.pdf(x, p[1], p[4]) + (1 - p[6] - p[7]) * jStat.normal.pdf(x, p[2], p[5]), support: [-Infinity, Infinity]};
    case "beta":
      return {pdf: (x) => jStat.beta.pdf(x, p[0], p[1]), support: [Number.EPSILON, 1 - Number.EPSILON]};
    case "chi2":
      return {pdf: (x) => jStat.chisquare.pdf(x, p[0]), support: [Number.EPSILON, Infinity]};
    case "exponential":
      return {pdf: (x) => jStat.exponential.pdf(x, p[0]), support: [Number.EPSILON, Infinity]};
    case "lognormal":
      return {pdf: (x) => jStat.lognormal.pdf(x, p[0], p[1]), support: [Number.EPSILON, Infinity]};
    case "studentt":
      return {pdf: (x) => jStat.studentt.pdf((x - p[0]) / p[1], p[2]) / p[1], support: [-Infinity, Infinity]};
  }
}

// A rough [lo, hi] window to grid over — exact jStat quantiles where available,
// a mean±6·sd heuristic for the mixtures (no closed-form quantile to call).
function initialRange(distType, p) {
  switch (distType) {
    case "normal": return [jStat.normal.inv(0.0005, p[0], p[1]), jStat.normal.inv(0.9995, p[0], p[1])];
    case "beta": return [jStat.beta.inv(0.0005, p[0], p[1]), jStat.beta.inv(0.9995, p[0], p[1])];
    case "chi2": return [jStat.chisquare.inv(0.0005, p[0]), jStat.chisquare.inv(0.9995, p[0])];
    case "exponential": return [jStat.exponential.inv(0.0005, p[0]), jStat.exponential.inv(0.9995, p[0])];
    case "lognormal": return [jStat.lognormal.inv(0.0005, p[0], p[1]), jStat.lognormal.inv(0.9995, p[0], p[1])];
    case "studentt": return [p[0] + p[1] * jStat.studentt.inv(0.0005, p[2]), p[0] + p[1] * jStat.studentt.inv(0.9995, p[2])];
    case "binormal mixture": {
      const mus = [p[0], p[1]], sigmas = [p[2], p[3]];
      const spread = 6 * Math.max(...sigmas);
      return [Math.min(...mus) - spread, Math.max(...mus) + spread];
    }
    case "trinormal mixture": {
      const mus = [p[0], p[1], p[2]], sigmas = [p[3], p[4], p[5]];
      const spread = 6 * Math.max(...sigmas);
      return [Math.min(...mus) - spread, Math.max(...mus) + spread];
    }
  }
}

// Highest-Posterior-Density region: rank grid points by density, keep the
// most probable ones until their (discretized) mass reaches coverageFrac,
// then split the kept x's into contiguous runs.
function computeHPD(xGrid, pdfVals, coverageFrac) {
  const binSize = xGrid[1] - xGrid[0];
  const order = pdfVals.map((_, i) => i).sort((a, b) => pdfVals[b] - pdfVals[a]);
  let cumulative = 0;
  let cutoff = order.length;
  for (let k = 0; k < order.length; k++) {
    cumulative += pdfVals[order[k]] * binSize;
    if (cumulative >= coverageFrac) {
      cutoff = k + 1;
      break;
    }
  }
  const included = order.slice(0, cutoff).map((i) => xGrid[i]).sort((a, b) => a - b);
  const intervals = [];
  let start = included[0];
  let prev = included[0];
  for (let k = 1; k < included.length; k++) {
    if (included[k] - prev > 1.9 * binSize) {
      intervals.push([start, prev]);
      start = included[k];
    }
    prev = included[k];
  }
  intervals.push([start, prev]);
  return intervals;
}

function buildCdf(xGrid, pdfVals) {
  const cdf = new Array(xGrid.length).fill(0);
  for (let i = 1; i < xGrid.length; i++) {
    cdf[i] = cdf[i - 1] + 0.5 * (pdfVals[i - 1] + pdfVals[i]) * (xGrid[i] - xGrid[i - 1]);
  }
  const total = cdf[cdf.length - 1];
  return cdf.map((c) => c / total);
}

function quantileFromCdf(xGrid, cdf, p) {
  if (p <= cdf[0]) return xGrid[0];
  if (p >= cdf[cdf.length - 1]) return xGrid[xGrid.length - 1];
  let lo = 0, hi = cdf.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (cdf[mid] < p) lo = mid; else hi = mid;
  }
  const t = (p - cdf[lo]) / (cdf[hi] - cdf[lo]);
  return xGrid[lo] + t * (xGrid[hi] - xGrid[lo]);
}
```

<div class="dist-layout">

<div class="dist-main" style="grid-column: 1 / -1;">

<div class="card">

<b>Distribution</b>
${distTypeInput}
${paramsInput}

${coverageInput}

```js
const distTypeInput = Inputs.select(["normal", "binormal mixture", "trinormal mixture", "beta", "chi2", "exponential", "lognormal", "studentt"], {value: "normal", label: "type"});
const distType = view(distTypeInput);
```

```js
const paramsInput = distType === "beta" ? Inputs.form([
    Inputs.range([0.1, 20], {value: 3, step: 0.1, label: tex`\text{shape }\alpha`}),
    Inputs.range([0.1, 20], {value: 5, step: 0.1, label: tex`\text{shape }\beta`})
  ])
  : distType === "chi2" ? Inputs.form([
    Inputs.range([1, 50], {value: 3, step: 1, label: tex`\text{df }\nu`})
  ])
  : distType === "exponential" ? Inputs.form([
    Inputs.range([0.01, 10], {value: 1, step: 0.01, label: tex`\text{rate }\lambda`})
  ])
  : distType === "lognormal" ? Inputs.form([
    Inputs.range([-5, 5], {value: 0, step: 0.1, label: tex`\text{location }\mu`}),
    Inputs.range([0.1, 5], {value: 1, step: 0.1, label: tex`\text{scale }\sigma`})
  ])
  : distType === "studentt" ? Inputs.form([
    Inputs.range([-5, 5], {value: 0, step: 0.1, label: tex`\text{location }\mu`}),
    Inputs.range([0.1, 5], {value: 1, step: 0.1, label: tex`\text{scale }\sigma`}),
    Inputs.range([1, 50], {value: 4, step: 1, label: tex`\text{df }\nu`})
  ])
  : distType === "binormal mixture" ? Inputs.form([
    Inputs.range([-5, 5], {value: -2, step: 0.1, label: tex`\text{location }\mu_1`}),
    Inputs.range([-5, 5], {value: 2, step: 0.1, label: tex`\text{location }\mu_2`}),
    Inputs.range([0.1, 5], {value: 1, step: 0.1, label: tex`\text{scale }\sigma_1`}),
    Inputs.range([0.1, 5], {value: 1, step: 0.1, label: tex`\text{scale }\sigma_2`}),
    Inputs.range([0, 1], {value: 0.3, step: 0.01, label: tex`\text{weight }w_1`})
  ])
  : distType === "trinormal mixture" ? Inputs.form([
    Inputs.range([-5, 5], {value: -2, step: 0.1, label: tex`\text{location }\mu_1`}),
    Inputs.range([-5, 5], {value: 0, step: 0.1, label: tex`\text{location }\mu_2`}),
    Inputs.range([-5, 5], {value: 2, step: 0.1, label: tex`\text{location }\mu_3`}),
    Inputs.range([0.1, 5], {value: 0.5, step: 0.1, label: tex`\text{scale }\sigma_1`}),
    Inputs.range([0.1, 5], {value: 0.5, step: 0.1, label: tex`\text{scale }\sigma_2`}),
    Inputs.range([0.1, 5], {value: 0.5, step: 0.1, label: tex`\text{scale }\sigma_3`}),
    Inputs.range([0, 0.49], {value: 0.3, step: 0.01, label: tex`\text{weight }w_1`}),
    Inputs.range([0, 0.5], {value: 0.3, step: 0.01, label: tex`\text{weight }w_2`})
  ])
  : Inputs.form([
    Inputs.range([-5, 5], {value: 0, step: 0.1, label: tex`\text{mean }\mu`}),
    Inputs.range([0.1, 5], {value: 1, step: 0.1, label: tex`\text{stdev }\sigma`})
  ]);
const params = view(paramsInput);
```

```js
const coverageInput = Inputs.range([1, 99], {value: 90, step: 1, label: "coverage %"});
const coverage = view(coverageInput);
```

</div>

<div class="card">

```js
const dist = makeDistribution(distType, params);
let [lower, upper] = initialRange(distType, params);
if (dist.pdf(lower) < dist.pdf(dist.support[0])) lower = dist.support[0];
if (dist.pdf(upper) < dist.pdf(dist.support[1])) upper = dist.support[1];
```

```js
const gridN = 1000;
const xGrid = d3.range(gridN).map((i) => lower + (upper - lower) * i / (gridN - 1));
const pdfVals = xGrid.map(dist.pdf);
const pdfData = xGrid.map((x, i) => ({x, pdf: pdfVals[i]}));
```

```js
const hpdIntervals = computeHPD(xGrid, pdfVals, coverage / 100);
const cdfVals = buildCdf(xGrid, pdfVals);
const equalTail = [quantileFromCdf(xGrid, cdfVals, (1 - coverage / 100) / 2), quantileFromCdf(xGrid, cdfVals, (1 + coverage / 100) / 2)];
```

```js
// Points outside the HPD region are set to null (not filtered out) so the
// area mark breaks there instead of drawing a straight line across the gap
// between humps — which would poke above the density curve in the valley.
const hpdAreaData = xGrid.map((x, i) => ({x, pdf: hpdIntervals.some(([lo, hi]) => x >= lo && x <= hi) ? pdfVals[i] : null}));
```

```js
Plot.plot({
  width: Math.min(900, width),
  height: 360,
  x: {label: "x"},
  y: {label: "density", zero: true},
  color: {
    legend: true,
    domain: ["posterior density", "HPD region", "equal-tail interval"],
    range: [mvcolors[2], mvcolors[1], mvcolors[0]]
  },
  marks: [
    Plot.ruleY([0]),
    Plot.areaY(hpdAreaData, {x: "x", y: "pdf", fill: mvcolors[1], fillOpacity: 0.35}),
    Plot.lineY(pdfData, {x: "x", y: "pdf", stroke: mvcolors[2], strokeWidth: 2.5}),
    Plot.line([{x: equalTail[0], y: 0}, {x: equalTail[1], y: 0}], {x: "x", y: "y", stroke: mvcolors[0], strokeWidth: 5})
  ]
})
```

**${coverage}% HPD region**: ${hpdIntervals.map(([lo, hi]) => `(${lo.toFixed(3)}, ${hi.toFixed(3)})`).join(" ∪ ")}<br>
**${coverage}% equal-tail interval**: (${equalTail[0].toFixed(3)}, ${equalTail[1].toFixed(3)})

</div>

</div>

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/bayesian-credible-intervals")}

<style>

form.inputs-3a86ea label {
  padding: 2px 0;
}

form.inputs-3a86ea:not(.inputs-3a86ea-toggle) label {
  width: 140px;
}

</style>
