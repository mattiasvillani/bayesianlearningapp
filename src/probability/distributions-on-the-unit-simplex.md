---
title: Distributions on the Unit Simplex
toc: false
---

# Distributions on the unit simplex

_The two main distributions on the unit simplex ${tex`\sum_{k=1}^K x_k = 1,\ x_k \geq 0`} are the [Dirichlet](../distributions/dirichlet-distribution) and the [multivariate LogitNormal](../distributions/multivariate-logisticnormal-distribution)._

```js
import * as math from "npm:mathjs";
import {notebookLink} from "../components/notebookLink.js";
import {ternaryDensity, ternaryGrid, densityLegend, themeColor} from "../components/functionLibrary.js";
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
function multiLogitNormalPdf(x, mu, Sigma) {
  const p = mu.length;
  const logDet = -(p / 2) * Math.log(2 * Math.PI) - 0.5 * Math.log(math.det(Sigma));
  const logJacobian = -x.reduce((s, d) => s + Math.log(d), 0);
  const xtilde = x.slice(0, p).map((d) => Math.log(d / x[p]));
  const diff = math.subtract(xtilde, mu);
  const quad = -0.5 * math.multiply(math.multiply(math.transpose(diff), math.inv(Sigma)), diff);
  return Math.exp(logDet + logJacobian + quad);
}
```

```js
// digamma and trigamma via standard asymptotic-series approximations (mathjs has no special function for these)
function digamma(x) {
  let r = 0;
  while (x < 6) { r -= 1 / x; x += 1; }
  const x2 = 1 / (x * x);
  return r + Math.log(x) - 1 / (2 * x) - x2 * (1 / 12 - x2 * (1 / 120 - x2 * (1 / 252 - x2 * (1 / 240 - x2 / 132))));
}
function trigamma(x) {
  let r = 0;
  while (x < 6) { r += 1 / (x * x); x += 1; }
  return r + 1 / x + 1 / (2 * x ** 2) + 1 / (6 * x ** 3) - 1 / (30 * x ** 5) + 1 / (42 * x ** 7) - 1 / (30 * x ** 9);
}
```

```js
void dark; // re-resolve these on every light/dark toggle, not just on first render
const dirichletColor = themeColor("--mv-color-5", "#3A6B35");
const logitColor = themeColor("--mv-color-0", "#6C8EBF");
```

<div class="dist-layout">

<div class="dist-main" style="grid-column: 1 / -1;">

<div style="display: flex; gap: 1rem;">

<div class="card half-card">

<b style="color: var(--mv-color-5);">Dirichlet distribution</b>

Draw a ${tex`K`}-dimensional vector ${tex`\boldsymbol{y} =(y_1,\ldots,y_K)^\top`} with independent elements ${tex`y_k \sim \mathrm{Gamma}(\alpha_k,1)`} and normalize

${tex.block`x_k = \frac{y_k}{\sum_{j=1}^K y_j} \text{ for }k=1,\ldots,K.`}

The density is

${tex.block`\mathrm{Dirichlet}(\boldsymbol{x} \mid \boldsymbol{\alpha}) = \frac{1}{\mathrm{B}(\boldsymbol{\alpha})} \prod_{k=1}^K x_k^{\alpha_k - 1}`}

where ${tex`\mathrm{B}(\boldsymbol{\alpha})`} is the [multivariate Beta function](https://en.wikipedia.org/wiki/Beta_function#Multivariate_beta_function) and ${tex`\alpha_k > 0`}.

</div>

<div class="card half-card">

<b style="color: var(--mv-color-0);">Multivariate LogitNormal distribution</b>

Draw a ${tex`(K-1)`}-dimensional normal vector ${tex`\boldsymbol{y} =(y_1,\ldots,y_{K-1})^\top`} from ${tex`N(\boldsymbol{\mu},\boldsymbol{\Sigma})`} and apply the softmax transformation

${tex.block`x_k = \frac{e^{y_k}}{\sum_{j=1}^{K}e^{y_j}} \text{ for }k=1,\ldots,K, \text{ where }y_K = 0.`}

The density is

${tex.block`\mathrm{LogitN}(\boldsymbol{x} \mid \boldsymbol{\mu}, \boldsymbol{\Sigma}) = \frac{\exp\big( -\tfrac{1}{2}(\tilde{\boldsymbol{x}}-\boldsymbol{\mu})^\top\boldsymbol{\Sigma}^{-1}(\tilde{\boldsymbol{x}} - \boldsymbol{\mu}) \big)}{\vert 2\pi \boldsymbol{\Sigma} \vert^{1/2} \prod_{k=1}^K x_k}`}

where ${tex`\tilde{\boldsymbol{x}} = (\log(x_1/x_K),\ldots,\log(x_{K-1}/x_K))^\top`}. 

</div>

</div>

<div style="display: flex; gap: 1rem;">

<div class="card half-card">

<b style="color: var(--mv-color-5);">Dirichlet</b>

```js
const dirichletInput = Inputs.form([
  Inputs.range([0.01, 10], {value: 2, step: 0.01, label: tex`\alpha_1`}),
  Inputs.range([0.01, 10], {value: 2, step: 0.01, label: tex`\alpha_2`}),
  Inputs.range([0.01, 10], {value: 2, step: 0.01, label: tex`\alpha_3`})
]);
const alphaInput = view(dirichletInput);
```

</div>

<div class="card half-card">

<b style="color: var(--mv-color-0);">Multivariate LogitNormal</b>

```js
const logitInput = Inputs.form([
  Inputs.range([-1, 1], {value: 1, step: 0.1, label: tex`\mu_1`}),
  Inputs.range([-1, 1], {value: 0.5, step: 0.1, label: tex`\mu_2`}),
  Inputs.range([0.1, 2], {value: 0.5, step: 0.1, label: tex`\sigma_1`}),
  Inputs.range([0.1, 2], {value: 1, step: 0.1, label: tex`\sigma_2`}),
  Inputs.range([-0.99, 0.99], {value: 0.9, step: 0.01, label: tex`\rho`})
]);
const logitParams = view(logitInput);
```

<div class="kl-toggle">${klInput}</div>

```js
const klInput = Inputs.toggle({label: "Set parameters to approximate the Dirichlet", value: false});
const klApprox = view(klInput);
```

```js
// Grey out the LogitNormal sliders while its parameters are set by the KL approximation
for (const el of logitInput.querySelectorAll("input")) el.disabled = klApprox;
logitInput.style.opacity = klApprox ? 0.5 : 1;
```

</div>

</div>

<div class="card">

```js
const alpha = [alphaInput[0], alphaInput[1], alphaInput[2]];

// KL-closest LogitNormal to Dirichlet(α): moments of the log-ratios log(x_k/x_K)
const sigma1 = klApprox ? Math.sqrt(trigamma(alpha[0]) + trigamma(alpha[2])) : logitParams[2];
const sigma2 = klApprox ? Math.sqrt(trigamma(alpha[1]) + trigamma(alpha[2])) : logitParams[3];
const mu = klApprox ? [digamma(alpha[0]) - digamma(alpha[2]), digamma(alpha[1]) - digamma(alpha[2])] : [logitParams[0], logitParams[1]];
const rho = klApprox ? trigamma(alpha[2]) / (sigma1 * sigma2) : logitParams[4];
const Sigma = [[sigma1 ** 2, rho * sigma1 * sigma2], [rho * sigma1 * sigma2, sigma2 ** 2]];

const resolution = 40;
const densityDirichlet = ternaryGrid(resolution, (x) => dirichletPdf(x, alpha));
const densityLogit = ternaryGrid(resolution, (x) => multiLogitNormalPdf(x, mu, Sigma));
const plotSize = Math.min(400, Math.max(260, (width - 80) / 2));

// The simplex apex sits at y = √3/2 of the square plot area, leaving an empty band above
// the triangle; crop it off the viewBox so the plot sits close to its title
function ternaryPlot(density, color) {
  const margin = 30;
  const node = ternaryDensity(density, resolution, {size: plotSize, color, dark});
  const crop = margin + (plotSize - 2 * margin) * (1 - Math.sqrt(3) / 2) - 18;
  node.setAttribute("viewBox", [0, crop, plotSize, plotSize - crop]);
  node.setAttribute("height", plotSize - crop);
  return node;
}

// The horizontal legend's svg is exactly `length` wide, so let the last tick label spill past it
function legend(density, color) {
  const node = densityLegend(d3.extent(density, (d) => d.density), {orientation: "horizontal", length: 240, color, label: "density", tickFontSize: "10px", labelFontSize: "11px"});
  node.style.overflow = "visible";
  return node;
}
```

<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
  <div class="simplex-plot">
    <div class="simplex-title" style="color: var(--mv-color-5);">${tex`\mathrm{Dirichlet}\big(\boldsymbol{\alpha} = (${alpha[0]},\,${alpha[1]},\,${alpha[2]})\big)`}</div>
    ${ternaryPlot(densityDirichlet, dirichletColor)}
    ${legend(densityDirichlet, dirichletColor)}
  </div>
  <div class="simplex-plot">
    <div class="simplex-title" style="color: var(--mv-color-0);">${tex`\mathrm{LogitN}\big(\boldsymbol{\mu} = (${mu[0].toFixed(2)},\,${mu[1].toFixed(2)}),\ \boldsymbol{\sigma} = (${sigma1.toFixed(2)},\,${sigma2.toFixed(2)}),\ \rho = ${rho.toFixed(2)}\big)`}</div>
    ${ternaryPlot(densityLogit, logitColor)}
    ${legend(densityLogit, logitColor)}
  </div>
</div>

</div>

</div>

</div>

_The ternary plot is adapted from **Herb Susmann**'s [notebook](https://observablehq.com/@herbps10)._

${notebookLink("https://observablehq.com/@mattiasvillani/distributions-on-the-unit-simplex")}

<style>

.dist-main {
  gap: 0.5rem;
}

.half-card {
  flex: 1 1 0;
  min-width: 0;
}

.half-card .katex-display {
  font-size: 0.9em;
  overflow-x: auto;
  overflow-y: hidden;
}

.kl-toggle form > label {
  width: auto;
  white-space: nowrap;
  margin-right: 0.5rem;
}

.simplex-plot {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 260px;
}

.simplex-title {
  font-size: 14px;
  text-align: center;
  min-height: 3em;
  margin-bottom: 0.25rem;
}

</style>
