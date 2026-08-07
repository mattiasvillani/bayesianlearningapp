---
title: Normal Mixture
toc: false
---

# Mixture of Normals distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const omegasRaw = d3.range(K - 1).map((k) => params[k]);
const mus = d3.range(K).map((k) => params[(K - 1) + k]);
const sigmas = d3.range(K).map((k) => params[(K - 1) + K + k]);
const omegaLast = Math.max(0, 1 - d3.sum(omegasRaw));
const omegas = omegasRaw.concat([omegaLast]);

const componentColors = [mvcolors[1], mvcolors[3], mvcolors[4], mvcolors[5]];

const xgrid = d3.range(-10, 10, 0.02);
const components = d3.range(K).map((k) => xgrid.map((x) => ({x, dens: jStat.normal.pdf(x, mus[k], sigmas[k])})));
const mixture = xgrid.map((x, i) => ({
  x,
  dens: d3.sum(d3.range(K).map((k) => omegas[k] * components[k][i].dens))
}));

const mixturecdf = d3.sum(d3.range(K).map((k) => omegas[k] * jStat.normal.cdf(quantile, mus[k], sigmas[k])));
const mixMean = d3.sum(d3.range(K).map((k) => omegas[k] * mus[k]));
const mixVar = d3.sum(d3.range(K).map((k) => omegas[k] * (sigmas[k] ** 2 + mus[k] ** 2))) - mixMean ** 2;
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const K = view(Inputs.range([1, 4], {value: 2, step: 1, label: "number of components, K"}));
```

```js
const params = view(
  K === 1 ? Inputs.form([
    Inputs.range([-5, 5], {value: 0, step: 0.01, label: "μ₁"}),
    Inputs.range([0, 5], {value: 1, step: 0.01, label: "σ₁"})
  ]) :
  K === 2 ? Inputs.form([
    Inputs.range([0, 1], {value: 0.5, step: 0.01, label: "ω₁"}),
    Inputs.range([-5, 5], {value: 0, step: 0.01, label: "μ₁"}),
    Inputs.range([-5, 5], {value: 3, step: 0.01, label: "μ₂"}),
    Inputs.range([0, 5], {value: 1, step: 0.01, label: "σ₁"}),
    Inputs.range([0, 5], {value: 2, step: 0.01, label: "σ₂"})
  ]) :
  K === 3 ? Inputs.form([
    Inputs.range([0, 1], {value: 1 / 3, step: 0.01, label: "ω₁"}),
    Inputs.range([0, 1], {value: 1 / 3, step: 0.01, label: "ω₂"}),
    Inputs.range([-5, 5], {value: 0, step: 0.01, label: "μ₁"}),
    Inputs.range([-5, 5], {value: 1, step: 0.01, label: "μ₂"}),
    Inputs.range([-5, 5], {value: 4, step: 0.01, label: "μ₃"}),
    Inputs.range([0, 5], {value: 1, step: 0.01, label: "σ₁"}),
    Inputs.range([0, 5], {value: 2, step: 0.01, label: "σ₂"}),
    Inputs.range([0, 5], {value: 1, step: 0.01, label: "σ₃"})
  ]) :
  Inputs.form([
    Inputs.range([0, 1], {value: 0.25, step: 0.01, label: "ω₁"}),
    Inputs.range([0, 1], {value: 0.25, step: 0.01, label: "ω₂"}),
    Inputs.range([0, 1], {value: 0.25, step: 0.01, label: "ω₃"}),
    Inputs.range([-5, 5], {value: 0, step: 0.01, label: "μ₁"}),
    Inputs.range([-5, 5], {value: 1, step: 0.01, label: "μ₂"}),
    Inputs.range([-5, 5], {value: 2, step: 0.01, label: "μ₃"}),
    Inputs.range([-5, 5], {value: 3, step: 0.01, label: "μ₄"}),
    Inputs.range([0, 5], {value: 1, step: 0.01, label: "σ₁"}),
    Inputs.range([0, 5], {value: 2, step: 0.01, label: "σ₂"}),
    Inputs.range([0, 5], {value: 3, step: 0.01, label: "σ₃"}),
    Inputs.range([0, 5], {value: 4, step: 0.01, label: "σ₄"})
  ])
);
```

```js
const quantile = view(Inputs.range([-10, 10], {value: -4, step: 0.1, label: "quantile"}));
```

</div>

<div class="card">

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true},
  y: {label: "density", axis: false},
  marks: [
    Plot.ruleY([0]),
    ...components.map((comp, k) => Plot.line(comp, {x: "x", y: "dens", stroke: componentColors[k], strokeWidth: 1.5, opacity: 0.6})),
    Plot.areaY(mixture, {filter: (d) => d.x <= quantile, x: "x", y: "dens", fill: mvcolors[0], opacity: 0.2}),
    Plot.line(mixture, {x: "x", y: "dens", stroke: mvcolors[0], strokeWidth: 3})
  ]
})
```

</div>

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \sum_{k=1}^K \omega_k \, N(x \mid \mu_k, \sigma_k) \\[0.4em]
\mathbb{E}(X) &= \sum_{k=1}^K \omega_k \mu_k \\[0.4em]
\mathbb{V}(X) &= \sum_{k=1}^K \omega_k \big(\sigma_k^2 + \mu_k^2\big) - \mathbb{E}(X)^2
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mixMean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(mixVar).toPrecision(3)} |
| ${tex`P(X \le ${quantile.toFixed(2)})`} | ${mixturecdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/normal-mixture")}

</div>

</div>
