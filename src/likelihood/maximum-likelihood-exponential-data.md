---
title: MLE - Exponential data
toc: false
---

# Maximum Likelihood — Exponential data

```js
import {mvcolors} from "../components/mvcolors.js";
```

```js
const lambdaMax = 5;
const lambdaTrue = 1;
const rng = d3.randomLcg(20240516 + regenerate);
const exponentialDraw = d3.randomExponential.source(rng)(lambdaTrue);
const fullData = Array.from({length: 1000}, () => exponentialDraw());
const xMax = Math.ceil(2 * d3.max(fullData)) / 2;
const numBins = 24;
```

<div class="grid grid-cols-2" style="align-items: start;">

<div style="display: flex; flex-direction: column; gap: 1rem;">

<div class="card" style="margin: 0;">

**Model**<br>
${tex`X_1,\ldots,X_n \mid \lambda \sim \operatorname{Expon}(\lambda)`}

</div>

<div class="card" style="margin: 0;">

<b>Data</b>
<div style="display: flex; align-items: center; gap: 1rem;">
<div style="flex: 1;">
${nInput}
${lambdaInput}
</div>
${regenerateInput}
</div>

<b>Plot settings</b>
${rightPlotInput}
${showMLEInput}

```js
const nInput = Inputs.range([1, 1000], {value: 20, step: 1, label: tex`n`});
const n = view(nInput);
```

```js
const lambdaInput = Inputs.range([0.05, lambdaMax], {value: 1, step: 0.05, label: tex`\lambda`});
const lambda = view(lambdaInput);
```

```js
const regenerateInput = Inputs.button(html`Simulate<br>new dataset`);
const regenerate = view(regenerateInput);
```

```js
const rightPlotInput = Inputs.radio(["likelihood", "log-likelihood", "average likelihood"], {value: "likelihood"});
const rightPlotChoice = view(rightPlotInput);
```

```js
const showMLEInput = Inputs.toggle({label: "show ML fit", value: false});
const showMLE = view(showMLEInput);
```

</div>

</div>

<div class="card">

```js
const data = fullData.slice(0, n);
const sumX = d3.sum(data);
const mle = n / sumX;
function loglik(lam) {
  return n * Math.log(lam) - lam * sumX;
}
function avgProb(lam) {
  return Math.exp(loglik(lam) / n);
}
function likelihood(lam) {
  return Math.exp(loglik(lam));
}
const rightCurveData = d3.range(0.001, lambdaMax, 0.02).map((lam) => ({lambda: lam, avgProb: avgProb(lam), loglik: loglik(lam), likelihood: likelihood(lam)}));
```

**Likelihood**<br>
${tex`p(x_1,\ldots,x_n \mid \lambda) = \lambda^n \exp\Big(-\lambda\sum_i x_i\Big)`}

**Log-likelihood**<br>
${tex`\ell(\lambda) = n\log\lambda - \lambda\sum_i x_i`}

**Maximum likelihood estimate (MLE)**<br>
${tex`\hat\lambda = \dfrac{1}{\bar x} = ${mle.toPrecision(3)}`}

**Asymptotic distribution of the MLE**<br>
${tex`\hat\lambda\ \overset{\text{approx}}{\sim}\ \mathcal{N}\Big(\lambda,\ \dfrac{\lambda^2}{n}\Big), \quad \text{se}(\hat\lambda) \approx \dfrac{\hat\lambda}{\sqrt{n}} = ${(mle / Math.sqrt(n)).toPrecision(3)}`}

</div>

</div>

<div class="card" style="margin-top: 1rem;">

<div style="display: flex; gap: 1rem;">
  <div style="flex: 1;">

```js
const binWidth = xMax / numBins;
const binGen = d3.bin().domain([0, xMax]).thresholds(d3.range(0, xMax + binWidth, binWidth));
const dataFreq = binGen(data).map((b) => ({x0: b.x0, x1: b.x1, density: b.length / (data.length * binWidth), type: "Data"}));
const pdfGrid = d3.range(0, xMax, xMax / 200);
const selectedPdf = pdfGrid.map((xv) => ({x: xv, p: lambda * Math.exp(-lambda * xv), type: "Selected λ"}));
const mlePdf = showMLE ? pdfGrid.map((xv) => ({x: xv, p: mle * Math.exp(-mle * xv), type: "MLE of λ"})) : [];
```

```js
Plot.plot({
  width: Math.min(440, width),
  title: "Data distribution",
  x: {label: "x", domain: [0, xMax]},
  y: {label: "density", zero: true},
  color: {
    legend: true,
    domain: showMLE ? ["Data", "Selected λ", "MLE of λ"] : ["Data", "Selected λ"],
    range: showMLE ? [mvcolors[0], mvcolors[1], mvcolors[2]] : [mvcolors[0], mvcolors[1]]
  },
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.rectY(dataFreq, {x1: "x0", x2: "x1", y: "density", fill: "type"}),
    Plot.line(selectedPdf, {x: "x", y: "p", stroke: "type", strokeWidth: 2.5}),
    Plot.line(mlePdf, {x: "x", y: "p", stroke: "type", strokeWidth: 2.5})
  ]
})
```

  </div>
  <div style="flex: 1;">

```js
const rightMode = rightPlotChoice === "log-likelihood" ? "loglik" : rightPlotChoice === "likelihood" ? "likelihood" : "avgProb";
const rightPlotTitle = rightMode === "loglik" ? "Log-likelihood function" : rightMode === "likelihood" ? "Likelihood function" : "Average likelihood for a single observation";
const rightYField = rightMode;
const rightYLabel = rightMode === "loglik" ? "ℓ(λ)" : rightMode === "likelihood" ? "likelihood" : "density";
const rightYTickFormat = rightMode === "likelihood" ? "~e" : undefined;
const rightAxisY = d3.min(rightCurveData, (d) => d[rightYField]);
function rightY(lam) {
  return rightMode === "loglik" ? loglik(lam) : rightMode === "likelihood" ? likelihood(lam) : avgProb(lam);
}
```

```js
Plot.plot({
  width: Math.min(440, width),
  marginLeft: 56,
  title: rightPlotTitle,
  x: {label: "λ", domain: [0, lambdaMax]},
  y: {label: rightYLabel, tickFormat: rightYTickFormat},
  color: {
    legend: true,
    domain: showMLE ? ["Selected λ", "MLE of λ"] : ["Selected λ"],
    range: showMLE ? [mvcolors[1], mvcolors[2]] : [mvcolors[1]]
  },
  marks: [
    Plot.ruleY([rightAxisY]),
    Plot.ruleX([0]),
    Plot.lineY(rightCurveData, {x: "lambda", y: rightYField, stroke: "var(--theme-foreground-muted)", strokeWidth: 2.5}),
    Plot.ruleX([{x: lambda, ylo: rightAxisY, yhi: rightY(lambda)}], {x: "x", y1: "ylo", y2: "yhi", stroke: mvcolors[1], strokeDasharray: "4,3"}),
    Plot.ruleY([{y: rightY(lambda), xlo: 0, xhi: lambda}], {y: "y", x1: "xlo", x2: "xhi", stroke: mvcolors[1], strokeDasharray: "4,3"}),
    Plot.dot([{x: lambda, y: rightY(lambda), type: "Selected λ"}], {x: "x", y: "y", fill: "type", r: 5}),
    ...(showMLE ? [
      Plot.ruleX([{x: mle, ylo: rightAxisY, yhi: rightY(mle)}], {x: "x", y1: "ylo", y2: "yhi", stroke: mvcolors[2], strokeDasharray: "4,3"}),
      Plot.ruleY([{y: rightY(mle), xlo: 0, xhi: mle}], {y: "y", x1: "xlo", x2: "xhi", stroke: mvcolors[2], strokeDasharray: "4,3"}),
      Plot.dot([{x: mle, y: rightY(mle), type: "MLE of λ"}], {x: "x", y: "y", fill: "type", r: 5})
    ] : [])
  ]
})
```

  </div>
</div>

</div>

<style>

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

form.inputs-3a86ea-toggle label {
  width: auto;
}

.card .observablehq--block:empty {
  display: none;
}

.card form[class="inputs-3a86ea"] > label {
  width: auto;
  margin-right: 1rem;
}

.card form[class="inputs-3a86ea"] input[type="number"] {
  width: 3.5rem;
  flex: none;
}

.card > p:last-of-type {
  margin-bottom: 0;
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
