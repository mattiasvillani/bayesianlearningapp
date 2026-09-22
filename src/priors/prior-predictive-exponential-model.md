---
title: Prior predictive Exponential
toc: false
---

# Prior predictive Exponential

_The **prior predictive distribution** ${tex`p(x)=\int p(x\vert\lambda)p(\lambda)\,\mathrm{d}\lambda`} describes the distribution of the data implied by a model, averaged over the parameter's prior — useful for setting prior hyperparameters from what you believe about the data._

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
```

```js
const alpha = params[0];
const beta = params[1];
const quantile = params[2];
```

```js
// Prior predictive of X | lambda ~ Expon(lambda), lambda ~ Gamma(alpha, beta)
// is Lomax(alpha, beta): f(x) = alpha * beta^alpha / (x + beta)^(alpha + 1).
function lomaxPdf(x, a, b) {
  return (a / b) * (1 + x / b) ** (-(a + 1));
}
function lomaxCdf(x, a, b) {
  return 1 - (1 + x / b) ** (-a);
}
function lomaxInv(prob, a, b) {
  return b * ((1 - prob) ** (-1 / a) - 1);
}

const mean = alpha > 1 ? beta / (alpha - 1) : Infinity;
const variance = alpha > 2 ? (alpha * beta ** 2) / ((alpha - 1) ** 2 * (alpha - 2)) : Infinity;
```

```js
const predXMax = lomaxInv(0.99, alpha, beta);
const lomaxpdf = d3.range(0, predXMax, predXMax / 500).map((x) => ({x, pdf: lomaxPdf(x, alpha, beta)}));
const predcdf = lomaxCdf(quantile, alpha, beta);
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
  Inputs.range([0.1, 5], {value: 1.5, step: 0.01, label: "α"}),
  Inputs.range([0.05, 5], {value: 1, step: 0.01, label: "β"}),
  Inputs.range([0, 10], {value: 2, step: 0.01, label: "prior predictive quantile"})
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
      Plot.ruleX([0]),
      Plot.line(lomaxpdf, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
      Plot.areaY(lomaxpdf, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.3})
    ]
  })}
  </div>
  <div style="flex: 1;">
  ${Plot.plot({
    width: Math.min(440, width),
    height: 320,
    style: {fontSize: "13px"},
    title: html`Prior distribution for the parameter ${tex`\lambda`}`,
    x: {label: "λ"},
    y: {label: "p(λ)"},
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
${tex.block`X_1,\ldots,X_n \mid \lambda \sim \operatorname{Expon}(\lambda)`}
**Prior**
${tex.block`\lambda \sim \operatorname{Gamma}(\alpha,\beta)`}
**Prior predictive**
${tex.block`X \sim \mathrm{Lomax}(\alpha,\beta)`}
${tex.block`f(x) = \frac{\alpha\beta^\alpha}{(x+\beta)^{\alpha+1}}, \quad x\ge 0`}

</div>

<div class="card">

### Numerical properties for the predictive distribution

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${Number.isFinite(mean) ? mean.toPrecision(3) : "∞"} |
| ${tex`\mathbb{S}(X)`} | ${Number.isFinite(variance) ? Math.sqrt(variance).toPrecision(3) : "∞"} |
| ${tex`P(X \le ${quantile})`} | ${predcdf.toPrecision(4)} |

</div>

</div>

</div>

<style>

.dist-main figure {
  margin: 0;
}

</style>
