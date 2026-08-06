---
title: Dirichlet
toc: false
---

# Dirichlet Distribution

```js
import * as math from "npm:mathjs";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0.01, 15], {value: 1.5, step: 0.01, label: "α₁"}),
  Inputs.range([0.01, 15], {value: 1.5, step: 0.01, label: "α₂"}),
  Inputs.range([0.01, 15], {value: 1.5, step: 0.01, label: "α₃"})
]));
```

```js
function logBeta(alpha) {
  return alpha.reduce((s, a) => s + math.lgamma(a), 0) - math.lgamma(alpha.reduce((s, a) => s + a, 0));
}
function dirichletPdf(x, alpha) {
  let logp = -logBeta(alpha);
  for (let i = 0; i < x.length; i++) logp += (alpha[i] - 1) * Math.log(x[i]);
  return Math.exp(logp);
}

const alpha = [params[0], params[1], params[2]];
const alpha0 = alpha[0] + alpha[1] + alpha[2];

const resolution = 80;
const grid = [];
for (let i = 1; i < resolution; i++) {
  for (let j = 1; j < resolution - i; j++) {
    const x1 = i / resolution;
    const x2 = j / resolution;
    const x3 = 1 - x1 - x2;
    grid.push({x1, x2, pdf: dirichletPdf([x1, x2, x3], alpha)});
  }
}
const maxpdf = d3.max(grid, (d) => d.pdf);
```

```js
Plot.plot({
  width: Math.min(500, width),
  height: Math.min(500, width),
  x: {label: "x₁", domain: [0, 1]},
  y: {label: "x₂", domain: [0, 1]},
  color: {
    range: ["white", mvcolors[0]], interpolate: "hsl",
    legend: true, type: "sequential", label: "pdf", domain: [0, maxpdf]
  },
  marks: [
    Plot.contour(grid, {x: "x1", y: "x2", fill: "pdf", stroke: "currentColor", blur: 2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(\boldsymbol{x}) &= \frac{1}{\Beta(\boldsymbol{\alpha})} \prod_{i=1}^3 x_i^{\alpha_i-1} \\[0.4em]
\mathbb{E}(x_i) &= \frac{\alpha_i}{\alpha_0} \\[0.4em]
\mathbb{V}(x_i) &= \frac{\alpha_i(\alpha_0-\alpha_i)}{\alpha_0^2(\alpha_0+1)}
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  | 1 | 2 | 3 |
|---|---|---|---|
| ${tex`\mathbb{E}(x_i)`} | ${(alpha[0] / alpha0).toPrecision(3)} | ${(alpha[1] / alpha0).toPrecision(3)} | ${(alpha[2] / alpha0).toPrecision(3)} |
| ${tex`\mathbb{S}(x_i)`} | ${Math.sqrt((alpha[0] * (alpha0 - alpha[0])) / (alpha0 ** 2 * (alpha0 + 1))).toPrecision(3)} | ${Math.sqrt((alpha[1] * (alpha0 - alpha[1])) / (alpha0 ** 2 * (alpha0 + 1))).toPrecision(3)} | ${Math.sqrt((alpha[2] * (alpha0 - alpha[2])) / (alpha0 ** 2 * (alpha0 + 1))).toPrecision(3)} |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/dirichlet-distribution" target="_blank" rel="noopener noreferrer">
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
