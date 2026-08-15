---
title: Second Derivative and Curvature
toc: false
---

# Second Derivative and Curvature

_The second derivative can be used to quantify how peaked a function is._

<div class="intro-text">

- The first derivative ${tex`f'(x)`} measures the slope of the function at ${tex`x`}.
- The second derivative ${tex`f''(x)`} is the derivative of the first derivative.
- A function with a large ${tex`\vert f''(x) \vert`} at ${tex`x`} has a slope that changes fast around that point.

</div>

```js
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card params-card">

<b>Parameters</b>
${x0Input}

```js
const x0Input = Inputs.range([-2, 2], {value: 0, step: 0.01, label: tex`\text{Point where derivative is evaluated, } x`});
const x0 = view(x0Input);
```

</div>

<div class="card plot-card">

```js
const h = 0.01;
const xgrid = d3.range(-5, 5, 0.01);

function f1(xv) {
  return Math.exp((-1 / (2 * 0.3 ** 2)) * (xv - 0) ** 2);
}
function line1(xv) {
  const slope = (f1(x0 + h) - f1(x0)) / h;
  const b = f1(x0) - slope * x0;
  return slope * xv + b;
}
const y1 = xgrid.map((d) => f1(d));
const points1 = [[x0, f1(x0)]];
const ends1 = [[-5, line1(-5)], [5, line1(5)]];

function f2(xv) {
  return Math.exp((-1 / (2 * 2 ** 2)) * (xv - 0) ** 2);
}
function line2(xv) {
  const slope = (f2(x0 + h) - f2(x0)) / h;
  const b = f2(x0) - slope * x0;
  return slope * xv + b;
}
const y2 = xgrid.map((d) => f2(d));
const points2 = [[x0, f2(x0)]];
const ends2 = [[-5, line2(-5)], [5, line2(5)]];

const fprime1 = ((-x0 / 0.3 ** 2) * f1(x0)).toFixed(4);
const fbiss1 = Math.abs((x0 ** 2 / 0.3 ** 4 - 1 / 0.3 ** 2) * f1(x0)).toFixed(4);
const fprime2 = ((-x0 / 2 ** 2) * f2(x0)).toFixed(4);
const fbiss2 = Math.abs((x0 ** 2 / 2 ** 4 - 1 / 2 ** 2) * f2(x0)).toFixed(4);
```

<div style="display: flex; gap: 1rem;">
  <div style="flex: 1;">

${tex`f'(x) =`} ${fprime1} &nbsp;&nbsp; ${tex`\vert f''(x) \vert =`} ${fbiss1}

```js
Plot.plot({
  width: Math.min(440, width),
  height: 420,
  x: {domain: [-5, 5], label: "x"},
  y: {domain: [0, 1.2], label: "f(x)"},
  marks: [
    Plot.ruleX([-5]),
    Plot.ruleY([0]),
    Plot.line(xgrid, {x: xgrid, y: y1, stroke: mvcolors[0], strokeWidth: 2.5}),
    Plot.line(ends1, {stroke: mvcolors[1], strokeWidth: 2.5}),
    Plot.dot(points1, {fill: "var(--theme-foreground)", r: 4})
  ]
})
```

  </div>
  <div style="flex: 1;">

${tex`f'(x) =`} ${fprime2} &nbsp;&nbsp; ${tex`\vert f''(x) \vert =`} ${fbiss2}

```js
Plot.plot({
  width: Math.min(440, width),
  height: 420,
  x: {domain: [-5, 5], label: "x"},
  y: {domain: [0, 1.5], label: "f(x)"},
  marks: [
    Plot.ruleX([-5]),
    Plot.ruleY([0]),
    Plot.line(xgrid, {x: xgrid, y: y2, stroke: mvcolors[0], strokeWidth: 2.5}),
    Plot.line(ends2, {stroke: mvcolors[1], strokeWidth: 2.5}),
    Plot.dot(points2, {fill: "var(--theme-foreground)", r: 4})
  ]
})
```

  </div>
</div>

</div>

</div>

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/second-derivative-measures-the-curvature-of-a-function")}

<style>

.dist-layout {
  grid-template-columns: 1fr;
}

.intro-text p,
.intro-text ul {
  max-width: none;
}

.dist-main form.inputs-3a86ea label {
  padding: 2px 0;
}

.dist-main form.inputs-3a86ea:not(.inputs-3a86ea-toggle) label {
  width: 260px;
}

.params-card form.inputs-3a86ea,
.params-card .inputs-3a86ea-input {
  width: 100%;
}

.params-card input[type="number"] {
  flex: 0 0 45px;
  width: 45px;
}

.params-card input[type="range"] {
  flex: 1 1 auto;
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
