---
title: Poisson–Gamma
toc: false
---

# Bayesian inference for iid Poisson counts

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="grid grid-cols-2">
  <div class="card">
    <b>Data</b>
    ${dataInput}
  </div>
  <div class="card">
    <b>Prior</b>
    ${priorInput}
  </div>
</div>

```js
const dataInput = Inputs.form([
  Inputs.range([1, 200], {value: 5, step: 1, label: "n"}),
  Inputs.range([Number.EPSILON, 10], {value: 2, step: 0.1, label: "x̄"})
]);
const datasettings = view(dataInput);
```

```js
const priorInput = Inputs.form([
  Inputs.range([Number.EPSILON, 5], {value: 1.5, step: 0.1, label: "α"}),
  Inputs.range([Number.EPSILON, 5], {value: 1, step: 0.1, label: "β"})
]);
const priorsettings = view(priorInput);
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
    jStat.gamma.inv(lowprob, n * xbar, 1 / n),
    jStat.gamma.inv(lowprob, alpha + n * xbar, 1 / (beta + n))
  ]);
  const xlimhigh = d3.max([
    jStat.gamma.inv(highprob, alpha, 1 / beta),
    jStat.gamma.inv(highprob, n * xbar, 1 / n),
    jStat.gamma.inv(highprob, alpha + n * xbar, 1 / (beta + n))
  ]);
  const thetas = d3.range(xlimlow, xlimhigh, (xlimhigh - xlimlow) / 500);
  const priorpdf = thetas.map((theta) => ({theta, pdf: jStat.gamma.pdf(theta, alpha, 1 / beta), type: "prior"}));
  const likepdf = thetas.map((theta) => ({theta, pdf: jStat.gamma.pdf(theta, n * xbar, 1 / n), type: "likelihood"}));
  const postpdf = thetas.map((theta) => ({theta, pdf: jStat.gamma.pdf(theta, alpha + n * xbar, 1 / (beta + n)), type: "posterior"}));
  return priorpdf.concat(likepdf, postpdf);
}

const dd = densdata({n, xbar, alpha, beta});
const maxpdf = d3.max(dd, (d) => d.pdf);
```

```js
Plot.plot({
  width: Math.min(720, width),
  color: {
    legend: true,
    domain: ["prior", "likelihood", "posterior"],
    range: [mvcolors[1], mvcolors[0], mvcolors[3]]
  },
  x: {label: "λ"},
  y: {axis: false, domain: [0, 1.02 * maxpdf]},
  marks: [
    Plot.ruleY([0]),
    Plot.line(dd, {x: "theta", y: "pdf", stroke: "type", strokeWidth: 2.5})
  ]
})
```

<div class="card">

|  | Prior | Posterior |
|---|---|---|
| Mean | ${(alpha / beta).toPrecision(3)} | ${((alpha + n * xbar) / (beta + n)).toPrecision(3)} |
| St. dev | ${Math.sqrt(alpha / beta ** 2).toPrecision(3)} | ${Math.sqrt((alpha + n * xbar) / (beta + n) ** 2).toPrecision(3)} |

</div>
