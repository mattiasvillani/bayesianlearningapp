---
title: The Riemann Integral
toc: false
---

# The Riemann Integral

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card intro-card">

The (definite) **Riemann integral**
${tex.block`\int_a^b f(x) \mathrm{d}x`}
of a function ${tex`f(x)`} measures the **area** under the function between ${tex`x=a`} and ${tex`x=b`}.

</div>

<div class="card params-card">

<b>Parameters</b>
${funcnameInput}
${aInput}
${bInput}
${deltaInput}

```js
const funcnameInput = Inputs.select(["linear", "exp", "log", "square", "cube", "sin", "gaussian"], {value: "square", label: "Function"});
const funcname = view(funcnameInput);
```

```js
const f = funcname === "linear" ? (xv) => xv
  : funcname === "exp" ? (xv) => Math.exp(xv)
  : funcname === "log" ? (xv) => Math.log(xv)
  : funcname === "square" ? (xv) => xv ** 2
  : funcname === "cube" ? (xv) => xv ** 3
  : funcname === "gaussian" ? (xv) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * xv ** 2)
  : (xv) => Math.sin(xv);

const trueIntegral = (av, bv) => funcname === "linear" ? (bv ** 2 - av ** 2) / 2
  : funcname === "exp" ? Math.exp(bv) - Math.exp(av)
  : funcname === "log" ? bv * (Math.log(bv) - 1) - av * (Math.log(av) - 1)
  : funcname === "square" ? (bv ** 3 - av ** 3) / 3
  : funcname === "cube" ? (bv ** 4 - av ** 4) / 4
  : funcname === "gaussian" ? jStat.normal.cdf(bv, 0, 1) - jStat.normal.cdf(av, 0, 1)
  : Math.cos(av) - Math.cos(bv);

const xdomain = funcname === "log" ? [1, 5] : funcname === "exp" ? [-2, 5] : [-5, 5];
const limits = [xdomain[0] + 0.5, xdomain[1] + 0.5];

const funcdataDense = d3.range(xdomain[0], xdomain[1], 0.01).map((xv) => ({x: xv, y: f(xv)}));
const ydomain = funcname === "gaussian" ? [0, 0.5]
  : [Math.floor(d3.min(funcdataDense, (d) => d.y)), Math.ceil(d3.max(funcdataDense, (d) => d.y))];
```

```js
const aInput = Inputs.range(limits, {value: -3, step: 0.1, label: tex`a`});
const a = view(aInput);
```

```js
const bInput = Inputs.range(limits, {value: 1, step: 0.1, label: tex`b`});
const b = view(bInput);
```

```js
const deltaInput = Inputs.range([0.0005, 1], {value: 0.75, step: 0.0005, label: tex`\text{bar width } \Delta`});
const delta = view(deltaInput);
```

</div>

<div class="card plot-card">

${tex`\sum_{i=1}^n f(x_i^\star)\Delta x_i`} = ${riemannSum} &nbsp;&nbsp;&rarr;&nbsp;&nbsp; ${tex`\int_a^b f(x)\,\mathrm{d}x`} = ${trueIntegralVal} &nbsp;&nbsp;as&nbsp;&nbsp; ${tex`\Delta`} = ${deltaVal} &rarr; 0

```js
const funcdata = d3.range(xdomain[0], xdomain[1], delta).map((xv) => ({x: xv, y: f(xv)}));
const riemannSumRaw = d3.sum(funcdata.filter((d) => d.x >= a && d.x <= b), (d) => d.y) * delta;
const riemannSum = riemannSumRaw.toFixed(4);
const trueIntegralVal = trueIntegral(a, b).toFixed(4);
const deltaVal = delta.toFixed(4);
const bindata = funcdata.map((d) => ({x1: d.x, x2: d.x + delta, y: f(d.x + delta / 2)}));
```

```js
Plot.plot({
  width: Math.min(900, width),
  height: 480,
  x: {label: "x", domain: xdomain, grid: false},
  y: {label: "f(x)", domain: ydomain, grid: false},
  marks: [
    Plot.ruleY([0]),
    Plot.line([{x: a, y: ydomain[0]}, {x: a, y: ydomain[1]}], {x: "x", y: "y", stroke: mvcolors[1]}),
    Plot.line([{x: b, y: ydomain[0]}, {x: b, y: ydomain[1]}], {x: "x", y: "y", stroke: mvcolors[1]}),
    Plot.text([{x: a, y: ydomain[1], label: "a"}, {x: b, y: ydomain[1], label: "b"}], {x: "x", y: "y", text: "label", dy: -7, fill: mvcolors[1]}),
    Plot.rectY(bindata, {
      filter: (d) => d.x1 >= a && d.x2 <= b,
      x1: "x1",
      x2: "x2",
      y: "y",
      strokeWidth: 0,
      fill: mvcolors[0],
      opacity: 0.5,
      insetLeft: 1,
      title: (d) => `Rectangle area = ${(delta * d.y).toPrecision(4)}`
    }),
    Plot.lineY(funcdataDense, {x: "x", y: "y", stroke: "var(--theme-foreground)", strokeWidth: 2})
  ]
})
```

</div>

</div>

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/the-riemann-integral")}

<style>

.dist-main form.inputs-3a86ea label {
  padding: 2px 0;
}

.dist-main form.inputs-3a86ea:not(.inputs-3a86ea-toggle) label {
  width: 160px;
}

.params-card select {
  width: 120px;
}

.params-card > p > b {
  display: block;
  margin-bottom: 0.6rem;
}

.intro-card {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
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
