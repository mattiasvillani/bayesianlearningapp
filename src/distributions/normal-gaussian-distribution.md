---
title: Normal (Gaussian)
toc: false
---

# Normal (Gaussian) distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-3, 3], {value: 0, step: 0.1, label: "μ"}),
  Inputs.range([0.1, 3], {value: 1, step: 0.1, label: "σ"}),
  Inputs.range([-10, 10], {value: -1.96, step: 0.01, label: "quantile"})
]));
```

```js
const normpdf = d3.range(-10, 10, 0.01).map((x) => ({x, pdf: jStat.normal.pdf(x, params[0], params[1])}));
const normcdf = jStat.normal.cdf(params[2], params[0], params[1]);
const maxpdf = jStat.normal.pdf(params[0], params[0], params[1]);
const textdata = [
  {x: params[0], y: 0.12 * maxpdf, text: "68%"},
  {x: params[0] - 1.5 * params[1], y: 0.12 * maxpdf, text: "95%"},
  {x: params[0] - 2.5 * params[1], y: 0.12 * maxpdf, text: "99.7%"}
];
```

<div class="grid grid-cols-2" style="margin: 0.5rem 0 0 0;">
  <div>

```js
Plot.plot({
  x: {label: "x", axis: true},
  y: {axis: false, domain: [0, maxpdf]},
  marks: [
    Plot.ruleY([0]),
    Plot.line(normpdf, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(normpdf, {filter: (d) => d.x <= params[2], x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

  </div>
  <div>

```js
Plot.plot({
  x: {label: "x", axis: true, domain: [params[0] - 4 * params[1], params[0] + 4 * params[1]]},
  y: {axis: false, domain: [0, 1.01 * maxpdf]},
  marks: [
    Plot.ruleY([0]),
    Plot.line(normpdf, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(normpdf, {
      filter: (d) => d.x >= params[0] - params[1] && d.x <= params[0] + params[1],
      x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.9
    }),
    Plot.areaY(normpdf, {
      filter: (d) => (d.x > params[0] - 2 * params[1] && d.x < params[0] - params[1]) ||
                     (d.x >= params[0] + params[1] && d.x <= params[0] + 2 * params[1]),
      x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.55
    }),
    Plot.areaY(normpdf, {
      filter: (d) => (d.x > params[0] - 3 * params[1] && d.x <= params[0] - 2 * params[1]) ||
                     (d.x > params[0] + 2 * params[1] && d.x <= params[0] + 3 * params[1]),
      x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.25
    }),
    Plot.text(textdata, {x: "x", y: "y", text: "text", fontSize: 16, textAnchor: "middle", frameAnchor: "middle"})
  ]
})
```

  </div>
</div>

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \frac{1}{\sqrt{2\pi\sigma^2}}e^{-\frac{1}{2\sigma^2}(x-\mu)^2} \\[0.4em]
\mathbb{E}(X) &= \mu \\[0.4em]
\mathbb{V}(X) &= \sigma^2
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${params[0].toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${params[1].toPrecision(3)} |
| ${tex`P(X \le ${params[2].toFixed(2)})`} | ${normcdf.toPrecision(4)} |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/normal-gaussian-distribution" target="_blank" rel="noopener noreferrer">
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
