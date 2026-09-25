---
title: Time-varying regression model
toc: false
---

# Time-varying regression model

_The regression coefficients ${tex`\alpha_t`} and ${tex`\beta_t`} evolve as independent random walks, letting the relationship between ${tex`x_t`} and ${tex`y_t`} drift over time._

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
function simLocalRegression(n, sigmaeps, sigmaalpha, sigmabeta) {
  const x = d3.range(n).map(() => d3.randomUniform(0, 2)());
  const data = new Array(n);
  let alpha = 0;
  let beta = 0;
  for (let t = 0; t < n; t++) {
    alpha += sigmaalpha * d3.randomNormal()();
    beta += sigmabeta * d3.randomNormal()();
    data[t] = {time: t + 1, x: x[t], y: alpha + beta * x[t] + sigmaeps * d3.randomNormal()(), alpha, beta};
  }
  return data;
}
```

```js
// Gaussian-kernel weights measuring closeness in time to the selected
// period t = obsnumber, used only to shade points in the scatter plot.
function weightedData(data, n, obsnumber, sigmaBw) {
  const denseval = d3.range(n).map((t) => jStat.normal.pdf(t, obsnumber - 1, n * sigmaBw));
  const sumdenseval = d3.sum(denseval);
  return data.map((d, t) => ({...d, weight: denseval[t] / sumdenseval}));
}
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

<b>Settings</b>
${settingsInput}

```js
const settingsInput = Inputs.form([
  Inputs.range([10, 1000], {value: 100, step: 1, label: "time series length, n"}),
  Inputs.range([0.1, 5], {value: 1, step: 0.1, label: tex`\sigma_\varepsilon`}),
  Inputs.range([Number.EPSILON, 2], {value: 1, step: 0.1, label: tex`\sigma_\alpha`}),
  Inputs.range([Number.EPSILON, 2], {value: 1, step: 0.1, label: tex`\sigma_\beta`})
]);
const settings = view(settingsInput);
```

```js
const n = settings[0];
const sigmaeps = settings[1];
const sigmaalpha = settings[2];
const sigmabeta = settings[3];
```

```js
const obsnumberInput = Inputs.range([1, n], {value: Math.ceil(n / 2), step: 1, label: tex`\text{regression line at time, }t`});
const obsnumber = view(obsnumberInput);
```

${simulateInput}

```js
const simulateInput = Inputs.button(html`Simulate new data!`);
const simulate = view(simulateInput);
```

<div class="obsnumber-row">${obsnumberInput}</div>

</div>

<div class="card">

```js
simulate; // referenced only to trigger a new simulation on click
const simulatedData = simLocalRegression(n, sigmaeps, sigmaalpha, sigmabeta);
```

```js
const sigmaBwInput = Inputs.range([0.001, 0.3], {value: 0.075, step: 0.001, label: "Color sensitivity"});
const sigmaBw = view(sigmaBwInput);
```

```js
const simulatedDataLocal = weightedData(simulatedData, n, obsnumber, sigmaBw);
```

```js
const titleStyle = "font-size: 15px; font-weight: 500; margin: 0 0 0.25rem; text-align: center;";
const leftTitle = html`<h2 style="${titleStyle}">Darker points are closer to t = ${obsnumber}</h2>`;
const rightTitle = html`<h2 style="${titleStyle}"><span style="color: ${mvcolors[0]};">α = ${simulatedData[obsnumber - 1].alpha.toFixed(3)}</span> and <span style="color: ${mvcolors[1]};">β = ${simulatedData[obsnumber - 1].beta.toFixed(3)}</span></h2>`;
```

<div style="display: flex; gap: 1rem;">
  <div style="flex: 1;">
  ${leftTitle}
  <div style="font-size: 14px; line-height: 1; color: var(--theme-foreground-muted); margin: 0 0 -16px;">↑ y</div>
  ${Plot.plot({
    width: Math.min(440, width),
    height: 320,
    style: {fontSize: "14px"},
    color: {scheme: "blues", legend: false},
    x: {label: null},
    y: {label: null},
    marks: [
      Plot.ruleX([0]),
      Plot.ruleY([d3.min(simulatedDataLocal, (d) => d.y)]),
      Plot.line(
        [
          {x: 0, y: simulatedDataLocal[obsnumber - 1].alpha},
          {x: 2, y: simulatedDataLocal[obsnumber - 1].alpha + 2 * simulatedDataLocal[obsnumber - 1].beta}
        ],
        {x: "x", y: "y", stroke: mvcolors[2], strokeWidth: 2}
      ),
      Plot.dot(simulatedDataLocal, {x: "x", y: "y", fill: "weight", strokeWidth: 2}),
      Plot.dot(simulatedDataLocal, {x: "x", y: "y", stroke: "gray", strokeWidth: 0.3, r: 3}),
      Plot.dot([simulatedDataLocal[obsnumber - 1]], {x: "x", y: "y", fill: mvcolors[2], stroke: mvcolors[2], strokeWidth: 5}),
      Plot.tip(simulatedDataLocal, Plot.pointer({x: "x", y: "y", title: (d) => `time = ${d.time}`}))
    ]
  })}
  <div style="text-align: right; font-size: 14px; line-height: 1; margin-top: 4px; color: var(--theme-foreground-muted);">x →</div>
  </div>
  <div style="flex: 1;">
  ${rightTitle}
  <div style="font-size: 14px; line-height: 1; color: var(--theme-foreground-muted); margin: 0 0 -16px;">↑ coefficients</div>
  ${Plot.plot({
    width: Math.min(440, width),
    height: 320,
    style: {fontSize: "14px"},
    color: {legend: false, domain: ["α", "β"], range: [mvcolors[0], mvcolors[1]]},
    x: {label: null},
    y: {label: null},
    marks: [
      Plot.ruleX([0]),
      Plot.ruleY([d3.min(simulatedData, (d) => Math.min(d.alpha, d.beta))]),
      Plot.lineY(simulatedData, {x: "time", y: "alpha", stroke: () => "α", strokeWidth: 2}),
      Plot.lineY(simulatedData, {x: "time", y: "beta", stroke: () => "β", strokeWidth: 2}),
      Plot.dot([simulatedData[obsnumber - 1]], {x: "time", y: "alpha", fill: mvcolors[0], stroke: "black", r: 4}),
      Plot.dot([simulatedData[obsnumber - 1]], {x: "time", y: "beta", fill: mvcolors[1], stroke: mvcolors[1], r: 4})
    ]
  })}
  <div style="text-align: right; font-size: 14px; line-height: 1; margin-top: 4px; color: var(--theme-foreground-muted);">t →</div>
  </div>
</div>

<div style="margin-top: 0.75rem; font-size: 13px;">${sigmaBwInput}</div>

</div>

</div>

<div class="dist-side">

<div class="card">

**Model**<br>
${tex.block`
\begin{aligned}
y_t &= \alpha_t + \beta_t x_t + \varepsilon_t, \quad \varepsilon_t \sim N(0,\sigma_\varepsilon^2) \\
\alpha_t &= \alpha_{t-1} + \eta_t, \qquad \eta_t \sim N(0,\sigma_\alpha^2) \\
\beta_t &= \beta_{t-1} + \nu_t, \qquad \nu_t \sim N(0,\sigma_\beta^2)
\end{aligned}
`}

</div>

<div class="card">

The left plot below shows the simulated data, with points shaded by how close in time they are to the selected period ${tex`t`} — the red line is the regression line at that period. The right plot shows how ${tex`\alpha_t`} and ${tex`\beta_t`} evolve over the whole series.

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/time-varying-regression-model")}

</div>

</div>

<style>

.dist-main figure {
  margin: 0;
}

.obsnumber-row form.inputs-3a86ea {
  --label-width: 230px;
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
