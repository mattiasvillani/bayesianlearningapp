---
title: Linear Regression
toc: false
---

# Bayesian linear regression

```js
import * as math from "npm:mathjs";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {oneHot, cbind, leastSquares, zellnerPrior, ridgePrior, blockDiagonalPrior, bayesLinReg, marginalPosteriors} from "../components/regression.js";
```

> Bayesian linear regression of the [daily number of bike rides](https://www.kaggle.com/datasets/marklvl/bike-sharing-dataset) in Washington D.C. during 2011-2012, explained by temperature, weather, season, weekday and year, over two years of data.

```js
const bikes = FileAttachment("../data/bikesday_reduced.csv").csv({typed: true});
```

```js
const varnames = ["intercept", "feeltemp", "hum", "wind", "year", "holiday", "spring", "summer", "fall", "mist", "rain/snow", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const p = varnames.length;

const y = bikes.map((d) => d.nrides);
const Xbase = bikes.map((d) => [1, d.feeltemp, d.hum, d.windspeed, d.year, d.holiday]);
const XbaseRest = bikes.map((d) => [d.feeltemp, d.hum, d.windspeed, d.year, d.holiday]);
const seasonDummy = oneHot(bikes.map((d) => d.season));
const weatherDummy = oneHot(bikes.map((d) => d.weathersit));
const weekdayDummy = oneHot(bikes.map((d) => d.weekday));
const Z = cbind(Xbase, seasonDummy, weatherDummy, weekdayDummy);
const Zrest = cbind(XbaseRest, seasonDummy, weatherDummy, weekdayDummy); // Z without the intercept column

const ols = leastSquares(y, Z);
```

```js
function groupColor(vars) {
  return {domain: vars, range: vars.map((v, i) => mvcolors[i % mvcolors.length])};
}
function groupData(pdfs, vars) {
  return pdfs.filter((d) => vars.includes(d.variable));
}
function groupOls(vars) {
  return varnames.map((v, i) => ({variable: v, betaMle: ols.betaHat[i]})).filter((d) => vars.includes(d.variable));
}

const mainVars = ["intercept", "feeltemp", "hum", "wind", "year", "holiday"];
const seasonVars = ["spring", "summer", "fall"];
const weekdayVars = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const weatherVars = ["mist", "rain/snow"];
```

```js
function marginalPlot(data, olsPoints, title, colors) {
  return Plot.plot({
    width: Math.min(340, width),
    height: 250,
    style: {fontSize: "12px"},
    title: html`<span style="font-size: 13px; font-weight: 500;">${title}</span>`,
    color: {legend: true, ...colors},
    x: {label: null},
    y: {axis: false, label: null},
    marks: [
      Plot.ruleY([0]),
      Plot.lineY(data, {x: "x", y: "pdf", stroke: "variable", strokeWidth: 2}),
      Plot.dot(olsPoints, {x: "betaMle", y: 0, fill: "variable", r: 4})
    ]
  });
}
```

<div class="dist-layout dist-layout--wide">

<div class="card prior-settings-card">
<div class="prior-settings-row">
  <div>
  <b>Prior settings for ${tex`\boldsymbol{\beta}`}</b>
  <div class="prior-type-row">${priorTypeInput}</div>
  ${priorRestInput}
  </div>
  <div class="prior-settings-divider"></div>
  <div>
  <b>Prior settings for ${tex`\sigma^2`}</b>
  <div class="prior-type-row-spacer"></div>
  ${sigma2Input}
  </div>
</div>

```js
const priorTypeInput = Inputs.radio(["Zellner g-prior", "Ridge prior"], {label: tex`\Omega_{0,\text{rest}}\text{:}`, value: "Zellner g-prior"});
const priorType = view(priorTypeInput);
```

```js
const priorRestInput = Inputs.form([
  Inputs.range([1, 100000], {value: 100, step: 1, label: tex`\kappa_0`, transform: Math.log}),
  Inputs.range([-3000, 3000], {value: 1000, step: 10, label: tex`\mu_0`}),
  Inputs.range([1, 100000], {value: 5, step: 1, label: tex`\omega_0`, transform: Math.log})
]);
const priorRest = view(priorRestInput);
```

```js
const sigma2Input = Inputs.form([
  Inputs.range([0, 50], {value: 5, step: 1, label: tex`\nu_0`}),
  Inputs.range([10, 3000], {value: 1000, step: 10, label: tex`\sigma_0`})
]);
const sigma2Settings = view(sigma2Input);
```

</div>

<div class="card">

**Model**<br>

${tex`\boldsymbol{y} = \boldsymbol{X}\boldsymbol{\beta} + \boldsymbol{\varepsilon}, \quad \boldsymbol{\varepsilon}\sim \mathrm{N}(\boldsymbol{0},\sigma^2 \boldsymbol{I}_n)`}<br>

- ${tex`\boldsymbol{y}`} is ${tex`n\times 1`}
- ${tex`\boldsymbol{X}`} is the ${tex`n\times p`} design matrix 
- ${tex`\boldsymbol{\beta}`} is ${tex`p\times 1`} vector with regression coefficients.

</div>

</div>

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const kappa0 = priorRest[0];
const muIntercept = priorRest[1];
const omega0Intercept = priorRest[2];
const nu0 = sigma2Settings[0];
const sigma0 = sigma2Settings[1];

const restOmega0 = priorType === "Zellner g-prior" ? zellnerPrior(kappa0, Zrest) : ridgePrior(kappa0, p - 1);
const {mu0, Omega0} = blockDiagonalPrior(muIntercept, omega0Intercept, restOmega0);
const post = bayesLinReg(y, Z, mu0, Omega0, nu0, sigma0 ** 2);
const sigmaVect = post.invOmegaN.map((row, i) => Math.sqrt(post.sigma2N * row[i]));
const allMarginals = marginalPosteriors(post.muN, sigmaVect, post.nuN, varnames);
```

<b>Marginal posterior distributions</b>
<div class="grid grid-cols-2">
  <div>${marginalPlot(groupData(allMarginals, mainVars), groupOls(mainVars), "Main covariates", groupColor(mainVars))}</div>
  <div>${marginalPlot(groupData(allMarginals, seasonVars), groupOls(seasonVars), "Season covariates", groupColor(seasonVars))}</div>
  <div>${marginalPlot(groupData(allMarginals, weekdayVars), groupOls(weekdayVars), "Weekday covariates", groupColor(weekdayVars))}</div>
  <div>${marginalPlot(groupData(allMarginals, weatherVars), groupOls(weatherVars), "Weather covariates", groupColor(weatherVars))}</div>
</div>

<div style="font-size: 12px; color: var(--theme-foreground-muted);">Lines: marginal posterior ${tex`p(\beta_j\mid \boldsymbol{y})`}.<br>
Dots: least squares estimates ${tex`\hat\beta_j`}.</div>

</div>

</div>

<div class="dist-side">

<div class="card">

**Conjugate prior**<br>

${tex`\boldsymbol{\beta}\mid \sigma^2 \sim \mathrm{N}(\boldsymbol{\mu}_0,\sigma^2 \boldsymbol{\Omega}_0^{-1})`}<br>
${tex`\sigma^2 \sim \mathrm{Inv}\text{-}\chi^2(\nu_0,\sigma_0^2)`}

We assume prior independence between the intercept ${tex`\beta_0`} and the other coefficients ${tex`\boldsymbol{\beta}_{\text{rest}}`}

${tex.block`\boldsymbol{\Omega}_0 = \begin{pmatrix}\omega_0 & \boldsymbol{0}^\top \\ \boldsymbol{0} & \boldsymbol{\Omega}_{0,\text{rest}}\end{pmatrix}`}

**Intercept**: 
${tex.block`\beta_0\mid\sigma^2 \sim \mathrm{N}(\mu_0,\sigma^2/\omega_0)`}

**Regression coefficients**: 
${tex.block`\boldsymbol{\beta}_{\text{rest}}\mid\sigma^2 \sim \mathrm{N}(\boldsymbol{0},\sigma^2 \boldsymbol{\Omega}_{0,\text{rest}}^{-1})`}
using one of two choices:
  - Zellner's *g*-prior: ${tex`\boldsymbol{\Omega}_{0,\text{rest}} = \dfrac{\kappa_0}{n}\boldsymbol{X}_{\text{rest}}^\top\boldsymbol{X}_{\text{rest}}`}
  - Ridge prior: ${tex`\boldsymbol{\Omega}_{0,\text{rest}} = \kappa_0\boldsymbol{I}_{p-1}`}

where ${tex`\kappa_0`} is the prior sample size and ${tex`\boldsymbol{X}_{\text{rest}}`} is the design matrix without the intercept column.

</div>

<div class="card">

**Posterior**<br>
${tex`\boldsymbol{\beta}\mid \sigma^2,\boldsymbol{y} \sim \mathrm{N}(\boldsymbol{\mu}_n,\sigma^2 \boldsymbol{\Omega}_n^{-1})`}<br>
${tex`\sigma^2\mid \boldsymbol{y} \sim \mathrm{Inv}\text{-}\chi^2(\nu_n,\sigma_n^2)`}

- ${tex`\boldsymbol{\Omega}_n = \boldsymbol{X}^\top\boldsymbol{X}+\boldsymbol{\Omega}_0`}
- ${tex`\nu_n = \nu_0+n`}
- ${tex`\boldsymbol{\mu}_n = \boldsymbol{\Omega}_n^{-1}(\boldsymbol{X}^\top\boldsymbol{X}\hat{\boldsymbol{\beta}}+\boldsymbol{\Omega}_0\boldsymbol{\mu}_0)`}, 

where ${tex`\hat{\boldsymbol{\beta}}`} is the least squares estimate.

**Marginal posteriors**<br>
${tex`\beta_j\mid \boldsymbol{y} \sim t_{\nu_n}(\mu_{n,j},\sigma_{n,j}^2)`}

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/bayesian-linear-regression-bike-share-data")}

</div>

</div>

<style>

.dist-main figure {
  margin: 0;
}

.prior-settings-row {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.prior-settings-row form.inputs-3a86ea {
  --label-width: 60px;
  --input-width: 160px;
  width: auto;
}

.prior-type-row form.inputs-3a86ea {
  --label-width: auto;
}

.prior-type-row-spacer {
  height: 27.875px;
}

.prior-settings-divider {
  align-self: stretch;
  width: 1px;
  background: color-mix(in srgb, var(--theme-foreground) 20%, transparent);
}

</style>
