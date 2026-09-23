---
title: Multinomial–Dirichlet
toc: false
---

# Bayesian inference for multinomial data

```js
import * as math from "npm:mathjs";
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {ternaryDensity, ternaryGrid, themeColor} from "../components/functionLibrary.js";
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
```

```js
// The marginal of one category's count in a future sample of size m from a
// Dirichlet-Multinomial(m, alpha) is Beta-Binomial(m, alpha_k, alpha0 - alpha_k).
function betabinomPdf(x, m, a, b) {
  return jStat.combination(m, x) * jStat.betafn(x + a, m - x + b) / jStat.betafn(a, b);
}
function betabinomMean(m, a, b) {
  return (m * a) / (a + b);
}
function betabinomVar(m, a, b) {
  return (m * a * b * (a + b + m)) / ((a + b) ** 2 * (a + b + 1));
}
```

```js
const alpha = [priorsettings[0], priorsettings[1], priorsettings[2]];
const alpha0 = alpha[0] + alpha[1] + alpha[2];
const counts = [datasettings[0], datasettings[1], datasettings[2]];
const n = counts[0] + counts[1] + counts[2];
const alphan = [alpha[0] + counts[0], alpha[1] + counts[1], alpha[2] + counts[2]];
const alphan0 = alphan[0] + alphan[1] + alphan[2];
// A tiny epsilon keeps the shape parameters positive when a count is 0,
// giving a proper (if slightly smoothed) density for the normalized likelihood.
const alphalike = [counts[0] + 0.001, counts[1] + 0.001, counts[2] + 0.001];
```

```js
const resolution = 40;
const priorDensity = ternaryGrid(resolution, (x) => dirichletPdf(x, alpha));
const likeDensity = ternaryGrid(resolution, (x) => dirichletPdf(x, alphalike));
const postDensity = ternaryGrid(resolution, (x) => dirichletPdf(x, alphan));
```

```js
void dark; // re-resolve these on every light/dark toggle, not just on first render
const priorColor = themeColor("--mv-color-1", "#c0a34d");
const likeColor = themeColor("--mv-color-0", "#6C8EBF");
const postColor = themeColor("--mv-color-2", "#780000");
```

```js
const thetaLabelNodes = [() => tex`\theta_1`, () => tex`\theta_2`, () => tex`\theta_3`];
```

```js
const headingStyle = "font-size: 15px; font-weight: 500; margin: 0; text-align: center;";
const priorHeading = html`<h2 style="${headingStyle} color: ${mvcolors[1]};">Prior</h2>`;
const likeHeading = html`<h2 style="${headingStyle} color: ${mvcolors[0]};">Likelihood (normalized)</h2>`;
const postHeading = html`<h2 style="${headingStyle} color: ${mvcolors[2]};">Posterior</h2>`;
```

```js
// Marginal prior/posterior predictive of each category's count in a future
// sample of size m: y_k ~ Beta-Binomial(m, alpha_k, alpha0 - alpha_k).
const priorPredData = [0, 1, 2].map((k) =>
  d3.range(0, mtilde + 1, 1).map((x) => ({x, pdf: betabinomPdf(x, mtilde, alpha[k], alpha0 - alpha[k])}))
);
const postPredData = [0, 1, 2].map((k) =>
  d3.range(0, mtilde + 1, 1).map((x) => ({x, pdf: betabinomPdf(x, mtilde, alphan[k], alphan0 - alphan[k])}))
);
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div style="display: flex; gap: 1rem;">
  <div class="card" style="flex: 1; min-width: 0; margin: 0;">
    <b>Data</b>
    ${dataInput}

```js
const dataInput = Inputs.form([
  Inputs.range([0, 30], {value: 6, step: 1, label: tex`y_1`}),
  Inputs.range([0, 30], {value: 3, step: 1, label: tex`y_2`}),
  Inputs.range([0, 30], {value: 2, step: 1, label: tex`y_3`})
]);
const datasettings = view(dataInput);
```

  </div>
  <div class="card" style="flex: 1; min-width: 0; margin: 0;">
    <b>Prior</b>
    ${priorInput}

```js
const priorInput = Inputs.form([
  Inputs.range([0.01, 15], {value: 1.5, step: 0.01, label: tex`\alpha_1`}),
  Inputs.range([0.01, 15], {value: 1.5, step: 0.01, label: tex`\alpha_2`}),
  Inputs.range([0.01, 15], {value: 1.5, step: 0.01, label: tex`\alpha_3`})
]);
const priorsettings = view(priorInput);
```

  </div>
</div>

<div class="card" style="padding-top: 1rem;">

${viewInput}

```js
const viewInput = Inputs.radio(["Parameter posterior", "Prior predictive", "Posterior predictive"], {value: "Parameter posterior"});
const viewMode = view(viewInput);
```

```js
const mtildeInput = Inputs.range([1, 60], {value: 10, step: 1, label: ""});
const mtilde = view(mtildeInput);
```

```js
const showQuantileInput = Inputs.toggle({value: false});
const showQuantile = view(showQuantileInput);
```

```js
const quantileInput = Inputs.range([0, mtilde], {value: Math.round(mtilde / 2), step: 1, label: ""});
const quantile = view(quantileInput);
```

```js
const predictiveControlsVisible = viewMode === "Prior predictive" || viewMode === "Posterior predictive";
mtildeInput.style.display = predictiveControlsVisible ? "" : "none";
showQuantileInput.style.display = predictiveControlsVisible ? "" : "none";
quantileInput.style.display = predictiveControlsVisible ? "" : "none";
document.querySelectorAll(".predictive-controls-row").forEach((el) => {
  el.style.display = predictiveControlsVisible ? "grid" : "none";
});
```

<div class="predictive-controls-row">
<div class="predictive-controls-label">future sample size, ${tex`m`}</div>
${mtildeInput}
</div>
<div class="predictive-controls-row">
<div class="predictive-controls-label"><span>plot quantile</span>${showQuantileInput}</div>
${quantileInput}
</div>

```js
const predictivePlot = (data, color, label) =>
  html`<div>
    <h2 style="font-size: 15px; font-weight: 500; margin: 0 0 0.25rem; text-align: center;">${tex`\tilde y_${label}`}</h2>
    ${Plot.plot({
      width: Math.min(280, width),
      height: 220,
      style: {fontSize: "12px"},
      x: {label: "count"},
      y: {label: null, axis: true},
      marks: [
        Plot.ruleY([0]),
        Plot.rectY(data, {
          x1: (d) => d.x - 0.4, x2: (d) => d.x + 0.4, y: "pdf", fill: color, fillOpacity: showQuantile ? 0.3 : 1,
          title: (d) => `P(y=${d.x}) = ${d.pdf.toPrecision(4)}`
        }),
        ...(showQuantile
          ? [Plot.rectY(data, {
              filter: (d) => d.x <= quantile,
              x1: (d) => d.x - 0.4, x2: (d) => d.x + 0.4, y: "pdf", fill: color,
              title: (d) => `P(y=${d.x}) = ${d.pdf.toPrecision(4)}`
            })]
          : [])
      ]
    })}
  </div>`;
```

```js
const plotsView = viewMode === "Parameter posterior"
  ? html`<div style="display: flex; gap: 1rem;">
      <div style="flex: 1;">
      ${priorHeading}
      ${ternaryDensity(priorDensity, resolution, {size: Math.min(280, width), margin: {left: 40, top: 40, right: 40, bottom: 40}, color: priorColor, labelNodes: thetaLabelNodes, labelOffset: 2.6, dark})}
      </div>
      <div style="flex: 1;">
      ${likeHeading}
      ${ternaryDensity(likeDensity, resolution, {size: Math.min(280, width), margin: {left: 40, top: 40, right: 40, bottom: 40}, color: likeColor, labelNodes: thetaLabelNodes, labelOffset: 2.6, dark})}
      </div>
      <div style="flex: 1;">
      ${postHeading}
      ${ternaryDensity(postDensity, resolution, {size: Math.min(280, width), margin: {left: 40, top: 40, right: 40, bottom: 40}, color: postColor, labelNodes: thetaLabelNodes, labelOffset: 2.6, dark})}
      </div>
    </div>`
  : viewMode === "Prior predictive"
  ? html`<div style="display: flex; gap: 1rem;">
      <div style="flex: 1;">${predictivePlot(priorPredData[0], mvcolors[1], "1")}</div>
      <div style="flex: 1;">${predictivePlot(priorPredData[1], mvcolors[1], "2")}</div>
      <div style="flex: 1;">${predictivePlot(priorPredData[2], mvcolors[1], "3")}</div>
    </div>`
  : html`<div style="display: flex; gap: 1rem;">
      <div style="flex: 1;">${predictivePlot(postPredData[0], mvcolors[2], "1")}</div>
      <div style="flex: 1;">${predictivePlot(postPredData[1], mvcolors[2], "2")}</div>
      <div style="flex: 1;">${predictivePlot(postPredData[2], mvcolors[2], "3")}</div>
    </div>`;
```

${plotsView}

</div>

</div>

<div class="dist-side">

<div class="card formula-card">

**Model**<br>
${tex`\boldsymbol{y} \mid \boldsymbol{\theta} \sim \operatorname{Multinomial}(n,\theta_1,\theta_2,\theta_3)`}

**Prior**<br>
${tex`\boldsymbol{\theta} \sim \operatorname{Dirichlet}(\alpha_1,\alpha_2,\alpha_3)`}

**Posterior**<br>
${tex`\boldsymbol{\theta} \mid \boldsymbol{y} \sim \operatorname{Dirichlet}(\alpha_1+y_1,\,\alpha_2+y_2,\,\alpha_3+y_3)`}

**Prior/posterior predictive**<br>
For the count ${tex`\tilde y_k`} of category ${tex`k`} in a future sample of size ${tex`m`}, marginalizing over ${tex`\boldsymbol{\theta}`}:<br>
${tex`\tilde y_k \sim \operatorname{Beta\text{-}Bin}(m,\, \alpha_k,\, \alpha_0-\alpha_k)`}<br>
${tex`\tilde y_k \mid \boldsymbol{y} \sim \operatorname{Beta\text{-}Bin}(m,\, \alpha_{n,k},\, \alpha_{n,0}-\alpha_{n,k})`}

</div>

<div class="card">

### Summary

```js
const summaryTable = viewMode === "Parameter posterior"
  ? html`<table>
      <tr><th></th><th>Prior mean</th><th>Posterior mean</th></tr>
      <tr><td>${tex`\theta_1`}</td><td>${(alpha[0] / alpha0).toPrecision(3)}</td><td>${(alphan[0] / alphan0).toPrecision(3)}</td></tr>
      <tr><td>${tex`\theta_2`}</td><td>${(alpha[1] / alpha0).toPrecision(3)}</td><td>${(alphan[1] / alphan0).toPrecision(3)}</td></tr>
      <tr><td>${tex`\theta_3`}</td><td>${(alpha[2] / alpha0).toPrecision(3)}</td><td>${(alphan[2] / alphan0).toPrecision(3)}</td></tr>
    </table>`
  : viewMode === "Prior predictive"
  ? html`<table>
      <tr><th></th><th>Mean</th><th>SD</th><th>${tex`P(\tilde y_k \le ${quantile})`}</th></tr>
      <tr><td>${tex`\tilde y_1`}</td><td>${betabinomMean(mtilde, alpha[0], alpha0 - alpha[0]).toPrecision(3)}</td><td>${Math.sqrt(betabinomVar(mtilde, alpha[0], alpha0 - alpha[0])).toPrecision(3)}</td><td>${d3.sum(priorPredData[0].filter((d) => d.x <= quantile), (d) => d.pdf).toPrecision(4)}</td></tr>
      <tr><td>${tex`\tilde y_2`}</td><td>${betabinomMean(mtilde, alpha[1], alpha0 - alpha[1]).toPrecision(3)}</td><td>${Math.sqrt(betabinomVar(mtilde, alpha[1], alpha0 - alpha[1])).toPrecision(3)}</td><td>${d3.sum(priorPredData[1].filter((d) => d.x <= quantile), (d) => d.pdf).toPrecision(4)}</td></tr>
      <tr><td>${tex`\tilde y_3`}</td><td>${betabinomMean(mtilde, alpha[2], alpha0 - alpha[2]).toPrecision(3)}</td><td>${Math.sqrt(betabinomVar(mtilde, alpha[2], alpha0 - alpha[2])).toPrecision(3)}</td><td>${d3.sum(priorPredData[2].filter((d) => d.x <= quantile), (d) => d.pdf).toPrecision(4)}</td></tr>
    </table>`
  : html`<table>
      <tr><th></th><th>Mean</th><th>SD</th><th>${tex`P(\tilde y_k \le ${quantile})`}</th></tr>
      <tr><td>${tex`\tilde y_1`}</td><td>${betabinomMean(mtilde, alphan[0], alphan0 - alphan[0]).toPrecision(3)}</td><td>${Math.sqrt(betabinomVar(mtilde, alphan[0], alphan0 - alphan[0])).toPrecision(3)}</td><td>${d3.sum(postPredData[0].filter((d) => d.x <= quantile), (d) => d.pdf).toPrecision(4)}</td></tr>
      <tr><td>${tex`\tilde y_2`}</td><td>${betabinomMean(mtilde, alphan[1], alphan0 - alphan[1]).toPrecision(3)}</td><td>${Math.sqrt(betabinomVar(mtilde, alphan[1], alphan0 - alphan[1])).toPrecision(3)}</td><td>${d3.sum(postPredData[1].filter((d) => d.x <= quantile), (d) => d.pdf).toPrecision(4)}</td></tr>
      <tr><td>${tex`\tilde y_3`}</td><td>${betabinomMean(mtilde, alphan[2], alphan0 - alphan[2]).toPrecision(3)}</td><td>${Math.sqrt(betabinomVar(mtilde, alphan[2], alphan0 - alphan[2])).toPrecision(3)}</td><td>${d3.sum(postPredData[2].filter((d) => d.x <= quantile), (d) => d.pdf).toPrecision(4)}</td></tr>
    </table>`;
display(summaryTable);
```

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/multinomial-dirichlet")}

</div>

</div>

<style>

.dist-main .card h2 ~ svg {
  margin-top: 0;
}

.predictive-controls-row {
  display: grid;
  grid-template-columns: 190px auto;
  align-items: center;
  column-gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.predictive-controls-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.predictive-controls-row form.inputs-3a86ea {
  width: auto;
}

.predictive-controls-row form.inputs-3a86ea label {
  display: none;
}

.predictive-controls-row input[type="number"] {
  width: 55px;
}

.predictive-controls-row input[type="range"] {
  max-width: 160px;
}

.formula-card .katex {
  font-size: 1.1em;
}

</style>
