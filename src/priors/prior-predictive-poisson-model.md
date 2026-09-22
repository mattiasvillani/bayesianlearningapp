---
title: Prior predictive Poisson
toc: false
---

# Prior predictive Poisson

_The **prior predictive distribution** ${tex`p(x)=\int p(x\vert\theta)p(\theta)\,\mathrm{d}\theta`} describes the distribution of the data implied by a model, averaged over the parameter's prior — useful for setting prior hyperparameters from what you believe about the data._

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const alpha = params[0];
const beta = params[1];
const quantile = params[2];
```

```js
const r = alpha;
const p = beta / (1 + beta);
const mean = (r * (1 - p)) / p;
const variance = (r * (1 - p)) / p ** 2;
```

```js
const negbinpdf = d3.range(0, Math.floor(mean + 5 * Math.sqrt(variance)) + 1, 1)
  .map((x) => ({x, pdf: jStat.negbin.pdf(x, r, p)}));
const negbincdf = jStat.negbin.cdf(quantile, r, p);
```

```js
const priorXMax = jStat.gamma.inv(0.999, alpha, 1 / beta);
const priorpdf = d3.range(0, priorXMax, priorXMax / 500)
  .map((x) => ({x, pdf: jStat.gamma.pdf(x, alpha, 1 / beta)}));
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

<b>Settings</b>

```js
const params = view(Inputs.form([
  Inputs.range([0.01, 5], {value: 2, step: 0.01, label: "α"}),
  Inputs.range([0.05, 5], {value: 0.5, step: 0.01, label: "β"}),
  Inputs.range([0, 25], {value: 15, step: 1, label: "prior predictive quantile"})
]));
```

</div>

<div class="card">

<div style="display: flex; gap: 1rem;">
  <div style="flex: 1;">
  ${Plot.plot({
    width: Math.min(440, width),
    height: 320,
    style: {fontSize: "13px"},
    title: html`Prior predictive distribution for the data ${tex`X`}`,
    x: {label: "x"},
    y: {label: "p(x)"},
    marks: [
      Plot.ruleY([0]),
      Plot.barY(negbinpdf, {
        x: "x", y: "pdf", fill: mvcolors[0], fillOpacity: 0.3, strokeWidth: 0,
        title: (d) => `P(X=${d.x}) = ${d.pdf.toPrecision(4)}`
      }),
      Plot.barY(negbinpdf, {
        filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0],
        title: (d) => `P(X=${d.x}) = ${d.pdf.toPrecision(4)}`
      })
    ]
  })}
  </div>
  <div style="flex: 1;">
  ${Plot.plot({
    width: Math.min(440, width),
    height: 320,
    style: {fontSize: "13px"},
    title: html`Prior distribution for the parameter ${tex`\theta`}`,
    x: {label: "θ"},
    y: {label: "p(θ)"},
    marks: [
      Plot.ruleY([0]),
      Plot.ruleX([0]),
      Plot.line(priorpdf, {x: "x", y: "pdf", stroke: mvcolors[1], strokeWidth: 3})
    ]
  })}
  </div>
</div>

</div>

</div>

<div class="dist-side">

<div class="card">

**Model**
${tex.block`X_1,\ldots,X_n \vert \theta \overset{\mathrm{iid}}{\sim} \mathrm{Poisson}(\theta)`}
**Prior**
${tex.block`\theta \sim \mathrm{Gamma}(\alpha,\beta)`}
**Prior predictive**
${tex.block`X \sim \mathrm{NegBin}\Big(\alpha,\frac{\beta}{\beta+1}\Big)`}

</div>

<div class="card">

### Numerical properties for the predictive distribution

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile})`} | ${negbincdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/prior_pred_poismodel")}

</div>

</div>

<style>

.dist-main figure {
  margin: 0;
}

</style>
