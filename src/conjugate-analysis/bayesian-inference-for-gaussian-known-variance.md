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
const frozenState = createFreezeState();
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

<div class="card" style="padding-top: 0.25rem;">

```js
const freezeInput = Inputs.toggle({label: "Freeze x-axis", value: true});
const freezeAxis = view(freezeInput);
```

```js
const xDomain = resolveDomain(frozenState, freezeAxis, [xlimlow, xlimhigh]);
```

```js
Plot.plot({
  width: Math.min(720, width),
  color: {
    legend: true,
    domain: ["prior", "likelihood", "posterior"],
    range: [mvcolors[1], mvcolors[0], mvcolors[2]]
  },
  x: {label: "θ", domain: xDomain},
  y: {axis: false, domain: [0, 1.02 * maxpdf]},
  marks: [
    Plot.ruleY([0]),
    Plot.line(dd, {x: "theta", y: "pdf", stroke: "type", strokeWidth: 2.5})
  ]
})
```

<div style="margin-top: -0.75rem; font-size: 13px;">${freezeInput}</div>

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

**Posterior mean**<br>
${tex`\mu_n = w\bar x + (1-w)\mu_0`}

**Posterior variance**<br>
${tex`\tau_n^2 = \left(\dfrac{n}{\sigma^2}+\dfrac{1}{\tau_0^2}\right)^{-1}`}

**Weight on data**<br>
${tex`w = \dfrac{n/\sigma^2}{n/\sigma^2+1/\tau_0^2}`}

</div>

<div class="card">

### Summary

|  | Prior | Posterior |
|---|---|---|
| Mean | ${mu0.toPrecision(3)} | ${mun.toPrecision(3)} |
| Standard deviation | ${tau0.toPrecision(3)} | ${taun.toPrecision(3)} |
| Weight w | — | ${w.toPrecision(3)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/bayes-iid-gaussian-known-var")}

</div>

</div>
