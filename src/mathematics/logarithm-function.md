---
title: The Logarithm Function
toc: false
---

# The Logarithm Function

```js
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card params-card">

<b>Parameters</b>
${bInput}
${plotBaseInput}
${plotExponentialInput}

```js
const bInput = Inputs.range([1, 10], {value: 2.71, step: 0.01, label: "base, b"});
const b = view(bInput);
```

```js
const plotBaseInput = Inputs.toggle({label: "plot base", value: false});
const plotBase = view(plotBaseInput);
```

```js
const plotExponentialInput = Inputs.toggle({label: "plot exponential", value: false});
const plotExponential = view(plotExponentialInput);
```

</div>

<div class="card plot-card">

```js
function logBase(x, base) {
  return Math.log(x) / Math.log(base);
}
const compareGrid = d3.range(-11, 11, 22 / 1000);
const compareData = compareGrid.map((x) => ({x, lin: x, exp: Math.pow(b, x), log: logBase(x, b)}));
const curveDomain = [`logarithm with base b = ${b.toFixed(2)}`, "linear", ...(plotExponential ? [`exponential with base b = ${b.toFixed(2)}`] : [])];
const curveRange = [mvcolors[2], mvcolors[1], ...(plotExponential ? [mvcolors[0]] : [])];
```

```js
Plot.plot({
  width: Math.min(900, width),
  height: 420,
  x: {label: "x", domain: [-11, 11]},
  y: {label: "f(x)", domain: [-11, 11]},
  color: {legend: true, domain: curveDomain, range: curveRange},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    ...(plotBase ? [
      Plot.line([{x: b, y: 0}, {x: b, y: 1}], {x: "x", y: "y", stroke: "var(--theme-foreground-muted)", strokeDasharray: "4,4"}),
      Plot.line([{x: 0, y: 1}, {x: b, y: 1}], {x: "x", y: "y", stroke: "var(--theme-foreground-muted)", strokeDasharray: "4,4"}),
      Plot.text([{x: b, y: 0, label: `b = ${b.toFixed(3)}`}], {x: "x", y: "y", text: "label", dx: -3, dy: 22, fontSize: 13, fill: "var(--theme-foreground-muted)"})
    ] : []),
    Plot.lineY(compareData, {x: "x", y: "lin", stroke: mvcolors[1], strokeDasharray: "5,5"}),
    Plot.lineY(compareData, {filter: plotExponential, x: "x", y: "exp", stroke: mvcolors[0], strokeWidth: 2.5}),
    Plot.lineY(compareData, {x: "x", y: "log", stroke: mvcolors[2], strokeWidth: 2.5}),
    Plot.dot([{x: 0, y: 1}], {filter: plotExponential, x: "x", y: "y", stroke: mvcolors[0], fill: mvcolors[0], strokeWidth: 2}),
    Plot.dot([{x: 1, y: 0}], {x: "x", y: "y", stroke: mvcolors[2], fill: mvcolors[2], strokeWidth: 2}),
    Plot.text([{x: 1, y: 0, label: "(1,0)"}], {x: "x", y: "y", text: "label", dy: 15, dx: 10, fontSize: 13}),
    Plot.text([{x: 0, y: 1, label: "(0,1)"}], {filter: plotBase || plotExponential, x: "x", y: "y", text: "label", dy: -10, dx: -15, fontSize: 13})
  ]
})
```

</div>

</div>

<div class="dist-side">

<div class="card">

**Properties of the natural logarithm**

${tex`\log(e) = 1`}<br>
${tex`\log(1) = 0`}<br>
${tex`\log(x \cdot y) = \log x + \log y`}<br>
${tex`\log\left(\dfrac{x}{y}\right) = \log x - \log y`}<br>
${tex`\log x^y = y \log x`}<br>
${tex`\log e^y = y \log e = y`}<br>
Inverse: ${tex`e^x`} so that ${tex`\log(e^x) = x`}<br>
Derivative: ${tex`\dfrac{d}{dx}\log(x) = \dfrac{1}{x}`}<br>
Integral: ${tex`\int \log(x)\, dx = x\log(x) - x + C`}

</div>

</div>

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/the-logarithm-function")}

<style>

.dist-main form.inputs-3a86ea label {
  padding: 2px 0;
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
