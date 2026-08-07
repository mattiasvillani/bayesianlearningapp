---
title: von Mises
toc: false
---

# von Mises distribution

```js
import bessel from "npm:bessel";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
function vonMisesPdf(x, mu, kappa) {
  return Math.exp(kappa * Math.cos(x - mu)) / (2 * Math.PI * bessel.besseli(kappa, 0));
}

const [mu, kappa, quantile] = params;
const gridsize = 0.01;

const pdfdata = d3.range(-Math.PI, Math.PI, gridsize).map((x) => ({x, pdf: vonMisesPdf(x, mu, kappa)}));
const cdf = d3.sum(pdfdata.filter((d) => d.x <= quantile).map((d) => d.pdf)) * gridsize;

const mean = mu;
const variance = 1 - bessel.besseli(kappa, 1) / bessel.besseli(kappa, 0);
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-5, 5], {value: 0, step: 0.1, label: "mean, μ"}),
  Inputs.range([0, 100], {value: 2, step: 1, label: "concentration, κ"}),
  Inputs.range([-3, 3], {value: -0.5, step: 0.001, label: "Quantile:"})
]));
```

</div>

<div class="card">

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true, domain: [-Math.PI, Math.PI]},
  y: {label: "f(x)"},
  marks: [
    Plot.ruleY([0]),
    Plot.line(pdfdata, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdfdata, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
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
f(x) &= \frac{\exp\big(\kappa\cos(x-\mu)\big)}{2\pi I_0(\kappa)} \\[0.4em]
\mathbb{E}(X) &= \mu \\[0.4em]
\mathbb{V}(X) &= 1 - \frac{I_1(\kappa)}{I_0(\kappa)}
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile.toFixed(2)})`} | ${cdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/von-mises-distribution")}

</div>

</div>
