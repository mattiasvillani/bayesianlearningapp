---
title: Multivariate normal
toc: false
---

# Multivariate normal distribution

```js
import * as math from "npm:mathjs";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const param = view(Inputs.form([
  Inputs.range([-1, 1], {label: "μ₁", step: 0.1, value: 0}),
  Inputs.range([-1, 1], {label: "μ₂", step: 0.1, value: 0}),
  Inputs.range([0.1, 2], {label: "σ₁", step: 0.1, value: 1}),
  Inputs.range([0.1, 2], {label: "σ₂", step: 0.1, value: 1}),
  Inputs.range([-0.99, 0.99], {label: "ρ", step: 0.01, value: 0})
]));
```

```js
function mvnpdf(x, mu, Sigma) {
  const p = mu.length;
  return (2 * Math.PI) ** (-p / 2) * math.det(Sigma) ** -0.5 *
    math.exp(-0.5 * math.multiply(math.multiply(math.transpose(math.subtract(x, mu)), math.inv(Sigma)), math.subtract(x, mu)));
}

const mu = [param[0], param[1]];
const sigma1 = param[2];
const sigma2 = param[3];
const rho = param[4];
const Sigma = [[sigma1 ** 2, rho * sigma1 * sigma2], [rho * sigma1 * sigma2, sigma2 ** 2]];
const maxpdf = mvnpdf(mu, mu, Sigma);

const ngrid = 60;
const mvnormal_on_grid = [];
for (const x1 of d3.range(-5, 5, 10 / ngrid)) {
  for (const x2 of d3.range(-5, 5, 10 / ngrid)) {
    mvnormal_on_grid.push({x1, x2, pdf: mvnpdf([x1, x2], mu, Sigma)});
  }
}
```

```js
Plot.plot({
  width: Math.min(500, width),
  height: Math.min(500, width),
  x: {label: "x₁", domain: [-5, 5]},
  y: {label: "x₂", domain: [-5, 5]},
  color: {
    range: ["white", mvcolors[0]], interpolate: "hsl",
    legend: true, type: "sequential", label: "pdf", domain: [0, maxpdf]
  },
  marks: [
    Plot.contour(mvnormal_on_grid, {
      filter: (d) => d.pdf > Number.EPSILON, x: "x1", y: "x2", fill: "pdf", stroke: "currentColor", blur: 4,
      levels: [0.01, 0.02, 0.3]
    })
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(\boldsymbol{x}) &= \vert 2\pi\boldsymbol{\Sigma}\vert^{-1/2}\exp\Big(-\frac{1}{2}(\boldsymbol{x}-\boldsymbol{\mu})^\top\boldsymbol{\Sigma}^{-1}(\boldsymbol{x}-\boldsymbol{\mu})\Big) \\[0.4em]
\mathbb{E}(\boldsymbol{x}) &= \boldsymbol{\mu} \\[0.4em]
\mathrm{Cov}(\boldsymbol{x}) &= \begin{pmatrix}\sigma_1^2 & \rho\sigma_1\sigma_2 \\ \rho\sigma_1\sigma_2 & \sigma_2^2\end{pmatrix}
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  | 1 | 2 |
|---|---|---|
| ${tex`\mathbb{E}(X)`} | ${mu[0].toPrecision(2)} | ${mu[1].toPrecision(2)} |
| ${tex`\mathbb{S}(X)`} | ${sigma1.toPrecision(3)} | ${sigma2.toPrecision(3)} |
| Covariance | ${(rho * sigma1 * sigma2).toPrecision(3)} |  |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/multivariate-normal-distribution" target="_blank" rel="noopener noreferrer">
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
