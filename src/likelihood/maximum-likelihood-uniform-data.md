---
title: MLE - Uniform data
toc: false
---

# Maximum Likelihood — Uniform data

```js
import {mvcolors} from "../components/mvcolors.js";
```

```js
const thetaMax = 5;
const thetaTrue = 2;
const rng = d3.randomLcg(20240516 + regenerate);
const uniformDraw = d3.randomUniform.source(rng)(0, thetaTrue);
const fullData = Array.from({length: 1000}, () => uniformDraw());
const numBins = 25;
```

<div class="grid grid-cols-2" style="align-items: start;">

<div style="display: flex; flex-direction: column; gap: 1rem;">

<div class="card" style="margin: 0;">

**Model**<br>
${tex`X_1,\ldots,X_n \mid \theta \overset{\mathrm{iid}}{\sim} \operatorname{Unif}(0,\theta)`}

</div>

<div class="card" style="margin: 0;">

<b>Data</b>
<div style="display: flex; align-items: center; gap: 1rem;">
<div style="flex: 1;">
${nInput}
${thetaInput}
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
const thetaInput = Inputs.range([0.01, thetaMax], {value: 2, step: 0.01, label: tex`\theta`});
const theta = view(thetaInput);
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
const mle = d3.max(data);
function loglik(th) {
  return th >= mle ? -n * Math.log(th) : NaN;
}
function avgProb(th) {
  return th >= mle ? 1 / th : 0;
}
function likelihood(th) {
  return th >= mle ? Math.pow(th, -n) : 0;
}
const rightCurveData = d3.range(0.001, thetaMax, thetaMax / 500).map((th) => ({theta: th, avgProb: avgProb(th), loglik: loglik(th), likelihood: likelihood(th)}));
```

**Likelihood**<br>
${tex`p(x_1,\ldots,x_n \mid \theta) = \theta^{-n}\,\mathbb{1}(\theta \ge \max_i x_i)`}

**Log-likelihood**<br>
${tex`\ell(\theta) = -n\log\theta, \quad \theta \ge x_{(n)} = \max_i x_i`}

**Maximum likelihood estimate (MLE)**<br>
${tex`\hat\theta = \max_i x_i = x_{(n)} = ${mle.toPrecision(3)}`}

**Exact distribution of the MLE**<br>
${tex`\dfrac{\hat\theta}{\theta} \sim \operatorname{Beta}(n,1), \quad \Pr(\hat\theta \le t) = \Big(\dfrac{t}{\theta}\Big)^{n},\ \ 0 \le t \le \theta`}

</div>

</div>

<div class="card" style="margin-top: 1rem;">

<div style="display: flex; gap: 1rem;">
  <div style="flex: 1;">

```js
const binWidth = thetaMax / numBins;
const binGen = d3.bin().domain([0, thetaMax]).thresholds(d3.range(0, thetaMax + binWidth, binWidth));
const dataFreq = binGen(data).map((b) => ({x0: b.x0, x1: b.x1, density: b.length / (data.length * binWidth), type: "Data"}));
const pdfGrid = d3.range(0, thetaMax, thetaMax / 400);
const selectedPdf = pdfGrid.map((xv) => ({x: xv, p: xv <= theta ? 1 / theta : 0, type: "Selected θ"}));
const mlePdf = showMLE ? pdfGrid.map((xv) => ({x: xv, p: xv <= mle ? 1 / mle : 0, type: "MLE of θ"})) : [];
```

```js
Plot.plot({
  width: Math.min(440, width),
  title: "Data distribution",
  x: {label: "x", domain: [0, thetaMax]},
  y: {label: "density", zero: true},
  color: {
    legend: true,
    domain: showMLE ? ["Data", "Selected θ", "MLE of θ"] : ["Data", "Selected θ"],
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
const rightYLabel = rightMode === "loglik" ? "ℓ(θ)" : rightMode === "likelihood" ? "likelihood" : "density";
const rightYTickFormat = rightMode === "likelihood" ? "~e" : undefined;
const rightAxisY = d3.min(rightCurveData, (d) => (Number.isFinite(d[rightYField]) ? d[rightYField] : Infinity));
function rightY(th) {
  return rightMode === "loglik" ? loglik(th) : rightMode === "likelihood" ? likelihood(th) : avgProb(th);
}
const selectedY = rightY(theta);
const mleY = rightY(mle);
```

```js
Plot.plot({
  width: Math.min(440, width),
  marginLeft: 56,
  title: rightPlotTitle,
  x: {label: "θ", domain: [0, thetaMax]},
  y: {label: rightYLabel, tickFormat: rightYTickFormat},
  color: {
    legend: true,
    domain: showMLE ? ["Selected θ", "MLE of θ"] : ["Selected θ"],
    range: showMLE ? [mvcolors[1], mvcolors[2]] : [mvcolors[1]]
  },
  marks: [
    Plot.ruleY([rightAxisY]),
    Plot.ruleX([0]),
    Plot.lineY(rightCurveData, {x: "theta", y: rightYField, stroke: "var(--theme-foreground-muted)", strokeWidth: 2.5}),
    ...(Number.isFinite(selectedY) ? [
      Plot.ruleX([{x: theta, ylo: rightAxisY, yhi: selectedY}], {x: "x", y1: "ylo", y2: "yhi", stroke: mvcolors[1], strokeDasharray: "4,3"}),
      Plot.ruleY([{y: selectedY, xlo: 0, xhi: theta}], {y: "y", x1: "xlo", x2: "xhi", stroke: mvcolors[1], strokeDasharray: "4,3"}),
      Plot.dot([{x: theta, y: selectedY, type: "Selected θ"}], {x: "x", y: "y", fill: "type", r: 5})
    ] : []),
    ...(showMLE ? [
      Plot.ruleX([{x: mle, ylo: rightAxisY, yhi: mleY}], {x: "x", y1: "ylo", y2: "yhi", stroke: mvcolors[2], strokeDasharray: "4,3"}),
      Plot.ruleY([{y: mleY, xlo: 0, xhi: mle}], {y: "y", x1: "xlo", x2: "xhi", stroke: mvcolors[2], strokeDasharray: "4,3"}),
      Plot.dot([{x: mle, y: mleY, type: "MLE of θ"}], {x: "x", y: "y", fill: "type", r: 5})
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
