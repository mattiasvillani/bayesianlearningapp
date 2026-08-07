---
title: MLE - Bernoulli data
toc: false
---

# Maximum Likelihood — Bernoulli data

```js
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const mle = s / n;
function loglik(th) {
  return s * Math.log(th) + (n - s) * Math.log(1 - th);
}
function avgProb(th) {
  return Math.exp(loglik(th) / n);
}
function likelihood(th) {
  return Math.exp(loglik(th));
}
const rightCurveData = d3.range(0.001, 1, 0.001).map((th) => ({theta: th, avgProb: avgProb(th), loglik: loglik(th), likelihood: likelihood(th)}));
```

<div class="grid grid-cols-2">

<div class="card">

<b>Data</b>
${nInput}
${sInput}
${thetaInput}

<b>Plot settings</b>
${rightPlotInput}
${showMLEInput}

```js
const nInput = Inputs.range([1, 100], {value: 5, step: 1, label: tex`n`});
const n = view(nInput);
```

```js
const sInput = Inputs.range([0, n], {value: 2, step: 1, label: tex`s`});
const s = view(sInput);
```

```js
const thetaInput = Inputs.range([0.001, 0.999], {value: 0.5, step: 0.01, label: tex`\theta`});
const theta = view(thetaInput);
```

```js
const rightPlotInput = Inputs.radio(["likelihood", "log-likelihood", "average probability"], {value: "likelihood"});
const rightPlotChoice = view(rightPlotInput);
```

```js
const showMLEInput = Inputs.toggle({label: "show ML fit", value: false});
const showMLE = view(showMLEInput);
```

</div>

<div class="card">

**Model**<br>
${tex`X_1,\ldots,X_n \overset{\mathrm{indep}}{\sim} \operatorname{Bern}(\theta)`}

**Likelihood**<br>
${tex`p(x_1,\ldots,x_n \mid \theta) = \theta^s (1-\theta)^{n-s}`}

**Log-likelihood**<br>
${tex`\ell(\theta) = s\log\theta + (n-s)\log(1-\theta)`}

**Maximum likelihood estimate**<br>
${tex`\hat\theta = s/n = ${mle.toPrecision(3)}`}

</div>

</div>

<div class="card" style="margin-top: 1rem;">

<div style="display: flex; gap: 1rem;">
  <div style="flex: 1;">

```js
const spikeOffset = 0.06;
const thetaSpikeData = [
  {x: 0 - spikeOffset, y: 1 - theta, type: "Selected θ"},
  {x: 1 - spikeOffset, y: theta, type: "Selected θ"}
];
const dataSpikeData = [
  {x: 0, y: 1 - s / n, type: "Data"},
  {x: 1, y: s / n, type: "Data"}
];
const mleSpikeData = showMLE ? [
  {x: 0 + spikeOffset, y: 1 - mle, type: "MLE of θ"},
  {x: 1 + spikeOffset, y: mle, type: "MLE of θ"}
] : [];
```

```js
Plot.plot({
  width: Math.min(440, width),
  title: "Data distribution",
  x: {label: "x", axis: true, domain: [-0.5, 1.5], ticks: [0, 1], tickFormat: ".0"},
  y: {label: "P(x)", zero: true},
  color: {
    legend: true,
    domain: showMLE ? ["Data", "Selected θ", "MLE of θ"] : ["Data", "Selected θ"],
    range: showMLE ? [mvcolors[0], mvcolors[1], mvcolors[2]] : [mvcolors[0], mvcolors[1]]
  },
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([-0.5]),
    Plot.ruleX(dataSpikeData, {x: "x", y: "y", stroke: "type", strokeWidth: 2}),
    Plot.dot(dataSpikeData, {x: "x", y: "y", fill: "type", r: 5}),
    Plot.ruleX(thetaSpikeData, {x: "x", y: "y", stroke: "type", strokeWidth: 2}),
    Plot.dot(thetaSpikeData, {x: "x", y: "y", fill: "type", r: 5}),
    Plot.ruleX(mleSpikeData, {x: "x", y: "y", stroke: "type", strokeWidth: 2}),
    Plot.dot(mleSpikeData, {x: "x", y: "y", fill: "type", r: 5})
  ]
})
```

  </div>
  <div style="flex: 1;">

```js
const rightMode = rightPlotChoice === "log-likelihood" ? "loglik" : rightPlotChoice === "likelihood" ? "likelihood" : "avgProb";
const rightPlotTitle = rightMode === "loglik" ? "Log-likelihood function" : rightMode === "likelihood" ? "Likelihood function" : "Average probability for a single observation";
const rightYField = rightMode;
const rightYLabel = rightMode === "loglik" ? "ℓ(θ)" : rightMode === "likelihood" ? "likelihood" : "probability";
const rightYTickFormat = rightMode === "likelihood" ? "~e" : undefined;
const rightAxisY = d3.min(rightCurveData, (d) => d[rightYField]);
function rightY(th) {
  return rightMode === "loglik" ? loglik(th) : rightMode === "likelihood" ? likelihood(th) : avgProb(th);
}
```

```js
Plot.plot({
  width: Math.min(440, width),
  marginLeft: 56,
  title: rightPlotTitle,
  x: {label: "θ", domain: [0, 1]},
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
    Plot.ruleX([{x: theta, ylo: rightAxisY, yhi: rightY(theta)}], {x: "x", y1: "ylo", y2: "yhi", stroke: mvcolors[1], strokeDasharray: "4,3"}),
    Plot.ruleY([{y: rightY(theta), xlo: 0, xhi: theta}], {y: "y", x1: "xlo", x2: "xhi", stroke: mvcolors[1], strokeDasharray: "4,3"}),
    Plot.dot([{x: theta, y: rightY(theta), type: "Selected θ"}], {x: "x", y: "y", fill: "type", r: 5}),
    ...(showMLE ? [
      Plot.ruleX([{x: mle, ylo: rightAxisY, yhi: rightY(mle)}], {x: "x", y1: "ylo", y2: "yhi", stroke: mvcolors[2], strokeDasharray: "4,3"}),
      Plot.ruleY([{y: rightY(mle), xlo: 0, xhi: mle}], {y: "y", x1: "xlo", x2: "xhi", stroke: mvcolors[2], strokeDasharray: "4,3"}),
      Plot.dot([{x: mle, y: rightY(mle), type: "MLE of θ"}], {x: "x", y: "y", fill: "type", r: 5})
    ] : [])
  ]
})
```

  </div>
</div>

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/maximum-likelihood-bernoulli-data")}

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

</style>
