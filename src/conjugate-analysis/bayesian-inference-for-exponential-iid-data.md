---
title: Exponential–Gamma
toc: false
---

# Bayesian inference for Exponential data

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const n = datasettings[0];
const xbar = datasettings[1];
const alpha = priorsettings[0];
const beta = priorsettings[1];
```

```js
function densdata({n, xbar, alpha, beta}) {
  const lowprob = 0.005;
  const highprob = 1 - lowprob;
  const xlimlow = d3.min([
    jStat.gamma.inv(lowprob, alpha, 1 / beta),
    jStat.gamma.inv(lowprob, n, 1 / (n * xbar)),
    jStat.gamma.inv(lowprob, alpha + n, 1 / (beta + n * xbar))
  ]);
  const xlimhigh = d3.max([
    jStat.gamma.inv(highprob, alpha, 1 / beta),
    jStat.gamma.inv(highprob, n, 1 / (n * xbar)),
    jStat.gamma.inv(highprob, alpha + n, 1 / (beta + n * xbar))
  ]);
  const thetas = d3.range(xlimlow, xlimhigh, (xlimhigh - xlimlow) / 500);
  const priorpdf = thetas.map((theta) => ({theta, pdf: jStat.gamma.pdf(theta, alpha, 1 / beta), type: "prior"}));
  const likepdf = thetas.map((theta) => ({theta, pdf: jStat.gamma.pdf(theta, n, 1 / (n * xbar)), type: "likelihood"}));
  const postpdf = thetas.map((theta) => ({theta, pdf: jStat.gamma.pdf(theta, alpha + n, 1 / (beta + n * xbar)), type: "posterior"}));
  return priorpdf.concat(likepdf, postpdf);
}

const dd = densdata({n, xbar, alpha, beta});
const maxpdf = d3.max(dd, (d) => d.pdf);
```

<div class="dist-layout dist-layout--conjugate">

<div class="dist-main">

<div style="display: flex; gap: 1rem;">
  <div class="card" style="flex: 1; min-width: 0; margin: 0;">
    <b>Data</b>
    ${dataInput}

```js
const dataInput = Inputs.form([
  Inputs.range([1, 100], {value: 5, step: 1, label: tex`n`}),
  Inputs.range([Number.EPSILON, 10], {value: 1, step: 1, label: tex`\bar x`})
]);
const datasettings = view(dataInput);
```

  </div>
  <div class="card" style="flex: 1; min-width: 0; margin: 0;">
    <b>Prior</b>
    ${priorInput}

```js
const priorInput = Inputs.form([
  Inputs.range([Number.EPSILON, 5], {value: 1.5, step: 0.1, label: tex`\alpha`}),
  Inputs.range([Number.EPSILON, 5], {value: 1, step: 0.1, label: tex`\beta`})
]);
const priorsettings = view(priorInput);
```

  </div>
</div>

<div class="card">

```js
Plot.plot({
  width: Math.min(720, width),
  color: {
    legend: true,
    domain: ["prior", "likelihood", "posterior"],
    range: [mvcolors[1], mvcolors[0], mvcolors[2]]
  },
  x: {label: "λ"},
  y: {axis: false, domain: [0, 1.02 * maxpdf]},
  marks: [
    Plot.ruleY([0]),
    Plot.line(dd, {x: "theta", y: "pdf", stroke: "type", strokeWidth: 2.5})
  ]
})
```

</div>

</div>

<div class="dist-side">

<div class="card">

**Model**<br>
${tex`X_1,\ldots,X_n \mid \lambda \sim \operatorname{Expon}(\lambda)`}

**Prior**<br>
${tex`\lambda \sim \operatorname{Gamma}(\alpha,\beta)`}

**Posterior**<br>
${tex`\lambda \mid x_1,\ldots,x_n \sim \operatorname{Gamma}(\alpha+n,\, \beta+n\bar x)`}

</div>

<div class="card">

### Prior and Posterior moments

|  | Prior | Posterior |
|---|---|---|
| Mean | ${(alpha / beta).toPrecision(3)} | ${((alpha + n) / (beta + n * xbar)).toPrecision(3)} |
| St. dev | ${Math.sqrt(alpha / beta ** 2).toPrecision(3)} | ${Math.sqrt((alpha + n) / (beta + n * xbar) ** 2).toPrecision(3)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/bayesian-inference-for-exponential-iid-data")}

</div>

</div>
