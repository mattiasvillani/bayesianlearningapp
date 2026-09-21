---
title: Kalman Filter - Nile Data
toc: false
---

# Kalman filtering Nile river data

_The Kalman filter computes the instantaneous estimate ${tex`\mu_{t\vert t}`} of an unobserved state at time ${tex`t`}, using only the data observed up to that time._

```js
import * as optimjs from "npm:optimization-js";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {kalmanFilter, kalmanSmoother, kalmanLogLik} from "../components/statespace.js";
```

```js
const data = FileAttachment("../data/nile.csv").csv({typed: true});
```

```js
const y = data.map((d) => d.x);
const n = y.length;
const startYear = 1871;
```

```js
// Local level model: y_t = mu_t + eps_t, mu_t = mu_{t-1} + eta_t. A = C = [[1]].
function negLogLikLocalLevel(logParams, y, initmean, initstd) {
  const V = [[Math.exp(logParams[0])]];
  const W = [[Math.exp(logParams[1])]];
  const mu0 = [initmean];
  const Omega0 = [[initstd ** 2]];
  const Y = y.map((yt) => [yt]);
  return -kalmanLogLik(Y, [[1]], [[1]], V, W, mu0, Omega0);
}

function estimateLocalLevelMLE(y, initmean, initstd) {
  const postMode = optimjs.minimize_Powell((p) => negLogLikLocalLevel(p, y, initmean, initstd), [10, 10]).argument;
  return {sigmaeps: Math.sqrt(Math.exp(postMode[0])), sigmaeta: Math.sqrt(Math.exp(postMode[1]))};
}
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

<b>Model settings</b>
<div class="optparam-row">${optparamInput}</div>
${paramInput}

```js
const optparamInput = Inputs.toggle({label: tex`\text{estimate }\sigma_\varepsilon\text{ and }\sigma_\eta\text{ by maximum likelihood}`, value: false});
const optparam = view(optparamInput);
```

```js
const paramInput = optparam
  ? Inputs.form([Inputs.text({value: "Parameters estimated by maximum likelihood", label: "", disabled: true})])
  : Inputs.form({
      sigmaeps: Inputs.range([1, 300], {value: 100, step: 0.1, label: tex`\text{noise std }\sigma_\varepsilon`}),
      sigmaeta: Inputs.range([1, 300], {value: 100, step: 0.1, label: tex`\text{innov std }\sigma_\eta`}),
      initmean: Inputs.range([-2000, 2000], {value: 1000, step: 1, label: tex`\text{initial mean }\mu_{0\vert 0}`}),
      initstd: Inputs.range([1, 1000], {value: 100, step: 1, label: tex`\text{initial stdev }\sigma_{0\vert 0}`})
    });
const paramSettings = view(paramInput);
```

```js
const initmean = optparam ? 1000 : paramSettings.initmean;
const initstd = optparam ? 1000 : paramSettings.initstd;
const mle = optparam ? estimateLocalLevelMLE(y, initmean, initstd) : null;
const sigmaeps = optparam ? mle.sigmaeps : paramSettings.sigmaeps;
const sigmaeta = optparam ? mle.sigmaeta : paramSettings.sigmaeta;
```

<b>Plot</b>
<div class="plot-selector-grid">
  <div>${showTimeSeriesInput}</div>
  <div>${showFilterMeanInput}</div>
  <div>${showFilterIntervalInput}</div>
  <div></div>
  <div>${showSmoothMeanInput}</div>
  <div>${showSmoothIntervalInput}</div>
</div>

```js
const showTimeSeriesInput = Inputs.toggle({label: "time series", value: true});
const showTimeSeries = view(showTimeSeriesInput);
```

```js
const showFilterMeanInput = Inputs.toggle({label: "filtering mean", value: true});
const showFilterMean = view(showFilterMeanInput);
```

```js
const showFilterIntervalInput = Inputs.toggle({label: "95% filtering interval", value: true});
const showFilterInterval = view(showFilterIntervalInput);
```

```js
const showSmoothMeanInput = Inputs.toggle({label: "smoothing mean", value: false});
const showSmoothMean = view(showSmoothMeanInput);
```

```js
const showSmoothIntervalInput = Inputs.toggle({label: "95% smoothing interval", value: false});
const showSmoothInterval = view(showSmoothIntervalInput);
```

```js
const plotSelector = [
  ...(showTimeSeries ? ["time series"] : []),
  ...(showFilterMean ? ["filtering mean"] : []),
  ...(showFilterInterval ? ["95% filtering interval"] : []),
  ...(showSmoothMean ? ["smoothing mean"] : []),
  ...(showSmoothInterval ? ["95% smoothing interval"] : [])
];
```

</div>

<div class="card">

```js
const A = [[1]];
const C = [[1]];
const V = [[sigmaeps ** 2]];
const W = [[sigmaeta ** 2]];
const mu0 = [initmean];
const Omega0 = [[initstd ** 2]];
const Y = y.map((yt) => [yt]);
const {muFilter, OmegaFilter, muPred, OmegaPred} = kalmanFilter(Y, A, C, V, W, mu0, Omega0);
const {muSmooth, OmegaSmooth} = kalmanSmoother(A, muFilter, OmegaFilter, muPred, OmegaPred);
```

```js
const seriesData = [];
const intervalData = [];
for (let t = 0; t < n; t++) {
  const year = new Date(startYear + t, 0, 2);
  const muFilt = muFilter[t][0];
  const sdFilt = Math.sqrt(OmegaFilter[t][0][0]);
  const muSm = muSmooth[t][0];
  const sdSm = Math.sqrt(OmegaSmooth[t][0][0]);
  seriesData.push({year, y: y[t], type: "time series"});
  seriesData.push({year, y: muFilt, type: "filtering mean"});
  seriesData.push({year, y: muSm, type: "smoothing mean"});
  intervalData.push({year, lower: muFilt - 1.96 * sdFilt, upper: muFilt + 1.96 * sdFilt, type: "95% filtering interval"});
  intervalData.push({year, lower: muSm - 1.96 * sdSm, upper: muSm + 1.96 * sdSm, type: "95% smoothing interval"});
}
```

```js
const plotColorNames = ["time series", "filtering mean", "95% filtering interval", "smoothing mean", "95% smoothing interval"];
const plotColorMap = new Map([
  [plotColorNames[0], mvcolors[0]],
  [plotColorNames[1], mvcolors[2]],
  [plotColorNames[2], "#d8d8d8"],
  [plotColorNames[3], mvcolors[1]],
  [plotColorNames[4], "#b0b0b0"]
]);
const shownColorNames = plotColorNames.filter((nm) => plotSelector.includes(nm));
const plotColor = {domain: shownColorNames, range: shownColorNames.map((nm) => plotColorMap.get(nm))};
```

${optparam ? tex.block`\hat\sigma_\varepsilon = ${sigmaeps.toFixed(2)}, \quad \hat\sigma_\eta = ${sigmaeta.toFixed(2)}` : ""}

```js
Plot.plot({
  width: Math.min(900, width),
  height: 380,
  style: {fontSize: "13px"},
  color: {legend: true, ...plotColor},
  x: {label: "year"},
  y: {label: "river flow, 10⁸m³"},
  marks: [
    Plot.ruleY([d3.min(y) - 100]),
    Plot.areaY(intervalData, {filter: (d) => d.type === "95% filtering interval" && plotSelector.includes("95% filtering interval"), x: "year", y1: "lower", y2: "upper", fill: "type", fillOpacity: 0.6}),
    Plot.areaY(intervalData, {filter: (d) => d.type === "95% smoothing interval" && plotSelector.includes("95% smoothing interval"), x: "year", y1: "lower", y2: "upper", fill: "type", fillOpacity: 0.6}),
    Plot.lineY(seriesData, {filter: (d) => d.type === "time series" && plotSelector.includes("time series"), x: "year", y: "y", stroke: "type", strokeWidth: 2}),
    Plot.lineY(seriesData, {filter: (d) => d.type === "filtering mean" && plotSelector.includes("filtering mean"), x: "year", y: "y", stroke: "type", strokeWidth: 2}),
    Plot.lineY(seriesData, {filter: (d) => d.type === "smoothing mean" && plotSelector.includes("smoothing mean"), x: "year", y: "y", stroke: "type", strokeWidth: 2})
  ]
})
```

</div>

</div>

<div class="dist-side">

<div class="card">

**Local level model**<br>
${tex.block`
\begin{aligned}
y_t &= \mu_t + \varepsilon_t, &\varepsilon_t &\sim N(0,\sigma_\varepsilon^2) \\
\mu_t &= \mu_{t-1} + \eta_t, &\eta_t &\sim N(0,\sigma_\eta^2)
\end{aligned}
`}

**Linear Gaussian State-Space (LGSS) model**

${tex.block`
\begin{aligned}
\boldsymbol{y}_t &= \boldsymbol{C}\boldsymbol{z}_t + \boldsymbol{\varepsilon}_t, &\boldsymbol{\varepsilon}_t &\sim N(\boldsymbol{0},\boldsymbol{\Sigma}_\varepsilon) \\
\boldsymbol{z}_t &= \boldsymbol{A}\boldsymbol{z}_{t-1} + \boldsymbol{\eta}_t, &\boldsymbol{\eta}_t &\sim N(\boldsymbol{0},\boldsymbol{\Sigma}_\eta)
\end{aligned}
`}

With prior on the initial state ${tex`\boldsymbol{z}_0 \sim N(\boldsymbol{\mu}_{0\vert 0}`}, ${tex`\boldsymbol{\Omega}_{0\vert 0})`}

</div>

<div class="card">

**The Kalman filter**<br>

**Filtering** mean ${tex`\boldsymbol{\mu}_{t\vert t}`} and covariance ${tex`\boldsymbol{\Omega}_{t\vert t}`} for the state at time ${tex`t`}, based on observations up to time ${tex`t`}.

For ${tex`t=1,\ldots,T`} do

**Prediction update**<br>
${tex.block`
\begin{aligned}
\boldsymbol{\mu}_{t\vert t-1} &= \boldsymbol{A}\boldsymbol{\mu}_{t-1\vert t-1} \\
\boldsymbol{\Omega}_{t\vert t-1} &= \boldsymbol{A}\boldsymbol{\Omega}_{t-1\vert t-1}\boldsymbol{A}^\top + \boldsymbol{\Sigma}_\eta
\end{aligned}
`}

**Measurement update**<br>
${tex.block`
\begin{aligned}
\boldsymbol{\mu}_{t\vert t} &= \boldsymbol{\mu}_{t\vert t-1} + \boldsymbol{K}_t(\boldsymbol{y}_t - \boldsymbol{C}\boldsymbol{\mu}_{t\vert t-1}) \\
\boldsymbol{\Omega}_{t\vert t} &= (\boldsymbol{I}-\boldsymbol{K}_t\boldsymbol{C})\boldsymbol{\Omega}_{t\vert t-1}
\end{aligned}
`}

where ${tex`\boldsymbol{K}_t = \boldsymbol{\Omega}_{t\vert t-1}\boldsymbol{C}^\top(\boldsymbol{C}\boldsymbol{\Omega}_{t\vert t-1}\boldsymbol{C}^\top+\boldsymbol{\Sigma}_\varepsilon)^{-1}`} is the **Kalman gain**.

</div>

<div class="card">

**The Kalman smoother**

**Smoothing** mean ${tex`\boldsymbol{\mu}_{t\vert T}`} and covariance matrix ${tex`\boldsymbol{\Omega}_{t\vert T}`}, based on the entire time series ${tex`\boldsymbol{y}_1,\ldots,\boldsymbol{y}_T`}.

Starting from ${tex`\boldsymbol{\mu}_{T\vert T}`}, ${tex`\boldsymbol{\Omega}_{T\vert T}`}, for ${tex`t=T-1,\ldots,1`} do:

${tex.block`
\begin{aligned}
\boldsymbol{J}_t &= \boldsymbol{\Omega}_{t\vert t}\boldsymbol{A}^\top\boldsymbol{\Omega}_{t+1\vert t}^{-1} \\
\boldsymbol{\mu}_{t\vert T} &= \boldsymbol{\mu}_{t\vert t} + \boldsymbol{J}_t(\boldsymbol{\mu}_{t+1\vert T} - \boldsymbol{\mu}_{t+1\vert t}) \\
\boldsymbol{\Omega}_{t\vert T} &= \boldsymbol{\Omega}_{t\vert t} + \boldsymbol{J}_t(\boldsymbol{\Omega}_{t+1\vert T} - \boldsymbol{\Omega}_{t+1\vert t})\boldsymbol{J}_t^\top
\end{aligned}
`}

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/kalman-filtering-nile-river-data")}

</div>

</div>

<style>

.dist-main figure {
  margin: 0;
}

.optparam-row form.inputs-3a86ea > label {
  width: auto;
  white-space: nowrap;
}

.plot-selector-grid {
  display: grid;
  grid-template-columns: 100px 135px 175px;
  column-gap: 0.5rem;
  row-gap: 0;
  align-items: center;
  justify-items: start;
  margin-top: 0.25rem;
}

.plot-selector-grid form.inputs-3a86ea {
  width: auto;
  margin: 0;
  align-items: flex-end;
}

.plot-selector-grid form.inputs-3a86ea > label {
  width: auto;
  white-space: nowrap;
  padding: 1px 0;
  align-self: flex-end;
}

</style>
