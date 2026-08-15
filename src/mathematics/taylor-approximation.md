---
title: The Taylor Approximation
toc: false
---

# The Taylor Approximation

_This interactive visualization shows how a smooth function ${tex`f(x)`} can be approximated locally by polynomials tailored to ${tex`f(x)`}._

```js
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card taylor-def-card">

The ${tex`n`}th order **Taylor approximation** of the function ${tex`f(x)`} around ${tex`x=x_0`} is
${tex.block`\hat{f}_n(x) := f(x_0) + \sum_{k=1}^n \frac{f^{(k)}(x_0)}{k!}(x-x_0)^k`}
where
${tex.block`f^{(k)}(x_0) = \frac{\mathrm{d}^k}{\mathrm{d} x^k}f(x)\Big\vert_{x=x_0}`}
is the ${tex`k`}th derivative of ${tex`f(x)`} evaluated at ${tex`x=x_0`}.

</div>

<div class="card params-card">

<b>Parameters</b>
${funcnameInput}
${orderInput}
${x0Input}

```js
const funcnameInput = Inputs.select(["exp", "log", "square", "cube", "sqrt", "sin", "cos", "cauchy kernel"], {value: "exp", label: html`Function ${tex`f(x)`}`});
const funcname = view(funcnameInput);
```

```js
const f = funcname === "exp" ? Array(6).fill((xv) => Math.exp(xv))
  : funcname === "square" ? [(xv) => xv ** 2, (xv) => 2 * xv, () => 2, () => 0, () => 0, () => 0]
  : funcname === "cube" ? [(xv) => xv ** 3, (xv) => 3 * xv ** 2, (xv) => 6 * xv, () => 6, () => 0, () => 0]
  : funcname === "log" ? [(xv) => Math.log(xv), (xv) => 1 / xv, (xv) => -1 / xv ** 2, (xv) => 2 / xv ** 3, (xv) => -6 / xv ** 4, (xv) => 24 / xv ** 5]
  : funcname === "sqrt" ? [(xv) => Math.sqrt(xv), (xv) => (1 / 2) / xv ** (1 / 2), (xv) => -(1 / 4) / xv ** (3 / 2), (xv) => (3 / 8) / xv ** (5 / 2), (xv) => -(15 / 16) / xv ** (7 / 2), (xv) => (105 / 32) / xv ** (9 / 2)]
  : funcname === "sin" ? [(xv) => Math.sin(xv), (xv) => Math.cos(xv), (xv) => -Math.sin(xv), (xv) => -Math.cos(xv), (xv) => Math.sin(xv), (xv) => Math.cos(xv)]
  : funcname === "cos" ? [(xv) => Math.cos(xv), (xv) => -Math.sin(xv), (xv) => -Math.cos(xv), (xv) => Math.sin(xv), (xv) => Math.cos(xv), (xv) => -Math.sin(xv)]
  : [
      (xv) => 1 / (1 + xv ** 2),
      (xv) => (-2 * xv) / (1 + xv ** 2) ** 2,
      (xv) => (8 * xv ** 2) / (1 + xv ** 2) ** 3 - 2 / (1 + xv ** 2) ** 2,
      (xv) => (24 * xv) / (1 + xv ** 2) ** 3 - (48 * xv ** 3) / (1 + xv ** 2) ** 4,
      (xv) => (24 * (1 - 10 * xv ** 2 + 5 * xv ** 4)) / (1 + xv ** 2) ** 5,
      (xv) => (-240 * xv * (-3 + xv ** 2) * (-1 + 3 * xv ** 2)) / (1 + xv ** 2) ** 6
    ];

const xdomain = funcname === "log" ? [0.1, 5]
  : funcname === "exp" ? [-3, 3]
  : funcname === "square" ? [-2, 2]
  : funcname === "cube" ? [-2, 2]
  : funcname === "sqrt" ? [0.01, 5]
  : funcname === "cos" ? [-2 * Math.PI, 2 * Math.PI]
  : funcname === "sin" ? [-2 * Math.PI, 2 * Math.PI]
  : funcname === "cauchy kernel" ? [-1, 3]
  : [-5, 5];

const x0init = funcname === "log" ? 0.5
  : funcname === "exp" ? 0
  : funcname === "square" ? 0.5
  : funcname === "cube" ? 0.5
  : funcname === "sqrt" ? 0.5
  : funcname === "cos" ? 0.5
  : funcname === "sin" ? 0.5
  : 0;

const latexfunc = funcname === "exp" ? "f(x) = \\exp(x)"
  : funcname === "log" ? "f(x) = \\log(x)"
  : funcname === "square" ? "f(x) = x^2"
  : funcname === "cube" ? "f(x) = x^3"
  : funcname === "sqrt" ? "f(x) = \\sqrt{x}"
  : funcname === "cos" ? "f(x) = \\cos(x)"
  : funcname === "cauchy kernel" ? "f(x) = \\frac{1}{1 + x^2}"
  : "f(x) = \\sin(x)";
const plotTitle = tex(Object.assign([latexfunc], {raw: [latexfunc]}));
```

```js
const orderInput = Inputs.range([1, 5], {value: 1, step: 1, label: tex`\text{Taylor order, } n`});
const order = view(orderInput);
```

```js
const x0Input = Inputs.range(xdomain, {value: x0init, step: 0.1, label: tex`\text{Expansion point, } x_0`});
const x0 = view(x0Input);
```

</div>

<div class="card plot-card">

```js
function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

const ngrid = 500;
const funcdata = d3.range(xdomain[0], xdomain[1], (xdomain[1] - xdomain[0]) / ngrid).map((xv) => {
  let fapprox = 0;
  for (let j = 0; j < order + 1; j++) {
    fapprox += (f[j](x0) / factorial(j)) * (xv - x0) ** j;
  }
  return {x: xv, f: f[0](xv), fapprox};
});

const plotDomain = ["f(x)", `Taylor approximation of order ${order}`];
const plotRange = [mvcolors[0], mvcolors[order + 1]];
const ydomain = d3.extent(funcdata, (d) => d.f);
```

```js
Plot.plot({
  width: Math.min(900, width),
  height: 480,
  title: plotTitle,
  color: {legend: true, domain: plotDomain, range: plotRange},
  x: {label: "x"},
  y: {label: "f(x)", domain: ydomain},
  marks: [
    Plot.ruleY([ydomain[0]]),
    Plot.line([{x: x0, y: ydomain[0]}, {x: x0, y: f[0](x0)}], {x: "x", y: "y", stroke: "var(--theme-foreground-muted)", strokeDasharray: "4,4"}),
    Plot.text([{x: x0, y: ydomain[0], label: "x₀"}], {x: "x", y: "y", text: "label", dy: 20, fill: "var(--theme-foreground-muted)", fontSize: 16}),
    Plot.lineY(funcdata, {x: "x", y: "f", stroke: mvcolors[0], strokeWidth: 2.5}),
    Plot.lineY(funcdata, {x: "x", y: "fapprox", stroke: mvcolors[order + 1], strokeWidth: 2.5}),
    Plot.dot([{x: x0, y: f[0](x0)}], {x: "x", y: "y", stroke: mvcolors[order + 1], fill: mvcolors[order + 1]})
  ]
})
```

</div>

</div>

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/taylor-approximation")}

<style>

.dist-main form.inputs-3a86ea label {
  padding: 2px 0;
}

.dist-main form.inputs-3a86ea:not(.inputs-3a86ea-toggle) label {
  width: 180px;
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

.taylor-def-card {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.taylor-def-card p {
  margin: 0;
}

.taylor-def-card p + p {
  margin-top: 0.6rem;
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
