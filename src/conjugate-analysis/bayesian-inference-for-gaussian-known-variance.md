---
title: Gaussian (known variance)
toc: false
---

# Bayesian inference for Gaussian iid data with known variance

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {createFreezeState, resolveDomain} from "../components/freezeAxis.js";
```

```js
const n = datasettings[0];
const xbar = datasettings[1];
const sigma = datasettings[2];
const mu0 = priorsettings[0];
const tau0 = priorsettings[1];
const taun = Math.sqrt(1 / (n / sigma ** 2 + 1 / tau0 ** 2));
const w = (n / sigma ** 2) / (n / sigma ** 2 + 1 / tau0 ** 2);
const mun = w * xbar + (1 - w) * mu0;
```

```js
function densdata({mu0, tau0, xbar, sigma, n, mun, taun}) {
  const likesd = sigma / Math.sqrt(n);
  const xlimlow = d3.min([mu0 - 4 * tau0, xbar - 4 * likesd, mun - 4 * taun]);
  const xlimhigh = d3.max([mu0 + 4 * tau0, xbar + 4 * likesd, mun + 4 * taun]);
  const thetas = d3.range(xlimlow, xlimhigh, (xlimhigh - xlimlow) / 500);
  const priorpdf = thetas.map((theta) => ({theta, pdf: jStat.normal.pdf(theta, mu0, tau0), type: "prior"}));
  const likepdf = thetas.map((theta) => ({theta, pdf: jStat.normal.pdf(theta, xbar, likesd), type: "likelihood"}));
  const postpdf = thetas.map((theta) => ({theta, pdf: jStat.normal.pdf(theta, mun, taun), type: "posterior"}));
  return {data: priorpdf.concat(likepdf, postpdf), xlimlow, xlimhigh};
}

const {data: dd, xlimlow, xlimhigh} = densdata({mu0, tau0, xbar, sigma, n, mun, taun});
const maxpdf = d3.max(dd, (d) => d.pdf);
```

```js
// Guards against "-0.00" from floating-point noise around zero.
function fmt2(x) {
  return Math.abs(x) < 0.005 ? "0.00" : x.toFixed(2);
}
```

```js
// Prior/posterior predictive of a new X | theta ~ N(theta, sigma^2), theta ~ N(m, t^2)
// is N(m, t^2 + sigma^2) -- the two independent Gaussian variances add.
const priorPredMean = mu0;
const priorPredSd = Math.sqrt(tau0 ** 2 + sigma ** 2);
const postPredMean = mun;
const postPredSd = Math.sqrt(taun ** 2 + sigma ** 2);

const priorPredXlimlow = jStat.normal.inv(0.005, priorPredMean, priorPredSd);
const priorPredXlimhigh = jStat.normal.inv(0.995, priorPredMean, priorPredSd);
const postPredXlimlow = jStat.normal.inv(0.005, postPredMean, postPredSd);
const postPredXlimhigh = jStat.normal.inv(0.995, postPredMean, postPredSd);

const priorPredPdf = d3.range(priorPredXlimlow, priorPredXlimhigh, (priorPredXlimhigh - priorPredXlimlow) / 500)
  .map((x) => ({x, pdf: jStat.normal.pdf(x, priorPredMean, priorPredSd)}));
const postPredPdf = d3.range(postPredXlimlow, postPredXlimhigh, (postPredXlimhigh - postPredXlimlow) / 500)
  .map((x) => ({x, pdf: jStat.normal.pdf(x, postPredMean, postPredSd)}));
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
  Inputs.range([-10, 10], {value: 2, step: 0.1, label: tex`\bar x`}),
  Inputs.range([0.1, 20], {value: 5, step: 0.1, label: tex`\sigma`})
]);
const datasettings = view(dataInput);
```

  </div>
  <div class="card" style="flex: 1; min-width: 0; margin: 0;">
    <b>Prior</b>
    ${priorInput}

```js
const priorInput = Inputs.form([
  Inputs.range([-10, 10], {value: 0, step: 0.1, label: tex`\mu_0`}),
  Inputs.range([0.1, 20], {value: 5, step: 0.1, label: tex`\tau_0`})
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
  ? Inputs.range([Math.min(xlimlow, mun), Math.max(xlimhigh, mun)], {value: Number(mun.toFixed(2)), step: 0.01, label: "plot quantile", format: fmt2})
  : viewMode === "Prior predictive"
  ? Inputs.range([priorPredXlimlow, priorPredXlimhigh], {value: Number(priorPredMean.toFixed(2)), step: 0.01, label: "plot quantile", format: fmt2})
  : Inputs.range([postPredXlimlow, postPredXlimhigh], {value: Number(postPredMean.toFixed(2)), step: 0.01, label: "plot quantile", format: fmt2});
const quantile = view(quantileInput);
```

<div class="quantile-row" style="display: flex; align-items: center; gap: 0.5rem; margin-top: -0.75rem;">
${showQuantileInput}
${quantileInput}
</div>

```js
const xDomain = resolveDomain(frozenState, freezeAxis, [xlimlow, xlimhigh]);
const priorPredXDomain = resolveDomain(frozenPriorPredState, freezeAxis, [priorPredXlimlow, priorPredXlimhigh]);
const postPredXDomain = resolveDomain(frozenPostPredState, freezeAxis, [postPredXlimlow, postPredXlimhigh]);
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
      x: {label: "θ", domain: xDomain},
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
${tex`X_1,\ldots,X_n \mid \theta,\sigma^2 \sim \operatorname{N}(\theta,\sigma^2)`} with ${tex`\sigma^2`} known

**Prior**<br>
${tex`\theta \sim \operatorname{N}(\mu_0,\tau_0^2)`}

**Posterior**<br>
${tex`\theta \mid \boldsymbol{x} \sim \operatorname{N}(\mu_n,\tau_n^2)`}

**Posterior mean**<br>
${tex`\mu_n = w\bar x + (1-w)\mu_0`}

**Posterior variance**<br>
${tex`\tau_n^2 = \left(\dfrac{n}{\sigma^2}+\dfrac{1}{\tau_0^2}\right)^{-1}`}

**Weight on data**<br>
${tex`w = \dfrac{n/\sigma^2}{n/\sigma^2+1/\tau_0^2}`}

**Prior predictive**<br>
${tex`\tilde X \sim \operatorname{N}(\mu_0,\, \tau_0^2+\sigma^2)`}

**Posterior predictive**<br>
${tex`\tilde X \mid \boldsymbol{x} \sim \operatorname{N}(\mu_n,\, \tau_n^2+\sigma^2)`}

</div>

<div class="card">

### Summary

```js
const summaryTable = viewMode === "Parameter posterior"
  ? html`<table>
      <tr><th></th><th>Prior</th><th>Posterior</th></tr>
      <tr><td>Mean</td><td>${mu0.toPrecision(3)}</td><td>${mun.toPrecision(3)}</td></tr>
      <tr><td>Standard deviation</td><td>${tau0.toPrecision(3)}</td><td>${taun.toPrecision(3)}</td></tr>
      <tr><td>Weight w</td><td>—</td><td>${w.toPrecision(3)}</td></tr>
      <tr><td>${tex`P(\theta \le ${fmt2(quantile)})`}</td><td>${jStat.normal.cdf(quantile, mu0, tau0).toPrecision(4)}</td><td>${jStat.normal.cdf(quantile, mun, taun).toPrecision(4)}</td></tr>
    </table>`
  : viewMode === "Prior predictive"
  ? html`<table>
      <tr><th></th><th>Prior predictive</th></tr>
      <tr><td>Mean</td><td>${priorPredMean.toPrecision(3)}</td></tr>
      <tr><td>Standard deviation</td><td>${priorPredSd.toPrecision(3)}</td></tr>
      <tr><td>${tex`P(\tilde X \le ${fmt2(quantile)})`}</td><td>${jStat.normal.cdf(quantile, priorPredMean, priorPredSd).toPrecision(4)}</td></tr>
    </table>`
  : html`<table>
      <tr><th></th><th>Posterior predictive</th></tr>
      <tr><td>Mean</td><td>${postPredMean.toPrecision(3)}</td></tr>
      <tr><td>Standard deviation</td><td>${postPredSd.toPrecision(3)}</td></tr>
      <tr><td>${tex`P(\tilde X \le ${fmt2(quantile)})`}</td><td>${jStat.normal.cdf(quantile, postPredMean, postPredSd).toPrecision(4)}</td></tr>
    </table>`;
display(summaryTable);
```

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/bayes-iid-gaussian-known-var")}

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
