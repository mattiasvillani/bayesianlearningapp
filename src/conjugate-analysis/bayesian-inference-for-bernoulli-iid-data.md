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

```js
// Prior/posterior predictive of a new trial X | theta ~ Bern(theta), theta ~ Beta(a, b)
// is Bernoulli with success probability equal to the mean of the Beta.
const priorPredP = alpha / (alpha + beta);
const postPredP = (alpha + s) / (alpha + beta + n);
const priorPredData = [{x: 0, pdf: 1 - priorPredP}, {x: 1, pdf: priorPredP}];
const postPredData = [{x: 0, pdf: 1 - postPredP}, {x: 1, pdf: postPredP}];
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

<div class="card" style="padding-top: 1rem;">

${viewInput}

```js
const viewInput = Inputs.radio(["Parameter posterior", "Prior predictive", "Posterior predictive"], {value: "Parameter posterior"});
const viewMode = view(viewInput);
```

```js
viewMode === "Parameter posterior"
  ? Plot.plot({
      width: Math.min(720, width),
      style: {fontSize: "13px"},
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
  : viewMode === "Prior predictive"
  ? Plot.plot({
      width: Math.min(720, width),
      style: {fontSize: "13px"},
      title: "Prior predictive distribution",
      x: {label: "x", domain: [-0.5, 1.5], ticks: [0, 1]},
      y: {label: "p(x)"},
      marks: [
        Plot.ruleY([0]),
        Plot.rectY(priorPredData, {
          x1: (d) => d.x - 0.4, x2: (d) => d.x + 0.4, y: "pdf", fill: mvcolors[1],
          title: (d) => `P(X̃=${d.x}) = ${d.pdf.toPrecision(4)}`
        })
      ]
    })
  : Plot.plot({
      width: Math.min(720, width),
      style: {fontSize: "13px"},
      title: "Posterior predictive distribution",
      x: {label: "x", domain: [-0.5, 1.5], ticks: [0, 1]},
      y: {label: "p(x)"},
      marks: [
        Plot.ruleY([0]),
        Plot.rectY(postPredData, {
          x1: (d) => d.x - 0.4, x2: (d) => d.x + 0.4, y: "pdf", fill: mvcolors[2],
          title: (d) => `P(X̃=${d.x}) = ${d.pdf.toPrecision(4)}`
        })
      ]
    })
```

</div>

</div>

<div class="dist-side">

<div class="card formula-card">

**Model**<br>
${tex`X_1,\ldots,X_n \mid \theta \sim \operatorname{Bern}(\theta)`}

**Prior**<br>
${tex`\theta \sim \operatorname{Beta}(\alpha,\beta)`}

**Posterior**<br>
${tex`\theta \mid x_1,\ldots,x_n \sim \operatorname{Beta}(\alpha+s,\, \beta+f)`}

**Prior predictive**<br>
${tex`\tilde X \sim \operatorname{Bern}\Big(\dfrac{\alpha}{\alpha+\beta}\Big)`}

**Posterior predictive**<br>
${tex`\tilde X \mid x_1,\ldots,x_n \sim \operatorname{Bern}\Big(\dfrac{\alpha+s}{\alpha+\beta+n}\Big)`}

</div>

<div class="card">

### Summary

```js
const summaryTable = viewMode === "Parameter posterior"
  ? html`<table>
      <tr><th></th><th>Prior</th><th>Posterior</th></tr>
      <tr><td>Mean</td><td>${(alpha / (alpha + beta)).toPrecision(3)}</td><td>${((alpha + s) / (alpha + beta + n)).toPrecision(3)}</td></tr>
      <tr><td>Standard deviation</td><td>${Math.sqrt((alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1))).toPrecision(3)}</td><td>${Math.sqrt(((alpha + s) * (beta + f)) / ((alpha + beta + n) ** 2 * (alpha + beta + n + 1))).toPrecision(3)}</td></tr>
    </table>`
  : viewMode === "Prior predictive"
  ? html`<table>
      <tr><th></th><th>Prior predictive</th></tr>
      <tr><td>Mean</td><td>${priorPredP.toPrecision(3)}</td></tr>
      <tr><td>Standard deviation</td><td>${Math.sqrt(priorPredP * (1 - priorPredP)).toPrecision(3)}</td></tr>
    </table>`
  : html`<table>
      <tr><th></th><th>Posterior predictive</th></tr>
      <tr><td>Mean</td><td>${postPredP.toPrecision(3)}</td></tr>
      <tr><td>Standard deviation</td><td>${Math.sqrt(postPredP * (1 - postPredP)).toPrecision(3)}</td></tr>
    </table>`;
display(summaryTable);
```

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/bayesian-inference-for-bernoulli-iid-data")}

</div>

</div>

<style>

.dist-main figure {
  margin: 0;
}

.formula-card .katex {
  font-size: 1.1em;
}

</style>
