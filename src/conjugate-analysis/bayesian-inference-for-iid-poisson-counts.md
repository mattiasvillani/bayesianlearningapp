---
title: Poisson–Gamma
toc: false
---

# Bayesian inference for iid Poisson counts

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {createFreezeState, resolveDomain} from "../components/freezeAxis.js";
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
  return {data: priorpdf.concat(likepdf, postpdf), xlimlow, xlimhigh};
}

const {data: dd, xlimlow, xlimhigh} = densdata({n, xbar, alpha, beta});
const maxpdf = d3.max(dd, (d) => d.pdf);
```

```js
// Prior and posterior predictive of a new count X, marginalized over the
// Gamma prior/posterior for lambda, are both Negative Binomial.
function negbinPdfData(r, p) {
  const mean = (r * (1 - p)) / p;
  const variance = (r * (1 - p)) / p ** 2;
  return d3.range(0, Math.floor(mean + 5 * Math.sqrt(variance)) + 1, 1)
    .map((x) => ({x, pdf: jStat.negbin.pdf(x, r, p)}));
}

const priorPredR = alpha;
const priorPredP = beta / (1 + beta);
const postPredR = alpha + n * xbar;
const postPredP = (beta + n) / (beta + n + 1);

const priorPredPdf = negbinPdfData(priorPredR, priorPredP);
const postPredPdf = negbinPdfData(postPredR, postPredP);

const priorPredMean = (priorPredR * (1 - priorPredP)) / priorPredP;
const priorPredSd = Math.sqrt((priorPredR * (1 - priorPredP)) / priorPredP ** 2);
const postPredMean = (postPredR * (1 - postPredP)) / postPredP;
const postPredSd = Math.sqrt((postPredR * (1 - postPredP)) / postPredP ** 2);

const priorPredXMaxDynamic = d3.max(priorPredPdf, (d) => d.x);
const postPredXMaxDynamic = d3.max(postPredPdf, (d) => d.x);
```

```js
const frozenState = createFreezeState();
const frozenPriorPredState = createFreezeState();
const frozenPostPredState = createFreezeState();
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div style="display: flex; gap: 1rem;">
  <div class="card" style="flex: 1; min-width: 0; margin: 0;">
    <b>Data</b>
    ${dataInput}

```js
const dataInput = Inputs.form([
  Inputs.range([1, 200], {value: 5, step: 1, label: tex`n`}),
  Inputs.range([Number.EPSILON, 10], {value: 2, step: 0.1, label: tex`\bar x`})
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

<div class="card" style="padding-top: 1rem;">

${viewInput}

```js
const viewInput = Inputs.radio(["Parameter posterior", "Prior predictive", "Posterior predictive"], {value: "Parameter posterior"});
const viewMode = view(viewInput);
```

```js
const freezeInput = Inputs.toggle({label: "Freeze x-axis", value: true});
const freezeAxis = view(freezeInput);
```

```js
const showQuantileInput = Inputs.toggle({value: true});
const showQuantile = view(showQuantileInput);
```

```js
const quantileInput = viewMode === "Parameter posterior"
  ? Inputs.range([Math.max(xlimlow, 0), xlimhigh], {value: Number(((xlimlow + xlimhigh) / 2).toFixed(2)), step: 0.01, label: "plot quantile", format: (x) => x.toFixed(2)})
  : viewMode === "Prior predictive"
  ? Inputs.range([0, priorPredXMaxDynamic], {value: Math.round(priorPredMean), step: 1, label: "plot quantile"})
  : Inputs.range([0, postPredXMaxDynamic], {value: Math.round(postPredMean), step: 1, label: "plot quantile"});
const quantile = view(quantileInput);
```

<div class="quantile-row" style="display: flex; align-items: center; gap: 0.5rem; margin-top: -0.75rem;">
${showQuantileInput}
${quantileInput}
</div>

```js
const xDomain = resolveDomain(frozenState, freezeAxis, [xlimlow, xlimhigh]);
const priorPredXDomain = resolveDomain(frozenPriorPredState, freezeAxis, [-0.5, priorPredXMaxDynamic]);
const postPredXDomain = resolveDomain(frozenPostPredState, freezeAxis, [-0.5, postPredXMaxDynamic]);
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
      x: {label: "λ", domain: xDomain},
      y: {axis: false, domain: [0, 1.02 * maxpdf]},
      marks: [
        Plot.ruleY([0]),
        ...(showQuantile
          ? [
              Plot.areaY(dd, {filter: (d) => d.type === "prior" && d.theta <= quantile, x: "theta", y: "pdf", fill: mvcolors[1], fillOpacity: 0.25}),
              Plot.areaY(dd, {filter: (d) => d.type === "posterior" && d.theta <= quantile, x: "theta", y: "pdf", fill: mvcolors[2], fillOpacity: 0.25})
            ]
          : []),
        Plot.line(dd, {x: "theta", y: "pdf", stroke: "type", strokeWidth: 2.5})
      ]
    })
  : viewMode === "Prior predictive"
  ? Plot.plot({
      width: Math.min(720, width),
      style: {fontSize: "13px"},
      title: "Prior predictive distribution",
      x: {label: "x", domain: priorPredXDomain},
      y: {label: "p(x)"},
      marks: [
        Plot.ruleY([0]),
        Plot.rectY(priorPredPdf, {
          x1: (d) => d.x - 0.4, x2: (d) => d.x + 0.4, y: "pdf", fill: mvcolors[1], fillOpacity: showQuantile ? 0.3 : 1,
          title: (d) => `P(X̃=${d.x}) = ${d.pdf.toPrecision(4)}`
        }),
        ...(showQuantile
          ? [Plot.rectY(priorPredPdf, {
              filter: (d) => d.x <= quantile,
              x1: (d) => d.x - 0.4, x2: (d) => d.x + 0.4, y: "pdf", fill: mvcolors[1],
              title: (d) => `P(X̃=${d.x}) = ${d.pdf.toPrecision(4)}`
            })]
          : [])
      ]
    })
  : Plot.plot({
      width: Math.min(720, width),
      style: {fontSize: "13px"},
      title: "Posterior predictive distribution",
      x: {label: "x", domain: postPredXDomain},
      y: {label: "p(x)"},
      marks: [
        Plot.ruleY([0]),
        Plot.rectY(postPredPdf, {
          x1: (d) => d.x - 0.4, x2: (d) => d.x + 0.4, y: "pdf", fill: mvcolors[2], fillOpacity: showQuantile ? 0.3 : 1,
          title: (d) => `P(X̃=${d.x}) = ${d.pdf.toPrecision(4)}`
        }),
        ...(showQuantile
          ? [Plot.rectY(postPredPdf, {
              filter: (d) => d.x <= quantile,
              x1: (d) => d.x - 0.4, x2: (d) => d.x + 0.4, y: "pdf", fill: mvcolors[2],
              title: (d) => `P(X̃=${d.x}) = ${d.pdf.toPrecision(4)}`
            })]
          : [])
      ]
    })
```

<div style="margin-top: -0.75rem; font-size: 13px;">${freezeInput}</div>

</div>

</div>

<div class="dist-side">

<div class="card formula-card">

**Model**<br>
${tex`X_1,\ldots,X_n \mid \lambda \sim \operatorname{Pois}(\lambda)`}

**Prior**<br>
${tex`\lambda \sim \operatorname{Gamma}(\alpha,\beta)`}

**Posterior**<br>
${tex`\lambda \mid x_1,\ldots,x_n \sim \operatorname{Gamma}(\alpha+n\bar x,\, \beta+n)`}

**Prior predictive**<br>
${tex`\tilde X \sim \operatorname{NegBin}\Big(\alpha,\dfrac{\beta}{\beta+1}\Big)`}

**Posterior predictive**<br>
${tex`\tilde X \mid x_1,\ldots,x_n \sim \operatorname{NegBin}\Big(\alpha+n\bar x,\,\dfrac{\beta+n}{\beta+n+1}\Big)`}

</div>

<div class="card">

### Summary

```js
const summaryTable = viewMode === "Parameter posterior"
  ? html`<table>
      <tr><th></th><th>Prior</th><th>Posterior</th></tr>
      <tr><td>Mean</td><td>${(alpha / beta).toPrecision(3)}</td><td>${((alpha + n * xbar) / (beta + n)).toPrecision(3)}</td></tr>
      <tr><td>Standard deviation</td><td>${Math.sqrt(alpha / beta ** 2).toPrecision(3)}</td><td>${Math.sqrt((alpha + n * xbar) / (beta + n) ** 2).toPrecision(3)}</td></tr>
      <tr><td>${tex`P(\lambda \le ${quantile.toPrecision(3)})`}</td><td>${jStat.gamma.cdf(quantile, alpha, 1 / beta).toPrecision(4)}</td><td>${jStat.gamma.cdf(quantile, alpha + n * xbar, 1 / (beta + n)).toPrecision(4)}</td></tr>
    </table>`
  : viewMode === "Prior predictive"
  ? html`<table>
      <tr><th></th><th>Prior predictive</th></tr>
      <tr><td>Mean</td><td>${priorPredMean.toPrecision(3)}</td></tr>
      <tr><td>Standard deviation</td><td>${priorPredSd.toPrecision(3)}</td></tr>
      <tr><td>${tex`P(\tilde X \le ${Math.round(quantile)})`}</td><td>${jStat.negbin.cdf(Math.round(quantile), priorPredR, priorPredP).toPrecision(4)}</td></tr>
    </table>`
  : html`<table>
      <tr><th></th><th>Posterior predictive</th></tr>
      <tr><td>Mean</td><td>${postPredMean.toPrecision(3)}</td></tr>
      <tr><td>Standard deviation</td><td>${postPredSd.toPrecision(3)}</td></tr>
      <tr><td>${tex`P(\tilde X \le ${Math.round(quantile)})`}</td><td>${jStat.negbin.cdf(Math.round(quantile), postPredR, postPredP).toPrecision(4)}</td></tr>
    </table>`;
display(summaryTable);
```

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/bayesian-inference-for-iid-poisson-counts")}

</div>

</div>

<style>

.quantile-row form.inputs-3a86ea {
  width: auto;
}

.formula-card .katex {
  font-size: 1.1em;
}

</style>
