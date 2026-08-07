---
title: Cauchy
toc: false
---

# Cauchy distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const x = d3.range(-15, 15, 0.01);
const cauchypdf = x.map((x) => ({x, pdf: jStat.studentt.pdf((x - params[0]) / params[1], 1) / params[1]}));
const normalpdf = x.map((x) => ({x, pdf: jStat.normal.pdf(x, params[0], params[1])}));
const cauchycdf = jStat.studentt.cdf((params[2] - params[0]) / params[1], 1);
const normcdf = jStat.normal.cdf(params[2], params[0], params[1]);
const peak = Math.max(1 / (Math.PI * params[1]), jStat.normal.pdf(params[0], params[0], params[1]));
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-5, 5], {value: 0, step: 0.1, label: "location μ"}),
  Inputs.range([0.1, 5], {value: 1, step: 0.1, label: "scale τ"}),
  Inputs.range([-10, 10], {value: -1.96, step: 0.01, label: "quantile"})
]));
```

```js
const shownormal = view(Inputs.toggle({value: false, label: "show normal"}));
```

</div>

<div class="card">

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true},
  y: {axis: false, domain: [0, 1.05 * peak]},
  marks: [
    Plot.ruleY([0]),
    Plot.line(cauchypdf, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(cauchypdf, {filter: (d) => d.x <= params[2], x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2}),
    ...(shownormal ? [
      Plot.line(normalpdf, {x: "x", y: "pdf", stroke: mvcolors[1], strokeWidth: 2}),
      Plot.areaY(normalpdf, {filter: (d) => d.x <= params[2], x: "x", y: "pdf", fill: mvcolors[1], opacity: 0.2})
    ] : [])
  ]
})
```

</div>

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \frac{1}{\pi\tau\Big(1+\big(\frac{x-\mu}{\tau}\big)^2\Big)} \\[0.4em]
\mathbb{E}(X) &= \text{undefined} \\[0.4em]
\mathbb{V}(X) &= \text{undefined}
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | — |
| ${tex`\mathbb{S}(X)`} | — |
| ${tex`P(X \le ${params[2].toFixed(2)})`} | ${cauchycdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/cauchy-distribution")}

</div>

</div>
