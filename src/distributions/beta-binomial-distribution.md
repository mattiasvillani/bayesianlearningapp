---
title: Beta-Binomial
toc: false
---

# Beta-Binomial distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
function betabinomPDF(x, n, alpha, beta) {
  return jStat.combination(n, x) * jStat.betafn(x + alpha, n - x + beta) / jStat.betafn(alpha, beta);
}

const n = params[0], alpha = params[1], beta = params[2];
const pdfdata = d3.range(0, n + 1, 1).map((x) => ({x, pdf: betabinomPDF(x, n, alpha, beta)}));
const mean = n * alpha / (alpha + beta);
const variance = n * alpha * beta * (alpha + beta + n) / ((alpha + beta) ** 2 * (alpha + beta + 1));
const cdf = d3.sum(pdfdata.filter((d) => d.x <= quantile).map((d) => d.pdf));
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([1, 200], {value: 10, step: 1, label: "n"}),
  Inputs.range([Number.EPSILON, 50], {value: 2, step: 0.1, label: "α"}),
  Inputs.range([Number.EPSILON, 50], {value: 2, step: 0.1, label: "β"})
]));
```

```js
const quantile = view(Inputs.range([1, params[0]], {value: 3, step: 1, label: "quantile"}));
```

</div>

<div class="card">

```js
Plot.plot({
  x: {label: "x", axis: true, domain: d3.range(0, n + 1, 1)},
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

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
P(x) &= \binom{n}{x}\frac{\Beta(x+\alpha, n-x+\beta)}{\Beta(\alpha,\beta)}, \ x = 0,1,\ldots,n \\[0.4em]
\mathbb{E}(X) &= n\frac{\alpha}{\alpha+\beta} \\[0.4em]
\mathbb{V}(X) &= \frac{n\alpha\beta(\alpha+\beta+n)}{(\alpha+\beta)^2(\alpha+\beta+1)}
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

${notebookLink("https://observablehq.com/@mattiasvillani/beta-binomial-distribution")}

</div>

</div>
