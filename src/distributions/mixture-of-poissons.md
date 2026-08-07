---
title: Mixture of Poissons
toc: false
---

# Mixture of Poissons

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const quantile = quantform[0];
const showquantile = quantform[1];

const omegas = new Array(K);
const mus = new Array(K);
if (K === 1) {
  omegas[0] = 1;
  mus[0] = params[0];
} else {
  for (let k = 0; k < K - 1; k++) {
    omegas[k] = params[k];
    mus[k] = params[(K - 1) + k];
  }
  omegas[K - 1] = Math.max(0, 1 - d3.sum(omegas.slice(0, K - 1)));
  mus[K - 1] = params[(K - 2) + K];
}

const xgrid = d3.range(0, 16, 1);
let pdfs = [];
let mixturepdf = new Array(xgrid.length).fill(0);
for (let k = 0; k < K; k++) {
  const comp = xgrid.map((x) => ({x, dens: jStat.poisson.pdf(x, mus[k]), comp: `comp ${k + 1}`}));
  pdfs = pdfs.concat(comp);
  mixturepdf = mixturepdf.map((v, idx) => v + omegas[k] * comp[idx].dens);
}
pdfs = pdfs.concat(xgrid.map((x, idx) => ({x, dens: mixturepdf[idx], comp: "mixture"})));

const mean = d3.sum(mus.map((mu, k) => mu * omegas[k]));
const variance = d3.sum(mus.map((mu, k) => omegas[k] * mu * (1 + mu))) - mean ** 2;
const mixturecdf = d3.sum(mus.map((mu, k) => omegas[k] * jStat.poisson.cdf(quantile, mu)));

const legendarray = ["mixture"].concat(d3.range(K).map((k) => `comp ${k + 1}`));
const colorrange = [mvcolors[0], mvcolors[1], mvcolors[3], mvcolors[4], mvcolors[6]].slice(0, K + 1);
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const K = view(Inputs.range([1, 4], {value: 2, step: 1, label: "number of components, K"}));
```

```js
const params = view(
  K === 1
    ? Inputs.form([
        Inputs.range([0.01, 5], {value: 1, step: 0.01, label: "λ1"})
      ])
    : K === 2
    ? Inputs.form([
        Inputs.range([0, 1], {value: 0.5, step: 0.01, label: "ω1"}),
        Inputs.range([0.01, 5], {value: 1, step: 0.01, label: "λ1"}),
        Inputs.range([0.01, 5], {value: 3, step: 0.01, label: "λ2"})
      ])
    : K === 3
    ? Inputs.form([
        Inputs.range([0, 1], {value: 1 / 3, step: 0.01, label: "ω1"}),
        Inputs.range([0, 1], {value: 1 / 3, step: 0.01, label: "ω2"}),
        Inputs.range([0.01, 5], {value: 1, step: 0.01, label: "λ1"}),
        Inputs.range([0.01, 5], {value: 2, step: 0.01, label: "λ2"}),
        Inputs.range([0.01, 5], {value: 4, step: 0.01, label: "λ3"})
      ])
    : Inputs.form([
        Inputs.range([0, 1], {value: 0.25, step: 0.01, label: "ω1"}),
        Inputs.range([0, 1], {value: 0.25, step: 0.01, label: "ω2"}),
        Inputs.range([0, 1], {value: 0.25, step: 0.01, label: "ω3"}),
        Inputs.range([0.01, 5], {value: 1, step: 0.01, label: "λ1"}),
        Inputs.range([0.01, 5], {value: 2, step: 0.01, label: "λ2"}),
        Inputs.range([0.01, 5], {value: 3, step: 0.01, label: "λ3"}),
        Inputs.range([0.01, 5], {value: 4, step: 0.01, label: "λ4"})
      ])
);
```

```js
const quantform = view(Inputs.form([
  Inputs.range([0, 15], {value: 1, step: 1, label: "quantile"}),
  Inputs.toggle({label: "show quantile in plot", value: false})
]));
```

</div>

<div class="card">

```js
Plot.plot({
  color: {legend: true, domain: legendarray, range: colorrange},
  x: {label: "x", axis: true},
  y: {label: "density", axis: true},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.areaY(pdfs, {filter: (d) => d.comp === "mixture", x: "x", y: "dens", fill: "comp", opacity: 0.15}),
    Plot.areaY(pdfs, {filter: (d) => showquantile && d.comp === "mixture" && d.x <= quantile, x: "x", y: "dens", fill: "comp", opacity: 0.5}),
    Plot.line(pdfs, {filter: (d) => d.comp === "mixture", x: "x", y: "dens", stroke: "comp", strokeWidth: 3, marker: "circle"}),
    Plot.line(pdfs, {filter: (d) => d.comp !== "mixture", x: "x", y: "dens", stroke: "comp", strokeWidth: 1.5, opacity: 0.6, marker: "circle"})
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
P(x) &= \sum_{k=1}^K \omega_k \, \frac{\lambda_k^x e^{-\lambda_k}}{x!}, \ x = 0,1,2,\ldots \\[0.4em]
\mathbb{E}(X) &= \sum_{k=1}^K \omega_k \lambda_k \\[0.4em]
\mathbb{V}(X) &= \sum_{k=1}^K \omega_k \lambda_k(1+\lambda_k) - \Big(\sum_{k=1}^K \omega_k \lambda_k\Big)^2
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile})`} | ${mixturecdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/mixture-of-poissons")}

</div>

</div>
