---
title: Autoregressive process
toc: false
---

# Autoregressive process

_An autoregressive process of order ${tex`p`}, AR(${tex`p`}), explains the current value of a time series ${tex`X_t`} from its own ${tex`p`} most recent values ${tex`X_{t-1},\ldots,X_{t-p}`}._

```js
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {armaACF} from "../components/timeseries.js";
```

```js
const maxN = 1000;

function simulateAR(n, mu, phi, sigma) {
  const p = phi.length;
  const whiteNoise = d3.range(n + p).map(() => sigma * d3.randomNormal()());
  const series = new Array(n + p);
  for (let i = 0; i < p; i++) series[i] = {time: i, x: mu + whiteNoise[i]};
  for (let i = p; i < n + p; i++) {
    let value = mu;
    for (let j = 0; j < p; j++) value += phi[j] * (series[i - j - 1].x - mu);
    series[i] = {time: i, x: value + whiteNoise[i]};
  }
  return series.slice(p).map((d, i) => ({time: i, x: d.x}));
}
```

```js
// Sample autocorrelation function, centered on the sample mean so that
// acf[0] is always exactly 1 regardless of the process mean.
function computeACF(series, maxLag) {
  const mean = d3.mean(series);
  const centered = series.map((x) => x - mean);
  const denom = d3.sum(centered, (x) => x * x);
  const acf = [];
  for (let lag = 0; lag <= maxLag; lag++) {
    let sum = 0;
    for (let t = 0; t < series.length - lag; t++) sum += centered[t] * centered[t + lag];
    acf.push(sum / denom);
  }
  return acf;
}
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

<b>Settings</b>
${tInput}
${simInputsInput}
${phiInput}

```js
// T is a separate input from the model parameters: it only controls how
// much of the (always maxN-long) simulated series is shown in the time
// series plot, so dragging it doesn't trigger a brand new simulation.
const tInput = Inputs.range([5, maxN], {value: 50, step: 1, label: tex`\text{length, }T`});
const T = view(tInput);
```

```js
const simInputsInput = Inputs.form([
  Inputs.range([1, 4], {value: 2, step: 1, label: tex`\text{number of lags, }p`}),
  Inputs.range([-3, 3], {value: 0, step: 0.1, label: tex`\text{mean, }\mu`}),
  Inputs.range([0, 2], {value: 0.5, step: 0.1, label: tex`\text{error stdev, }\sigma`})
]);
const simInputs = view(simInputsInput);
```

```js
const p = simInputs[0];
const mu = simInputs[1];
const sigma = simInputs[2];
```

```js
const phiInput = p === 1
  ? Inputs.form([Inputs.range([-2, 2], {value: 0.7, step: 0.01, label: tex`\phi_1`})])
  : p === 2
  ? Inputs.form([
      Inputs.range([-2, 2], {value: 0.7, step: 0.01, label: tex`\phi_1`}),
      Inputs.range([-2, 2], {value: 0, step: 0.01, label: tex`\phi_2`})
    ])
  : p === 3
  ? Inputs.form([
      Inputs.range([-2, 2], {value: 0.7, step: 0.01, label: tex`\phi_1`}),
      Inputs.range([-2, 2], {value: 0, step: 0.01, label: tex`\phi_2`}),
      Inputs.range([-2, 2], {value: 0, step: 0.01, label: tex`\phi_3`})
    ])
  : Inputs.form([
      Inputs.range([-2, 2], {value: 0.7, step: 0.01, label: tex`\phi_1`}),
      Inputs.range([-2, 2], {value: 0, step: 0.01, label: tex`\phi_2`}),
      Inputs.range([-2, 2], {value: 0, step: 0.01, label: tex`\phi_3`}),
      Inputs.range([-2, 2], {value: 0, step: 0.01, label: tex`\phi_4`})
    ]);
const phi = view(phiInput);
```

${simulateInput}

```js
const simulateInput = Inputs.button(html`Simulate!`);
const simulate = view(simulateInput);
```

</div>

<div class="card">

```js
simulate; // referenced only to trigger a re-simulation on click
const timeseries = simulateAR(maxN, mu, phi, sigma);
```

```js
const nAcfLags = Math.max(5 * p, 10);
const acf = computeACF(timeseries.map((d) => d.x), nAcfLags);
const acfData = acf.map((a, lag) => ({lag, a, type: "estimated"})).filter((d) => d.lag > 0);
```

```js
const exactAcf = armaACF(phi, [], nAcfLags);
const exactAcfData = exactAcf.map((a, lag) => ({lag, a, type: "exact"})).filter((d) => d.lag > 0);
```

<div style="display: flex; gap: 1rem;">
  <div style="flex: 1;">
  ${Plot.plot({
    width: Math.min(440, width),
    height: 320,
    style: {fontSize: "13px"},
    title: "Time series",
    color: {legend: true, domain: ["time series"], range: [mvcolors[0]]},
    x: {label: "t", domain: [0, T]},
    y: {label: "X(t)"},
    marks: [
      Plot.ruleY([d3.min(timeseries, (d) => d.x)]),
      Plot.ruleX([0]),
      Plot.lineY(timeseries, {filter: (d) => d.time < T, x: "time", y: "x", stroke: () => "time series", strokeWidth: 2})
    ]
  })}
  </div>
  <div style="flex: 1;">
  ${Plot.plot({
    width: Math.min(440, width),
    height: 320,
    style: {fontSize: "13px"},
    title: "Autocorrelation function",
    color: {legend: true, domain: ["estimated", "exact"], range: [mvcolors[2], mvcolors[1]]},
    x: {label: "lag"},
    y: {label: "ACF"},
    marks: [
      Plot.ruleY([0]),
      Plot.ruleX([0]),
      Plot.ruleX(acfData, {x: "lag", y: "a", stroke: mvcolors[2], strokeWidth: 2}),
      Plot.dot(acfData, {x: "lag", y: "a", fill: "type", stroke: "type"}),
      Plot.line(exactAcfData, {x: "lag", y: "a", stroke: "type", strokeWidth: 2})
    ]
  })}
  </div>
</div>

</div>

</div>

<div class="dist-side">

<div class="card">

**AR(*p*) model**<br>
In steady-state (mean-deviation) form

${tex.block`
\begin{aligned}
X_t &= \mu + \sum_{k=1}^p \phi_k(X_{t-k}-\mu) + \varepsilon_t
\end{aligned}
`}
where 
${tex`\varepsilon_t \overset{\mathrm{iid}}{\sim} N(0,\sigma^2)`} and ${tex`\mu`} is the unconditional mean of the process.

The **autocorrelation function (ACF)** measures how correlated ${tex`X_t`} is with ${tex`X_{t-k}`}, for each lag ${tex`k`}
${tex.block`\rho_k = \mathrm{Corr}(X_t,X_{t-k})`}

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/ar-simulation-and-autocorrelation")}

</div>

</div>

<style>

.dist-main figure {
  margin: 0;
}

.card form.inputs-3a86ea:has(> button) {
  width: auto;
}

.card form.inputs-3a86ea > button {
  appearance: none;
  background: var(--theme-background);
  border: solid 1px var(--theme-foreground-faintest);
  border-radius: 0.375rem;
  padding: 0.35em 0.7em;
  color: var(--theme-foreground);
  font: inherit;
  font-size: 0.9em;
  line-height: 1.3;
  white-space: normal;
  text-align: center;
  cursor: pointer;
}

.card form.inputs-3a86ea > button:hover {
  border-color: var(--theme-foreground-muted);
}

.card form.inputs-3a86ea > button:active {
  background: var(--theme-foreground-faintest);
}

.card form.inputs-3a86ea > button:focus-visible {
  outline: 2px solid var(--theme-foreground-focus);
  outline-offset: 1px;
}

</style>
