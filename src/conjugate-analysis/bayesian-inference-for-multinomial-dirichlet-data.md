---
title: Multinomial–Dirichlet
toc: false
---

# Bayesian inference for multinomial data

```js
import * as math from "npm:mathjs";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {ternaryDensity, ternaryGrid, themeColor} from "../components/functionLibrary.js";
```

```js
function logBeta(alpha) {
  return alpha.reduce((s, a) => s + math.lgamma(a), 0) - math.lgamma(alpha.reduce((s, a) => s + a, 0));
}
function dirichletPdf(x, alpha) {
  let logp = -logBeta(alpha);
  for (let i = 0; i < x.length; i++) logp += (alpha[i] - 1) * Math.log(x[i]);
  return Math.exp(logp);
}
```

```js
const alpha = [priorsettings[0], priorsettings[1], priorsettings[2]];
const alpha0 = alpha[0] + alpha[1] + alpha[2];
const counts = [datasettings[0], datasettings[1], datasettings[2]];
const n = counts[0] + counts[1] + counts[2];
const alphan = [alpha[0] + counts[0], alpha[1] + counts[1], alpha[2] + counts[2]];
const alphan0 = alphan[0] + alphan[1] + alphan[2];
// A tiny epsilon keeps the shape parameters positive when a count is 0,
// giving a proper (if slightly smoothed) density for the normalized likelihood.
const alphalike = [counts[0] + 0.001, counts[1] + 0.001, counts[2] + 0.001];
```

```js
const resolution = 40;
const priorDensity = ternaryGrid(resolution, (x) => dirichletPdf(x, alpha));
const likeDensity = ternaryGrid(resolution, (x) => dirichletPdf(x, alphalike));
const postDensity = ternaryGrid(resolution, (x) => dirichletPdf(x, alphan));
```

```js
void dark; // re-resolve these on every light/dark toggle, not just on first render
const priorColor = themeColor("--mv-color-1", "#c0a34d");
const likeColor = themeColor("--mv-color-0", "#6C8EBF");
const postColor = themeColor("--mv-color-2", "#780000");
```

```js
const thetaLabelNodes = [() => tex`\theta_1`, () => tex`\theta_2`, () => tex`\theta_3`];
```

```js
const headingStyle = "font-size: 15px; font-weight: 500; margin: 0; text-align: center;";
const priorHeading = html`<h2 style="${headingStyle} color: ${mvcolors[1]};">Prior</h2>`;
const likeHeading = html`<h2 style="${headingStyle} color: ${mvcolors[0]};">Likelihood (normalized)</h2>`;
const postHeading = html`<h2 style="${headingStyle} color: ${mvcolors[2]};">Posterior</h2>`;
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div style="display: flex; gap: 1rem;">
  <div class="card" style="flex: 1; min-width: 0; margin: 0;">
    <b>Data</b>
    ${dataInput}

```js
const dataInput = Inputs.form([
  Inputs.range([0, 30], {value: 6, step: 1, label: tex`y_1`}),
  Inputs.range([0, 30], {value: 3, step: 1, label: tex`y_2`}),
  Inputs.range([0, 30], {value: 2, step: 1, label: tex`y_3`})
]);
const datasettings = view(dataInput);
```

  </div>
  <div class="card" style="flex: 1; min-width: 0; margin: 0;">
    <b>Prior</b>
    ${priorInput}

```js
const priorInput = Inputs.form([
  Inputs.range([0.01, 15], {value: 1.5, step: 0.01, label: tex`\alpha_1`}),
  Inputs.range([0.01, 15], {value: 1.5, step: 0.01, label: tex`\alpha_2`}),
  Inputs.range([0.01, 15], {value: 1.5, step: 0.01, label: tex`\alpha_3`})
]);
const priorsettings = view(priorInput);
```

  </div>
</div>

<div class="card">

<div style="display: flex; gap: 1rem;">
  <div style="flex: 1;">
  ${priorHeading}
  ${ternaryDensity(priorDensity, resolution, {size: Math.min(280, width), margin: {left: 40, top: 40, right: 40, bottom: 40}, color: priorColor, labelNodes: thetaLabelNodes, labelOffset: 2.6, dark})}
  </div>
  <div style="flex: 1;">
  ${likeHeading}
  ${ternaryDensity(likeDensity, resolution, {size: Math.min(280, width), margin: {left: 40, top: 40, right: 40, bottom: 40}, color: likeColor, labelNodes: thetaLabelNodes, labelOffset: 2.6, dark})}
  </div>
  <div style="flex: 1;">
  ${postHeading}
  ${ternaryDensity(postDensity, resolution, {size: Math.min(280, width), margin: {left: 40, top: 40, right: 40, bottom: 40}, color: postColor, labelNodes: thetaLabelNodes, labelOffset: 2.6, dark})}
  </div>
</div>

</div>

</div>

<div class="dist-side">

<div class="card">

**Model**<br>
${tex`\boldsymbol{y} \mid \boldsymbol{\theta} \sim \operatorname{Multinomial}(n,\theta_1,\theta_2,\theta_3)`}

**Prior**<br>
${tex`\boldsymbol{\theta} \sim \operatorname{Dirichlet}(\alpha_1,\alpha_2,\alpha_3)`}

**Posterior**<br>
${tex`\boldsymbol{\theta} \mid \boldsymbol{y} \sim \operatorname{Dirichlet}(\alpha_1+y_1,\,\alpha_2+y_2,\,\alpha_3+y_3)`}

</div>

<div class="card">

### Summary

|  | Prior mean | Posterior mean |
|---|---|---|
| ${tex`\theta_1`} | ${(alpha[0] / alpha0).toPrecision(3)} | ${(alphan[0] / alphan0).toPrecision(3)} |
| ${tex`\theta_2`} | ${(alpha[1] / alpha0).toPrecision(3)} | ${(alphan[1] / alphan0).toPrecision(3)} |
| ${tex`\theta_3`} | ${(alpha[2] / alpha0).toPrecision(3)} | ${(alphan[2] / alphan0).toPrecision(3)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/multinomial-dirichlet")}

</div>

</div>

<style>

.dist-main .card h2 ~ svg {
  margin-top: 0;
}

</style>
