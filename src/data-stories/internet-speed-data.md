---
title: Internet speed data
toc: false
---

# Bayesian inference for Gaussian iid data with known variance

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const data = [15.77, 20.5, 8.26, 14.37, 21.0];
const datasel = data.slice(0, n);
const xbar = d3.mean(datasel);
const taun = Math.sqrt(1 / (n / sigma ** 2 + 1 / tau0 ** 2));
const w = (n / sigma ** 2) / (n / sigma ** 2 + 1 / tau0 ** 2);
const mun = w * xbar + (1 - w) * mu0;
const datastring = datasel.join(", ");
```

```js
function densdata({n, sigma, mu0, tau0, xbar, mun, taun}) {
  const thetas = d3.range(0, 50, 0.1);
  const priorpdf = thetas.map((theta) => ({theta, pdf: jStat.normal.pdf(theta, mu0, tau0), type: "prior"}));
  const likepdf = thetas.map((theta) => ({theta, pdf: jStat.normal.pdf(theta, xbar, sigma / Math.sqrt(n)), type: "likelihood"}));
  const postpdf = thetas.map((theta) => ({theta, pdf: jStat.normal.pdf(theta, mun, taun), type: "posterior"}));
  return priorpdf.concat(likepdf, postpdf);
}

const dd = densdata({n, sigma, mu0, tau0, xbar, mun, taun});
const maxpdf = d3.max(dd, (d) => d.pdf);
```

```js
function preddata({mun, taun, sigma}) {
  const xtilde = d3.range(0, 50, 0.1);
  const predsd = Math.sqrt(taun ** 2 + sigma ** 2);
  return xtilde.map((x) => ({xtilde: x, pdf: jStat.normal.pdf(x, mun, predsd)}));
}

const predd = preddata({mun, taun, sigma});
const maxpredpdf = d3.max(predd, (d) => d.pdf);
```

```js
function seqdensdata({data, sigma, mu0, tau0}) {
  const thetas = d3.range(0, 50, 0.1);
  let pdfs = thetas.map((theta) => ({theta, pdf: jStat.normal.pdf(theta, mu0, tau0), nobs: "n=0"}));
  for (let i = 1; i <= 5; i++) {
    const datasel_i = data.slice(0, i);
    const xbar_i = d3.mean(datasel_i);
    const taun_i = Math.sqrt(1 / (i / sigma ** 2 + 1 / tau0 ** 2));
    const w_i = (i / sigma ** 2) / (i / sigma ** 2 + 1 / tau0 ** 2);
    const mun_i = w_i * xbar_i + (1 - w_i) * mu0;
    pdfs = pdfs.concat(thetas.map((theta) => ({theta, pdf: jStat.normal.pdf(theta, mun_i, taun_i), nobs: "n=" + i})));
  }
  return pdfs;
}

const seqdd = seqdensdata({data, sigma, mu0, tau0});
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div style="display: flex; gap: 1rem;">
  <div class="card" style="flex: 1; min-width: 0; margin: 0;">
    <b>Data</b>
    ${dataInput}
    <div style="margin-top: 0.5rem; font-size: 13px; color: var(--theme-foreground-muted);">
      Observations used: x = (${datastring})
    </div>

```js
const dataInput = Inputs.form([
  Inputs.range([1, 5], {value: 5, step: 1, label: tex`n`}),
  Inputs.range([1, 20], {value: 5, step: 1, label: tex`\sigma`})
]);
const datasettings = view(dataInput);
```

  </div>
  <div class="card" style="flex: 1; min-width: 0; margin: 0;">
    <b>Prior</b>
    ${priorInput}

```js
const priorInput = Inputs.form([
  Inputs.range([0, 100], {value: 20, step: 1, label: tex`\mu_0`}),
  Inputs.range([0.5, 100], {value: 5, step: 0.5, label: tex`\tau_0`})
]);
const priorsettings = view(priorInput);
```

  </div>
</div>

```js
const n = datasettings[0];
const sigma = datasettings[1];
const mu0 = priorsettings[0];
const tau0 = priorsettings[1];
```

<div class="card">

```js
Plot.plot({
  width: Math.min(720, width),
  color: {
    legend: true,
    domain: ["prior", "likelihood", "posterior"],
    range: [mvcolors[1], mvcolors[0], mvcolors[2]]
  },
  x: {label: "θ"},
  y: {axis: false, domain: [0, 1.02 * maxpdf]},
  marks: [
    Plot.ruleY([0]),
    Plot.line(dd, {x: "theta", y: "pdf", stroke: "type", strokeWidth: 2.5})
  ]
})
```

</div>

<div class="card">

### Predictive density

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x̃"},
  y: {axis: false, domain: [0, 1.03 * maxpredpdf]},
  marks: [
    Plot.ruleY([0]),
    Plot.line(predd, {x: "xtilde", y: "pdf", stroke: mvcolors[3], strokeWidth: 2.5})
  ]
})
```

</div>

<div class="card">

### Sequential updating

```js
Plot.plot({
  width: Math.min(720, width),
  color: {
    legend: "ramp",
    label: "number of observations",
    type: "ordinal",
    domain: ["n=0", "n=1", "n=2", "n=3", "n=4", "n=5"],
    range: ["#D6B656", "#D0A255", "#CA8F54", "#C47B52", "#BE6851", "#B85450"]
  },
  x: {label: "θ"},
  y: {axis: false},
  marks: [
    Plot.ruleY([0]),
    Plot.line(seqdd, {x: "theta", y: "pdf", stroke: "nobs", strokeWidth: 2.5})
  ]
})
```

</div>

</div>

<div class="dist-side">

<div class="card">

**Model**<br>
${tex`X_1,\ldots,X_n \mid \theta,\sigma^2 \sim \operatorname{N}(\theta,\sigma^2)`} with ${tex`\sigma^2`} known

**Prior**<br>
${tex`\theta \sim \operatorname{N}(\mu_0,\tau_0^2)`}

**Posterior**<br>
${tex`\theta \mid \boldsymbol{x} \sim \operatorname{N}(\mu_n,\tau_n^2)`}

</div>

<div class="card">

### Prior and Posterior moments

|  | Prior | Posterior |
|---|---|---|
| Mean | ${mu0.toPrecision(3)} | ${mun.toPrecision(3)} |
| St. dev | ${tau0.toPrecision(3)} | ${taun.toPrecision(3)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/bayes-iid-gaussian-known-var")}

</div>

</div>
