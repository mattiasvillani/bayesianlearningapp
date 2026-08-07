---
title: Binomial
toc: false
---

# Binomial distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([1, 200], {value: 10, step: 1, label: "n"}),
  Inputs.range([0, 1], {value: 0.5, step: 0.01, label: "p"})
]));
```

```js
const quantile = view(Inputs.range([1, params[0]], {value: 3, step: 1, label: "quantile"}));
```

```js
const approx = view(Inputs.toggle({label: "show normal approximation", value: false}));
```

```js
const n = params[0], p = params[1];
const mean = n * p, variance = n * p * (1 - p);
const xgrid = d3.range(0, n + 1, 1);
const binompdf = xgrid.map((x) => ({x, pdf: jStat.binomial.pdf(x, n, p)}));
const normalapproxpdf = xgrid.map((x) => ({x, pdf: jStat.normal.pdf(x, mean, Math.sqrt(variance))}));
const binomcdf = jStat.binomial.cdf(quantile, n, p);
```

```js
Plot.plot({
  x: {label: "x", axis: true, domain: xgrid},
  y: {label: "f(x)", axis: true},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(binompdf, {
      x: "x", y: "pdf", fill: mvcolors[0], fillOpacity: 0.3, strokeWidth: 0,
      title: (d) => `P(X=${d.x}) = ${d.pdf.toPrecision(4)}`
    }),
    Plot.barY(binompdf, {
      filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0],
      title: (d) => `P(X=${d.x}) = ${d.pdf.toPrecision(4)}`
    }),
    Plot.line(normalapproxpdf, {filter: () => approx, x: "x", y: "pdf", stroke: mvcolors[1], strokeWidth: 2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
P(x) &= \binom{n}{x} p^x(1-p)^{n-x}, \ x = 0,1,\ldots,n \\[0.4em]
\mathbb{E}(X) &= np \\[0.4em]
\mathbb{V}(X) &= np(1-p)
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile})`} | ${binomcdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/binomial-distribution")}

</div>

</div>
