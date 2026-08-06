---
title: Multivariate logit-normal
toc: false
---

# Multivariate LogitNormal Distribution

```js
import * as math from "npm:mathjs";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-1, 1], {label: "μ₁", step: 0.1, value: 0}),
  Inputs.range([-1, 1], {label: "μ₂", step: 0.1, value: 0}),
  Inputs.range([0.1, 2], {label: "σ₁", step: 0.1, value: 1}),
  Inputs.range([0.1, 2], {label: "σ₂", step: 0.1, value: 1}),
  Inputs.range([-0.99, 0.99], {label: "ρ", step: 0.01, value: 0})
]));
```

```js
function multiLogitNormalPdf(x, mu, Sigma) {
  const p = mu.length;
  const logDet = -(p / 2) * Math.log(2 * Math.PI) - 0.5 * Math.log(math.det(Sigma));
  const logJacobian = -x.reduce((s, d) => s + Math.log(d), 0);
  const xtilde = x.slice(0, p).map((d) => Math.log(d / x[p]));
  const diff = math.subtract(xtilde, mu);
  const quad = -0.5 * math.multiply(math.multiply(math.transpose(diff), math.inv(Sigma)), diff);
  return Math.exp(logDet + logJacobian + quad);
}

const mu = [params[0], params[1]];
const sigma1 = params[2];
const sigma2 = params[3];
const rho = params[4];
const Sigma = [[sigma1 ** 2, rho * sigma1 * sigma2], [rho * sigma1 * sigma2, sigma2 ** 2]];

const resolution = 80;
const grid = [];
for (let i = 1; i < resolution; i++) {
  for (let j = 1; j < resolution - i; j++) {
    const x1 = i / resolution;
    const x2 = j / resolution;
    const x3 = 1 - x1 - x2;
    grid.push({x1, x2, pdf: multiLogitNormalPdf([x1, x2, x3], mu, Sigma)});
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
f(\boldsymbol{x}) &= \vert 2\pi\boldsymbol{\Sigma}\vert^{-1/2}\exp\Big(-\frac{1}{2}(\tilde{\boldsymbol{x}}-\boldsymbol{\mu})^\top\boldsymbol{\Sigma}^{-1}(\tilde{\boldsymbol{x}}-\boldsymbol{\mu})\Big) \\[0.4em]
\tilde{\boldsymbol{x}} &= \big(\log(x_1/x_3),\ \log(x_2/x_3)\big) \\[0.4em]
\mathrm{Cov}(\tilde{\boldsymbol{x}}) &= \begin{pmatrix}\sigma_1^2 & \rho\sigma_1\sigma_2 \\ \rho\sigma_1\sigma_2 & \sigma_2^2\end{pmatrix}
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  | 1 | 2 |
|---|---|---|
| ${tex`\mathbb{E}(\tilde{X})`} | ${mu[0].toPrecision(2)} | ${mu[1].toPrecision(2)} |
| ${tex`\mathbb{S}(\tilde{X})`} | ${sigma1.toPrecision(3)} | ${sigma2.toPrecision(3)} |
| Covariance | ${(rho * sigma1 * sigma2).toPrecision(3)} |  |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/multivariate-logitnormal-distribution" target="_blank" rel="noopener noreferrer">
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
