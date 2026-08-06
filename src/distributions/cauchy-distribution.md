---
title: Cauchy
toc: false
---

# Cauchy distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

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

```js
const x = d3.range(-15, 15, 0.01);
const cauchypdf = x.map((x) => ({x, pdf: jStat.studentt.pdf((x - params[0]) / params[1], 1) / params[1]}));
const normalpdf = x.map((x) => ({x, pdf: jStat.normal.pdf(x, params[0], params[1])}));
const cauchycdf = jStat.studentt.cdf((params[2] - params[0]) / params[1], 1);
const normcdf = jStat.normal.cdf(params[2], params[0], params[1]);
const peak = Math.max(1 / (Math.PI * params[1]), jStat.normal.pdf(params[0], params[0], params[1]));
```

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

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/cauchy-distribution" target="_blank" rel="noopener noreferrer">
<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="1.5" width="9" height="13" rx="1.2" stroke="currentColor" stroke-width="1.1"/>
  <line x1="4.2" y1="4.4" x2="8.8" y2="4.4" stroke="currentColor" stroke-width="0.9"/>
  <line x1="4.2" y1="6.6" x2="8.8" y2="6.6" stroke="currentColor" stroke-width="0.9"/>
  <line x1="4.2" y1="8.8" x2="7.2" y2="8.8" stroke="currentColor" stroke-width="0.9"/>
  <circle cx="12.3" cy="12.3" r="2.3" fill="#6C8EBF"/>
  <circle cx="10.4" cy="13.2" r="1.6" fill="#c0a34d"/>
  <circle cx="13.5" cy="13.6" r="1.4" fill="#007878"/>
</svg>
Original notebook ↗
</a>

</div>

</div>
