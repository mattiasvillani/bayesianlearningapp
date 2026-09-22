---
title: Stochastic Volatility Model
toc: false
---

# Stochastic volatility model

_Many time series, particularly in finance, have a variance that changes over time and clusters: once volatility is high it tends to stay high for a while, and vice versa._

```js
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const maxN = 1000;

function simStochVol(n, muy, muz, phi, sigmaeta) {
  const data = [];
  let z = muz;
  for (let t = 0; t < n; t++) {
    z = muz + phi * (z - muz) + sigmaeta * d3.randomNormal()();
    data.push({time: t + 1, y: Math.exp(z / 2), type: "standard deviation"});
    data.push({time: t + 1, y: muy + Math.exp(z / 2) * d3.randomNormal()(), type: "time series"});
  }
  return data;
}
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

<b>Settings</b>
<div class="sv-settings">
${nInput}
${modelParamsInput}
</div>

```js
// n is a separate input from the model parameters so that dragging the
// length slider only slices the already-simulated series (see below)
// instead of triggering a brand new simulation.
const nInput = Inputs.range([10, maxN], {value: 100, step: 1, label: tex`\text{time series length, }T`});
const n = view(nInput);
```

```js
const modelParamsInput = Inputs.form({
  muy: Inputs.range([-5, 5], {value: 0, step: 0.1, label: tex`\text{process mean, }\mu_y`}),
  muz: Inputs.range([-5, 5], {value: 0, step: 0.1, label: tex`\text{mean log variance, }\mu_z`}),
  phi: Inputs.range([-0.99, 0.99], {value: 0.8, step: 0.01, label: tex`\text{AR(1) parameter, }\phi`}),
  sigmaeta: Inputs.range([0.01, 2], {value: 1, step: 0.1, label: tex`\text{innovation stdev, }\sigma_\eta`})
});
const modelParams = view(modelParamsInput);
```

<b>Plot</b>
${plotSelectorInput}

```js
const plotSelectorInput = Inputs.checkbox(["time series", "standard deviation"], {value: ["time series", "standard deviation"]});
const plotSelector = view(plotSelectorInput);
```

${regenerateInput}

```js
const regenerateInput = Inputs.button(html`Simulate new data`);
const regenerate = view(regenerateInput);
```

</div>

<div class="card">

```js
// Simulated once at the maximum length for the current model parameters
// (and re-simulated on a button click). The length slider below then just
// slices this same series, instead of drawing an entirely new one.
regenerate; // referenced only to trigger a re-simulation on click
const fullSimulatedData = simStochVol(maxN, modelParams.muy, modelParams.muz, modelParams.phi, modelParams.sigmaeta);
```

```js
const simulatedData = fullSimulatedData.filter((d) => d.time <= n);
```

```js
const plotColorNames = ["time series", "standard deviation"];
const plotColorMap = new Map([[plotColorNames[0], mvcolors[0]], [plotColorNames[1], mvcolors[2]]]);
const shownColorNames = plotColorNames.filter((nm) => plotSelector.includes(nm));
const plotColor = {legend: true, domain: shownColorNames, range: shownColorNames.map((nm) => plotColorMap.get(nm))};
```

```js
Plot.plot({
  width: Math.min(900, width),
  height: 380,
  style: {fontSize: "13px"},
  color: plotColor,
  x: {label: "t"},
  y: {label: null},
  marks: [
    Plot.ruleX([0]),
    Plot.ruleY([d3.min(simulatedData, (d) => d.y)]),
    Plot.lineY(simulatedData, {filter: (d) => d.type === "time series" && plotSelector.includes("time series"), x: "time", y: "y", stroke: "type", strokeWidth: 2}),
    Plot.lineY(simulatedData, {filter: (d) => d.type === "standard deviation" && plotSelector.includes("standard deviation"), x: "time", y: "y", stroke: "type", strokeWidth: 2})
  ]
})
```

</div>

</div>

<div class="dist-side">

<div class="card">

**Model**<br>
${tex.block`
\begin{aligned}
y_t &= \mu_y + \varepsilon_t, \qquad \varepsilon_t \overset{\mathrm{indep}}{\sim} N(0,\exp(z_t)) \\
z_t &= \mu_z + \phi(z_{t-1} - \mu_z) + \eta_t, \qquad \eta_t \overset{\mathrm{iid}}{\sim} N(0,\sigma_\eta^2)
\end{aligned}
`}

The log-variance ${tex`z_t`} follows a stationary AR(1) process with mean ${tex`\mu_z`} and autocorrelation ${tex`\phi`}. The standard deviation of ${tex`y_t \vert z_t`} is ${tex`\sigma_t = \exp(z_t/2)`}.

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/stochastic-volatility-time-series-model")}

</div>

</div>

<style>

.dist-main figure {
  margin: 0;
}

.sv-settings form.inputs-3a86ea {
  --label-width: 180px;
}

form.inputs-3a86ea-checkbox {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem 1rem;
}

form.inputs-3a86ea-checkbox > div {
  display: contents;
}

form.inputs-3a86ea-checkbox label {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: flex-end;
  gap: 0.4em;
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
