---
title: Multivariate normal
toc: false
---

# Multivariate normal distribution

```js
import * as math from "npm:mathjs";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
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

${notebookLink("https://observablehq.com/@mattiasvillani/multivariate-normal-distribution")}

</div>

</div>
