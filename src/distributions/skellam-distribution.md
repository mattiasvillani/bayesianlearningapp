---
title: Skellam
toc: false
---

# Skellam distribution

```js
import bessel from "npm:bessel";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0.01, 5], {value: 2, step: 0.1, label: "μ1"}),
  Inputs.range([0.01, 5], {value: 1, step: 0.1, label: "μ2"}),
  Inputs.range([-10, 10], {value: -2, step: 1, label: "quantile"})
]));
```

```js
function skellampdf(x, mu1, mu2) {
  return Math.exp(-(mu1 + mu2)) * (mu1 / mu2) ** (x / 2) * bessel.besseli(2 * Math.sqrt(mu1 * mu2), Math.abs(x));
}

const mu1 = params[0], mu2 = params[1], quantile = params[2];
const mean = mu1 - mu2;
const variance = mu1 + mu2;
const pdfdata = d3.range(Math.floor(mean - 6 * Math.sqrt(variance)), Math.floor(mean + 6 * Math.sqrt(variance)) + 1, 1)
  .map((x) => ({x, pdf: skellampdf(x, mu1, mu2)}));
const cdf = d3.sum(pdfdata.filter((d) => d.x <= quantile).map((d) => d.pdf));
```

```js
Plot.plot({
  x: {label: "x", axis: true},
  y: {label: "f(x)", axis: true},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(pdfdata, {
      x: "x", y: "pdf", fill: mvcolors[0], fillOpacity: 0.3, strokeWidth: 0,
      title: (d) => `P(X=${d.x}) = ${d.pdf.toPrecision(4)}`
    }),
    Plot.barY(pdfdata, {
      filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0],
      title: (d) => `P(X=${d.x}) = ${d.pdf.toPrecision(4)}`
    })
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
P(x) &= e^{-(\mu_1+\mu_2)}\Big(\frac{\mu_1}{\mu_2}\Big)^{x/2} I_{|x|}(2\sqrt{\mu_1\mu_2}), \ x = \ldots,-1,0,1,\ldots \\[0.4em]
\mathbb{E}(X) &= \mu_1-\mu_2 \\[0.4em]
\mathbb{V}(X) &= \mu_1+\mu_2
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile})`} | ${cdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/skellam-distribution")}

</div>

</div>
