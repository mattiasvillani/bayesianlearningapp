---
title: Poisson-Gamma
toc: false
---

# Poisson-Gamma distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0.1, 20], {value: 2, step: 0.1, label: "α"}),
  Inputs.range([0.1, 20], {value: 2, step: 0.1, label: "β"}),
  Inputs.range([0.1, 20], {value: 2, step: 0.1, label: "ν"}),
  Inputs.range([0, 20], {value: 1, step: 1, label: "quantile"})
]));
```

```js
function poissongammapdf(x, alpha, beta, nu) {
  return ((beta ** alpha) / jStat.gammafn(alpha)) * (jStat.gammafn(alpha + x) / jStat.factorial(x)) * ((nu ** x) / ((beta + nu) ** (alpha + x)));
}

const alpha = params[0], beta = params[1], nu = params[2], quantile = params[3];
const mean = nu * alpha / beta;
const variance = (nu * alpha / beta) * (1 + nu / beta);
const pdfdata = d3.range(0, Math.floor(mean + 5 * Math.sqrt(variance)) + 1, 1)
  .map((x) => ({x, pdf: poissongammapdf(x, alpha, beta, nu)}));
const poisgamcdf = d3.sum(pdfdata.filter((d) => d.x <= quantile).map((d) => d.pdf));
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
P(x) &= \frac{\beta^\alpha}{\Gamma(\alpha)}\frac{\Gamma(\alpha+x)}{x!}\frac{\nu^x}{(\beta+\nu)^{\alpha+x}}, \ x = 0,1,2,\ldots \\[0.4em]
\mathbb{E}(X) &= \nu\frac{\alpha}{\beta} \\[0.4em]
\mathbb{V}(X) &= \nu\frac{\alpha}{\beta}\Big(1+\frac{\nu}{\beta}\Big)
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile})`} | ${poisgamcdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/poisson-gamma-distribution")}

</div>

</div>
