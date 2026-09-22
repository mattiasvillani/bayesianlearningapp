---
title: Prior predictive AR process
toc: false
---

# Prior predictive AR process

_A prior is placed on all parameters of an AR(${tex`p`}) process, and time series are simulated by first drawing parameters from the prior and then simulating from the model at the drawn values._

```js
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
import jStat from "npm:jstat";
```

```js
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
// Prior density of phi_1, ..., phi_p, one curve per lag.
function priorPhiDensity(mu0, tau, p, gamma) {
  const phiGrid = d3.range(-3, 3, 0.01);
  let pdfs = phiGrid.map((phi) => ({phi, priordens: jStat.normal.pdf(phi, mu0, tau), lag: "lag 1"}));
  for (let k = 2; k <= p; k++) {
    const sd = Math.sqrt(tau ** 2 / k ** gamma);
    pdfs = pdfs.concat(phiGrid.map((phi) => ({phi, priordens: jStat.normal.pdf(phi, 0, sd), lag: `lag ${k}`})));
  }
  return pdfs;
}
```

```js
// Draws mu, sigma and phi_1, ..., phi_p from the prior, then simulates a
// realization of length maxN from the AR(p) model at the drawn values.
function simulatePriorPredictive(p, mu0, tau, gamma, nu0, sigma0, m0, s0) {
  const phi = [jStat.normal.sample(mu0, tau)];
  for (let k = 2; k <= p; k++) phi.push(jStat.normal.sample(0, Math.sqrt(tau ** 2 / k ** gamma)));
  const sigma = Math.sqrt((nu0 * sigma0 ** 2) / jStat.chisquare.sample(nu0));
  const mu = jStat.normal.sample(m0, s0);
  return simulateAR(1000, mu, phi, sigma);
}
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="ar-prior-card card">

<b>Settings</b>

**Prior for the AR coefficients** ${tex`\phi_1,\ldots,\phi_p`}
${phiPriorInput}

```js
const phiPriorInput = Inputs.form([
  Inputs.range([1, 10], {value: 3, step: 1, label: tex`\text{number of lags, }p`}),
  Inputs.range([-1, 1], {value: 0.5, step: 0.1, label: tex`\text{mean first lag, }\mu_0`}),
  Inputs.range([0, 2], {value: 0.5, step: 0.1, label: tex`\text{stdev first lag, }\lambda`}),
  Inputs.range([0, 5], {value: 2, step: 0.1, label: tex`\text{lag decay, }\gamma`})
]);
const phiPrior = view(phiPriorInput);
```

```js
const p = phiPrior[0];
const mu0 = phiPrior[1];
const tau = phiPrior[2];
const gamma = phiPrior[3];
```

**Prior for** ${tex`\mu`} **and** ${tex`\sigma^2`}
${muSigmaPriorInput}

```js
const muSigmaPriorInput = Inputs.form([
  Inputs.range([0.01, 2], {value: 0.5, step: 0.1, label: tex`\text{location error std, }\sigma_0`}),
  Inputs.range([1, 30], {value: 3, step: 1, label: tex`\text{df error std, }\nu_0`}),
  Inputs.range([-5, 5], {value: 1, step: 0.1, label: tex`\text{mean of mean, }m_0`}),
  Inputs.range([0.01, 5], {value: 1, step: 0.1, label: tex`\text{std of mean, }s_0`})
]);
const muSigmaPrior = view(muSigmaPriorInput);
```

```js
const sigma0 = muSigmaPrior[0];
const nu0 = muSigmaPrior[1];
const m0 = muSigmaPrior[2];
const s0 = muSigmaPrior[3];
```

**Prior predictive realization**
${tPriorInput}
${simulateInput}

```js
// Tprior is a separate input from the prior hyperparameters: it only
// controls how much of the (always length-1000) simulated series is shown,
// so dragging it doesn't trigger a brand new draw from the prior.
const tPriorInput = Inputs.range([10, 1000], {value: 200, step: 1, label: tex`\text{length shown, }T`});
const Tprior = view(tPriorInput);
```

```js
const simulateInput = Inputs.button(html`Simulate new realization!`);
const simulate = view(simulateInput);
```

</div>

<div class="card">

```js
const priorPhiData = priorPhiDensity(mu0, tau, p, gamma);
```

```js
simulate; // referenced only to trigger a new draw from the prior on click
const priorPredictive = simulatePriorPredictive(p, mu0, tau, gamma, nu0, sigma0, m0, s0);
```

```js
const lagNames = d3.range(1, p + 1).map((k) => `lag ${k}`);
```

<div style="display: flex; gap: 1rem;">
  <div style="flex: 1;">
  ${Plot.plot({
    width: Math.min(440, width),
    height: 320,
    style: {fontSize: "13px"},
    title: "Prior density of the AR coefficients",
    color: {legend: true, type: "categorical", domain: lagNames, range: mvcolors.slice(0, p)},
    x: {label: "phi"},
    y: {axis: false},
    marks: [
      Plot.ruleY([0]),
      Plot.ruleX([0]),
      Plot.line(priorPhiData, {x: "phi", y: "priordens", stroke: "lag", strokeWidth: 2})
    ]
  })}
  </div>
  <div style="flex: 1;">
  ${Plot.plot({
    width: Math.min(440, width),
    height: 320,
    style: {fontSize: "13px"},
    title: "Prior predictive realization",
    color: {legend: true, domain: ["prior predictive"], range: [mvcolors[0]]},
    x: {label: "t", domain: [0, Tprior]},
    y: {label: "X(t)"},
    marks: [
      Plot.ruleX([0]),
      Plot.lineY(priorPredictive, {filter: (d) => d.time < Tprior, x: "time", y: "x", stroke: () => "prior predictive", strokeWidth: 2})
    ]
  })}
  </div>
</div>

</div>

</div>

<div class="dist-side">

<div class="card">

The AR process in steady-state (mean-deviation) form 

${tex.block`
\begin{aligned}
X_t &= \mu + \sum_{k=1}^p \phi_k(X_{t-k}-\mu) + \varepsilon_t
\end{aligned}
`}
where 
${tex`\varepsilon_t \overset{\mathrm{iid}}{\sim} N(0,\sigma^2)`}.

**Prior**

The prior assumes independence between all parameters and
${tex.block`\mu \sim N(m_0,s_0^2)`}
${tex.block`\sigma^2 \sim \mathrm{Inv}\text{-}\chi^2(\nu_0,\sigma_0^2)`}

The prior on the AR coefficients shrinks more towards zero for longer lags:
${tex.block`
\begin{aligned}
\phi_1 &\sim N(\mu_0,\lambda^2)\\
\phi_k &\sim N\Big(0,\frac{\lambda^2}{k^\gamma}\Big) \text{ for }k>1
\end{aligned}
`}

The hyperparameter ${tex`\lambda>0`} controls the prior standard deviation of ${tex`\phi_1`} and ${tex`\gamma>0`} controls how quickly that stdev shrinks with the lag. 

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/ar-processes")}

</div>

</div>

<style>

.dist-main figure {
  margin: 0;
}

.ar-prior-card form.inputs-3a86ea {
  --label-width: 180px;
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
