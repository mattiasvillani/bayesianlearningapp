---
title: Exponential–Gamma
toc: false
---

# Bayesian inference for Exponential data

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
  return {data: priorpdf.concat(likepdf, postpdf), xlimlow, xlimhigh};
}

const {data: dd, xlimlow, xlimhigh} = densdata({n, xbar, alpha, beta});
const maxpdf = d3.max(dd, (d) => d.pdf);
```

```js
// Prior/posterior predictive of a new X | lambda ~ Expon(lambda), lambda ~ Gamma(a, b)
// is Lomax(a, b): f(x) = a*b^a / (x+b)^(a+1); mean = b/(a-1) for a>1, var for a>2.
function lomaxPdf(x, a, b) {
  return (a / b) * (1 + x / b) ** (-(a + 1));
}
function lomaxCdf(x, a, b) {
  return 1 - (1 + x / b) ** (-a);
}
function lomaxInv(prob, a, b) {
  return b * ((1 - prob) ** (-1 / a) - 1);
}
function lomaxMean(a, b) {
  return a > 1 ? b / (a - 1) : Infinity;
}
function lomaxSd(a, b) {
  return a > 2 ? Math.sqrt((a * b ** 2) / ((a - 1) ** 2 * (a - 2))) : Infinity;
}
function lomaxMedian(a, b) {
  return b * (2 ** (1 / a) - 1);
}

const priorPredMean = lomaxMean(alpha, beta);
const priorPredSd = lomaxSd(alpha, beta);
const postPredMean = lomaxMean(alpha + n, beta + n * xbar);
const postPredSd = lomaxSd(alpha + n, beta + n * xbar);

const priorPredXMaxDynamic = lomaxInv(0.99, alpha, beta);
const postPredXMaxDynamic = lomaxInv(0.99, alpha + n, beta + n * xbar);

const priorPredPdf = d3.range(0, priorPredXMaxDynamic, priorPredXMaxDynamic / 500).map((x) => ({x, pdf: lomaxPdf(x, alpha, beta)}));
const postPredPdf = d3.range(0, postPredXMaxDynamic, postPredXMaxDynamic / 500).map((x) => ({x, pdf: lomaxPdf(x, alpha + n, beta + n * xbar)}));
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
const showQuantileInput = Inputs.toggle({value: false});
const showQuantile = view(showQuantileInput);
```

```js
const quantileInput = viewMode === "Parameter posterior"
  ? Inputs.range([Math.max(xlimlow, 0), xlimhigh], {value: Number(((xlimlow + xlimhigh) / 2).toFixed(2)), step: 0.01, label: "plot quantile", format: (x) => (Math.abs(x) < 0.005 ? "0.00" : x.toFixed(2))})
  : viewMode === "Prior predictive"
  ? Inputs.range([0, priorPredXMaxDynamic], {value: Number(lomaxMedian(alpha, beta).toFixed(2)), step: 0.01, label: "plot quantile", format: (x) => (Math.abs(x) < 0.005 ? "0.00" : x.toFixed(2))})
  : Inputs.range([0, postPredXMaxDynamic], {value: Number(lomaxMedian(alpha + n, beta + n * xbar).toFixed(2)), step: 0.01, label: "plot quantile", format: (x) => (Math.abs(x) < 0.005 ? "0.00" : x.toFixed(2))});
const quantile = view(quantileInput);
```

<div class="quantile-row" style="display: flex; align-items: center; gap: 0.5rem; margin-top: -0.75rem;">
${showQuantileInput}
${quantileInput}
</div>

```js
const xDomain = resolveDomain(frozenState, freezeAxis, [xlimlow, xlimhigh]);
const priorPredXDomain = resolveDomain(frozenPriorPredState, freezeAxis, [0, priorPredXMaxDynamic]);
const postPredXDomain = resolveDomain(frozenPostPredState, freezeAxis, [0, postPredXMaxDynamic]);
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
        Plot.ruleX([0]),
        ...(showQuantile
          ? [Plot.areaY(priorPredPdf, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[1], fillOpacity: 0.3})]
          : []),
        Plot.line(priorPredPdf, {x: "x", y: "pdf", stroke: mvcolors[1], strokeWidth: 2.5})
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
        Plot.ruleX([0]),
        ...(showQuantile
          ? [Plot.areaY(postPredPdf, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[2], fillOpacity: 0.3})]
          : []),
        Plot.line(postPredPdf, {x: "x", y: "pdf", stroke: mvcolors[2], strokeWidth: 2.5})
      ]
    })
```

<div style="margin-top: -0.75rem; font-size: 13px;">${freezeInput}</div>

</div>

</div>

<div class="dist-side">

<div class="card formula-card">

**Model**<br>
${tex`X_1,\ldots,X_n \mid \lambda \sim \operatorname{Expon}(\lambda)`}

**Prior**<br>
${tex`\lambda \sim \operatorname{Gamma}(\alpha,\beta)`}

**Posterior**<br>
${tex`\lambda \mid x_1,\ldots,x_n \sim \operatorname{Gamma}(\alpha+n,\, \beta+n\bar x)`}

**Prior predictive**<br>
${tex`\tilde X \sim \operatorname{Lomax}(\alpha,\beta)`}

**Posterior predictive**<br>
${tex`\tilde X \mid x_1,\ldots,x_n \sim \operatorname{Lomax}(\alpha+n,\, \beta+n\bar x)`}

</div>

<div class="card">

### Summary

```js
const summaryTable = viewMode === "Parameter posterior"
  ? html`<table>
      <tr><th></th><th>Prior</th><th>Posterior</th></tr>
      <tr><td>Mean</td><td>${(alpha / beta).toPrecision(3)}</td><td>${((alpha + n) / (beta + n * xbar)).toPrecision(3)}</td></tr>
      <tr><td>Standard deviation</td><td>${Math.sqrt(alpha / beta ** 2).toPrecision(3)}</td><td>${Math.sqrt((alpha + n) / (beta + n * xbar) ** 2).toPrecision(3)}</td></tr>
      <tr><td>${tex`P(\lambda \le ${quantile.toFixed(2)})`}</td><td>${jStat.gamma.cdf(quantile, alpha, 1 / beta).toPrecision(4)}</td><td>${jStat.gamma.cdf(quantile, alpha + n, 1 / (beta + n * xbar)).toPrecision(4)}</td></tr>
    </table>`
  : viewMode === "Prior predictive"
  ? html`<table>
      <tr><th></th><th>Prior predictive</th></tr>
      <tr><td>Mean</td><td>${Number.isFinite(priorPredMean) ? priorPredMean.toPrecision(3) : "∞"}</td></tr>
      <tr><td>Standard deviation</td><td>${Number.isFinite(priorPredSd) ? priorPredSd.toPrecision(3) : "∞"}</td></tr>
      <tr><td>${tex`P(\tilde X \le ${quantile.toFixed(2)})`}</td><td>${lomaxCdf(quantile, alpha, beta).toPrecision(4)}</td></tr>
    </table>`
  : html`<table>
      <tr><th></th><th>Posterior predictive</th></tr>
      <tr><td>Mean</td><td>${Number.isFinite(postPredMean) ? postPredMean.toPrecision(3) : "∞"}</td></tr>
      <tr><td>Standard deviation</td><td>${Number.isFinite(postPredSd) ? postPredSd.toPrecision(3) : "∞"}</td></tr>
      <tr><td>${tex`P(\tilde X \le ${quantile.toFixed(2)})`}</td><td>${lomaxCdf(quantile, alpha + n, beta + n * xbar).toPrecision(4)}</td></tr>
    </table>`;
display(summaryTable);
```

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/bayesian-inference-for-exponential-iid-data")}

</div>

</div>

<style>

.dist-main figure {
  margin: 0;
}

.quantile-row form.inputs-3a86ea {
  width: auto;
}

.formula-card .katex {
  font-size: 1.1em;
}

</style>
