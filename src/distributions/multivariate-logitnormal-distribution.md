---
title: Multivariate logit-normal
toc: false
---

# Multivariate LogitNormal Distribution

```js
import * as math from "npm:mathjs";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
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

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

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

</div>

<div class="card">

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

${notebookLink("https://observablehq.com/@mattiasvillani/multivariate-logitnormal-distribution")}

</div>

</div>
