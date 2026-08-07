---
title: Bernoulli–Beta
toc: false
---

# Bayesian inference for Bernoulli data

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const alpha = priorsettings[0];
const beta = priorsettings[1];
const f = n - s;
```

```js
function densdata({n, s, alpha, beta}) {
  const f = n - s;
  const thetas = d3.range(0.001, 1, 0.001);
  const priorpdf = thetas.map((theta) => ({theta, pdf: jStat.beta.pdf(theta, alpha, beta), type: "prior"}));
  const likepdf = thetas.map((theta) => ({theta, pdf: jStat.beta.pdf(theta, s, f), type: "likelihood"}));
  const postpdf = thetas.map((theta) => ({theta, pdf: jStat.beta.pdf(theta, alpha + s, beta + f), type: "posterior"}));
  return priorpdf.concat(likepdf, postpdf);
}

const dd = densdata({n, s, alpha, beta});
const maxpdf = d3.max(dd, (d) => d.pdf);
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div style="display: flex; gap: 1rem;">
  <div class="card" style="flex: 1; min-width: 0; margin: 0;">
    <b>Data</b>
    ${nInput}
    ${sInput}

```js
const nInput = Inputs.range([1, 100], {value: 5, step: 1, label: tex`n`});
const n = view(nInput);
```

```js
const sInput = Inputs.range([0, n], {value: 2, step: 1, label: tex`s`});
const s = view(sInput);
```

  </div>
  <div class="card" style="flex: 1; min-width: 0; margin: 0;">
    <b>Prior</b>
    ${priorInput}

```js
const priorInput = Inputs.form([
  Inputs.range([0.5, 10], {value: 3, step: 0.1, label: tex`\alpha`}),
  Inputs.range([0.5, 10], {value: 2, step: 0.1, label: tex`\beta`})
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
  x: {label: "θ", domain: [0, 1]},
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
${tex`X_1,\ldots,X_n \mid \theta \sim \operatorname{Bern}(\theta)`}

**Prior**<br>
${tex`\theta \sim \operatorname{Beta}(\alpha,\beta)`}

**Posterior**<br>
${tex`\theta \mid x_1,\ldots,x_n \sim \operatorname{Beta}(\alpha+s,\, \beta+f)`}

</div>

<div class="card">

### Summary

|  | Prior | Posterior |
|---|---|---|
| Mean | ${(alpha / (alpha + beta)).toPrecision(3)} | ${((alpha + s) / (alpha + beta + n)).toPrecision(3)} |
| Standard deviation | ${Math.sqrt((alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1))).toPrecision(3)} | ${Math.sqrt(((alpha + s) * (beta + f)) / ((alpha + beta + n) ** 2 * (alpha + beta + n + 1))).toPrecision(3)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/bayesian-inference-for-bernoulli-iid-data")}

</div>

</div>
