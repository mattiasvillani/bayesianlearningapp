---
title: Multivariate Logistic Normal
toc: false
---

# Multivariate Logistic Normal Distribution

```js
import * as math from "npm:mathjs";
import {notebookLink} from "../components/notebookLink.js";
import {ternaryDensity, ternaryGrid} from "../components/functionLibrary.js";
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

const resolution = 40;
const density = ternaryGrid(resolution, (x) => multiLogitNormalPdf(x, mu, Sigma));
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
ternaryDensity(density, resolution, {size: Math.min(400, width)})
```

</div>

</div>

<div class="dist-side">

<div class="card properties-card">

### Properties

```tex
\begin{aligned}
f(\boldsymbol{x}) &= \vert 2\pi\boldsymbol{\Sigma}\vert^{-1/2}\Big(\prod_{k=1}^K x_k\Big)^{-1}\exp\Big(-\frac{1}{2}(\tilde{\boldsymbol{x}}-\boldsymbol{\mu})^\top\boldsymbol{\Sigma}^{-1}(\tilde{\boldsymbol{x}}-\boldsymbol{\mu})\Big) \\[0.4em]
\tilde{\boldsymbol{x}} &= \Big(\log(x_1/x_K),\log(x_2/x_K),\ldots, \log(x_{K-1}/x_K)\Big)
\end{aligned}
```

</div>


${notebookLink("https://observablehq.com/@mattiasvillani/multivariate-logisticnormal-distribution")}

</div>

</div>

<style>

.properties-card .katex {
  font-size: 0.95em;
}

</style>
