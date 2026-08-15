---
title: Function Optimization
toc: false
---

# Function Optimization

_This interactive illustration explains how to find the maximum or minimum of a function using ideas from calculus._

```js
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card params-card">

<b>Parameters</b>
${funcnameInput}
${x0Input}
${plotDerivZeroInput}
${showGridlinesInput}

```js
const funcnameInput = Inputs.select(["square", "sin", "dampedsin", "poly 3rd degree"], {value: "square", label: "Function f(x)"});
const funcname = view(funcnameInput);
```

```js
const f = funcname === "square" ? (xv) => 1 - xv ** 2
  : funcname === "sin" ? (xv) => Math.sin(xv)
  : funcname === "dampedsin" ? (xv) => Math.sin(3 * xv) * Math.exp(-xv)
  : (xv) => 1 + 2 * xv ** 2 - 0.5 * xv ** 3;

const derivative = funcname === "square" ? (xv) => -2 * xv
  : funcname === "sin" ? (xv) => Math.cos(xv)
  : funcname === "dampedsin" ? (xv) => Math.exp(-xv) * (3 * Math.cos(3 * xv) - Math.sin(3 * xv))
  : (xv) => 4 * xv - (3 / 2) * xv ** 2;

const derivative2 = funcname === "square" ? () => -2
  : funcname === "sin" ? (xv) => -Math.sin(xv)
  : funcname === "dampedsin" ? (xv) => -2 * Math.exp(-xv) * (3 * Math.cos(3 * xv) + 4 * Math.sin(3 * xv))
  : (xv) => 4 - 3 * xv;

const zeroderivpoints = funcname === "square" ? [0]
  : funcname === "sin" ? [-(3 / 2) * Math.PI, -Math.PI / 2, Math.PI / 2, (3 / 2) * Math.PI]
  : funcname === "dampedsin" ? [
      (2 / 3) * Math.atan((1 / 3) * (-1 - Math.sqrt(10))),
      (2 / 3) * (Math.PI + Math.atan((1 / 3) * (-1 - Math.sqrt(10)))),
      -(2 / 3) * (Math.PI - Math.atan((1 / 3) * (Math.sqrt(10) - 1))),
      (2 / 3) * Math.atan((1 / 3) * (Math.sqrt(10) - 1))
    ]
  : [0, 8 / 3];

const xdomain = funcname === "square" ? [-3, 3]
  : funcname === "sin" ? [-2 * Math.PI, 2 * Math.PI]
  : funcname === "dampedsin" ? [-2, 2]
  : [-5, 5];

const xrange = xdomain[1] - xdomain[0];
const xmidpoint = (xdomain[0] + xdomain[1]) / 2;

const latexfunc = funcname === "square" ? "f(x) = 1 - x^2"
  : funcname === "sin" ? "f(x) = \\sin(x)"
  : funcname === "dampedsin" ? "f(x) = \\sin(3x)\\exp(-x)"
  : "f(x) = 1 + 2x^2 - 0.5x^3";
const plotTitle = tex(Object.assign([latexfunc], {raw: [latexfunc]}));
```

```js
const x0Input = Inputs.range(xdomain, {value: -1, step: 0.01, label: "x-value"});
const x0 = view(x0Input);
```

```js
const plotDerivZeroInput = Inputs.toggle({label: "plot zero deriv points", value: false});
const plotDerivZero = view(plotDerivZeroInput);
```

```js
const showGridlinesInput = Inputs.toggle({label: "show gridlines", value: true});
const showGridlines = view(showGridlinesInput);
```

</div>

<div class="card plot-card">

```js
const h = 0.01;
function tangentline(z) {
  const slope = (f(x0 + h) - f(x0)) / h;
  const b = f(x0) - slope * x0;
  return slope * z + b;
}

const ngrid = 500;
const funcdata = d3.range(xdomain[0], xdomain[1], (xdomain[1] - xdomain[0]) / ngrid).map((xv) => ({
  x: xv,
  f: f(xv),
  fprime: derivative(xv)
}));

const plotDomain = ["f(x)", "tangent line", ...(plotDerivZero ? ["zero derivative"] : [])];
const plotRange = [mvcolors[0], mvcolors[1], ...(plotDerivZero ? [mvcolors[2]] : [])];

const fvals = funcdata.map((d) => d.f);
const yrange = d3.max(fvals) - d3.min(fvals);
const ydomain = [d3.min(fvals) - 0.2 * yrange, d3.max(fvals) + 0.2 * yrange];

const infoLabel = `f(x) = ${f(x0).toFixed(3)}   f'(x) = ${derivative(x0).toFixed(3)}   f''(x) = ${derivative2(x0).toFixed(3)}`;
```

```js
Plot.plot({
  width: Math.min(900, width),
  height: 480,
  title: plotTitle,
  color: {legend: true, domain: plotDomain, range: plotRange},
  x: {label: "x", domain: xdomain},
  y: {label: "f(x)", domain: ydomain},
  grid: showGridlines,
  marks: [
    Plot.ruleX(zeroderivpoints, {filter: plotDerivZero, stroke: mvcolors[2]}),
    Plot.lineY(funcdata, {x: "x", y: "f", stroke: mvcolors[0], strokeWidth: 2.5}),
    Plot.line([[x0 - 0.2 * xrange, tangentline(x0 - 0.2 * xrange)], [x0 + 0.2 * xrange, tangentline(x0 + 0.2 * xrange)]],
      {stroke: mvcolors[1], strokeWidth: 2.5}),
    Plot.dot([[x0, f(x0)]], {fill: "var(--theme-foreground)", r: 4}),
    Plot.text([{x: xmidpoint, y: ydomain[1] - 0.1 * (ydomain[1] - ydomain[0]), label: infoLabel}],
      {x: "x", y: "y", fontSize: 14, dy: -20, text: "label", fill: "var(--theme-foreground)"})
  ]
})
```

</div>

</div>

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/function-optimization")}

<style>

.dist-main form.inputs-3a86ea label {
  padding: 2px 0;
}

.dist-main form.inputs-3a86ea:not(.inputs-3a86ea-toggle) label {
  width: 124px;
}

.params-card select {
  width: 120px;
}

.params-card > p > b {
  display: block;
  margin-bottom: 0.6rem;
}

.params-card {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.plot-card {
  padding-top: 0.5rem;
}

.plot-card .observablehq--block + .observablehq--block {
  margin-top: 0;
}

.plot-card figure {
  margin-top: 0;
}

</style>
