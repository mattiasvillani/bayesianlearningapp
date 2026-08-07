---
title: MLE - Poisson data
toc: false
---

# Maximum Likelihood — Poisson data

```js
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const kMax = 20;
const lambdaMax = 20;
const kGrid = d3.range(0, kMax + 1);
function logFactorial(k) {
  let s = 0;
  for (let i = 2; i <= k; i++) s += Math.log(i);
  return s;
}
function poissonPmf(k, lam) {
  return Math.exp(k * Math.log(lam) - lam - logFactorial(k));
}
const rng = d3.randomLcg(20240516);
const poissonDraw = d3.randomPoisson.source(rng)(5);
const fullData = Array.from({length: 1000}, () => poissonDraw());
```

<div class="grid grid-cols-2">

<div class="card">

<b>Data</b>
${nInput}
${lambdaInput}

<b>Plot settings</b>
${rightPlotInput}
${showMLEInput}

```js
const nInput = Inputs.range([1, 1000], {value: 20, step: 1, label: tex`n`});
const n = view(nInput);
```

```js
const lambdaInput = Inputs.range([0.1, lambdaMax], {value: 5, step: 0.1, label: tex`\lambda`});
const lambda = view(lambdaInput);
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

```js
const data = fullData.slice(0, n);
const sumX = d3.sum(data);
const sumLogFact = d3.sum(data, (x) => logFactorial(x));
const mle = d3.mean(data);
function loglik(lam) {
  return sumX * Math.log(lam) - n * lam - sumLogFact;
}
function avgProb(lam) {
  return Math.exp(loglik(lam) / n);
}
function likelihood(lam) {
  return Math.exp(loglik(lam));
}
const rightCurveData = d3.range(0.001, lambdaMax, 0.02).map((lam) => ({lambda: lam, avgProb: avgProb(lam), loglik: loglik(lam), likelihood: likelihood(lam)}));
```

**Model**<br>
${tex`X_1,\ldots,X_n \overset{\mathrm{indep}}{\sim} \operatorname{Poisson}(\lambda)`}

**Likelihood**<br>
${tex`p(x_1,\ldots,x_n \mid \lambda) = \dfrac{\lambda^{\sum x_i} e^{-n\lambda}}{\prod_i x_i!}`}

**Log-likelihood**<br>
${tex`\ell(\lambda) = \Big(\sum_i x_i\Big)\log\lambda - n\lambda - \sum_i \log(x_i!)`}

**Maximum likelihood estimate**<br>
${tex`\hat\lambda = \bar{x} = ${mle.toPrecision(3)}`}

</div>

</div>

<div class="card" style="margin-top: 1rem;">

<div style="display: flex; gap: 1rem;">
  <div style="flex: 1;">

```js
const dataFreqMap = d3.rollup(data, (v) => v.length / data.length, (d) => d);
const dataFreq = kGrid.map((k) => ({k, freq: dataFreqMap.get(k) ?? 0, type: "Data"}));
const selectedPmf = kGrid.map((k) => ({k, p: poissonPmf(k, lambda), type: "Selected λ"}));
const mlePmf = showMLE ? kGrid.map((k) => ({k, p: poissonPmf(k, mle), type: "MLE of λ"})) : [];
```

```js
Plot.plot({
  width: Math.min(440, width),
  title: "Data distribution",
  x: {label: "x", domain: [-0.5, kMax + 0.5]},
  y: {label: "P(x)", zero: true},
  color: {
    legend: true,
    domain: showMLE ? ["Data", "Selected λ", "MLE of λ"] : ["Data", "Selected λ"],
    range: showMLE ? [mvcolors[0], mvcolors[1], mvcolors[2]] : [mvcolors[0], mvcolors[1]]
  },
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([-0.5]),
    Plot.rectY(dataFreq, {x: "k", y: "freq", interval: 1, fill: "type"}),
    Plot.line(selectedPmf, {x: "k", y: "p", stroke: "type"}),
    Plot.dot(selectedPmf, {x: "k", y: "p", fill: "type", r: 4}),
    Plot.line(mlePmf, {x: "k", y: "p", stroke: "type"}),
    Plot.dot(mlePmf, {x: "k", y: "p", fill: "type", r: 4})
  ]
})
```

  </div>
  <div style="flex: 1;">

```js
const rightMode = rightPlotChoice === "log-likelihood" ? "loglik" : rightPlotChoice === "likelihood" ? "likelihood" : "avgProb";
const rightPlotTitle = rightMode === "loglik" ? "Log-likelihood function" : rightMode === "likelihood" ? "Likelihood function" : "Average probability for a single observation";
const rightYField = rightMode;
const rightYLabel = rightMode === "loglik" ? "ℓ(λ)" : rightMode === "likelihood" ? "likelihood" : "probability";
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

${notebookLink("https://observablehq.com/@mattiasvillani/maximum-likelihood-for-iid-poisson-data")}

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
