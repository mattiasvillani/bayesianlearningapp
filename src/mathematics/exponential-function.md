---
title: The Exponential Function
toc: false
---

# The Exponential Function

```js
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card params-card">

<b>Parameters</b>
${kInput}
${pInput}
${upperLimInput}
${plotPowerInput}
${plotLinearInput}

```js
const kInput = Inputs.range([-3, 3], {value: 1, step: 0.1, label: "Exponential growth rate, k"});
const k = view(kInput);
```

```js
const pInput = Inputs.range([-1, 10], {value: 3, step: 0.1, label: "Power function growth rate, p"});
const p = view(pInput);
```

```js
const upperLimInput = Inputs.range([1, 100], {value: 3, step: 1, label: "upper limit of x-axis"});
const upperLim = view(upperLimInput);
```

```js
const plotPowerInput = Inputs.toggle({label: "plot power function", value: false});
const plotPower = view(plotPowerInput);
```

```js
const plotLinearInput = Inputs.toggle({label: "plot linear function", value: false});
const plotLinear = view(plotLinearInput);
```

</div>

<div class="card defs-card">

${growthDefs}

```js
const growthDefs = html`<div style="display: flex; gap: 2rem; justify-content: space-between;">
  <div>
    <b style="color: ${mvcolors[0]}">Exponential growth</b><br>
    <span style="color: ${mvcolors[0]}">${tex`f(x) = e^{kx}`}</span>
  </div>
  <div>
    <b style="color: ${mvcolors[1]}">Power growth</b><br>
    <span style="color: ${mvcolors[1]}">${tex`f(x) = 1 + x^{p}`}</span>
  </div>
  <div>
    <b style="color: ${mvcolors[2]}">Linear growth</b><br>
    <span style="color: ${mvcolors[2]}">${tex`f(x) = 1 + x`}</span>
  </div>
</div>`;
```

</div>

<div class="card plot-card">

```js
const xGrid = d3.range(0, upperLim, upperLim / 1000);
const funcData = xGrid.map((x) => ({
  x,
  expofunc: Math.exp(k * x),
  powerfunc: 1 + Math.pow(x, p),
  linfunc: 1 + x
}));
const yMax = d3.max(funcData, (d) => Math.max(d.expofunc, d.powerfunc));
const curveDomain = ["exponential function", ...(plotPower ? ["power function"] : []), ...(plotLinear ? ["linear function"] : [])];
const curveRange = [mvcolors[0], ...(plotPower ? [mvcolors[1]] : []), ...(plotLinear ? [mvcolors[2]] : [])];
```

```js
Plot.plot({
  width: Math.min(900, width),
  height: 420,
  x: {label: "x", domain: [0, upperLim]},
  y: {label: "f(x)", domain: [0, yMax]},
  color: {legend: true, domain: curveDomain, range: curveRange},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(funcData, {x: "x", y: "expofunc", stroke: mvcolors[0], strokeWidth: 2.5}),
    Plot.line(funcData, {filter: plotPower, x: "x", y: "powerfunc", stroke: mvcolors[1], strokeWidth: 2.5}),
    Plot.line(funcData, {filter: plotLinear, x: "x", y: "linfunc", stroke: mvcolors[2], strokeWidth: 2.5})
  ]
})
```

</div>

</div>

<div class="dist-side">

<div class="card">

**Properties**

Limit as ${tex`x \to -\infty`}: ${tex`e^x \to 0`}

Limit as ${tex`x \to \infty`}: ${tex`e^x \to \infty`}

Series expansion: ${tex`e^x = \sum_{n=0}^{\infty} \dfrac{x^n}{n!}`}

Product rule: ${tex`e^x e^y = e^{x+y}`}

Power rule: ${tex`(e^x)^y = e^{xy}`}

Quotient rule: ${tex`\dfrac{e^x}{e^y} = e^{x-y}`}

Negative exponent: ${tex`e^{-x} = \dfrac{1}{e^x}`}

Inverse: ${tex`\ln(x)`} so that ${tex`\ln(e^x)=x`}

Derivative: ${tex`\dfrac{d}{dx}e^x = e^x`}

Integral: ${tex`\int e^x\, dx = e^x + C`}

</div>

</div>

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/the-exponential-function")}

<style>

.dist-main form.inputs-3a86ea label {
  padding: 2px 0;
}

.dist-main form.inputs-3a86ea:not(.inputs-3a86ea-toggle) label {
  width: 210px;
}

.params-card > p > b {
  display: block;
  margin-bottom: 0.6rem;
}

.params-card {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.defs-card {
  padding-bottom: 0.5rem;
}

.plot-card {
  padding-top: 0.5rem;
}

.dist-side .card p {
  line-height: 1.6;
  margin: 0;
}

.dist-side .card p + p {
  margin-top: 1.1rem;
}

</style>
