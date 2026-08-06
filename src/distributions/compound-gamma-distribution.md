---
title: Compound-Gamma
toc: false
---

# Compound-Gamma distribution

```js
import * as math from "npm:mathjs";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0.01, 5], {value: 3, step: 0.01, label: "α"}),
  Inputs.range([0.01, 5], {value: 2, step: 0.01, label: "β"}),
  Inputs.range([0.01, 5], {value: 1, step: 0.01, label: "κ"}),
  Inputs.range([0, 15], {value: 2, step: 0.01, label: "Quantile:"})
]));
```

```js
function pdfcompoundgamma(x, alpha, beta, kappa) {
  const normconst = (beta ** alpha / math.gamma(alpha)) * (math.gamma(alpha + kappa) / math.gamma(kappa));
  return normconst * (x ** (kappa - 1)) / ((beta + x) ** (alpha + kappa));
}

const stepsize = 0.01;
const pdfdata = d3.range(0, 15, stepsize)
  .map((x) => ({x, pdf: pdfcompoundgamma(x, params[0], params[1], params[2])}));

const mean = params[2] * (params[1] / (params[0] - 1));
const variance = params[1] ** 2 * ((params[2] ** 2 + params[2] * (params[0] - 1)) / ((params[0] - 2) * (params[0] - 1) ** 2));
const cdf = d3.sum(pdfdata.filter((d) => d.x <= params[3]).map((d) => d.pdf * stepsize));
```

```js
Plot.plot({
  x: {label: "x", axis: true},
  y: {label: "f(x)"},
  marks: [
    Plot.ruleY([0]),
    Plot.line(pdfdata, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdfdata, {filter: (d) => d.x <= params[3], x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \frac{\beta^\alpha}{\Gamma(\alpha)}\, \frac{\Gamma(\alpha+\kappa)}{\Gamma(\kappa)}\, \frac{x^{\kappa-1}}{(\beta + x)^{\alpha+\kappa}} \\[0.4em]
\mathbb{E}(X) &= \kappa\frac{\beta}{\alpha-1} \\[0.4em]
\mathbb{V}(X) &= \beta^2\frac{\kappa^2+\kappa(\alpha-1)}{(\alpha-2)(\alpha-1)^2}
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${params[3].toFixed(2)})`} | ${cdf.toPrecision(4)} |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/compound-gamma-distribution" target="_blank" rel="noopener noreferrer">
<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="1.5" width="9" height="13" rx="1.2" stroke="currentColor" stroke-width="1.1"/>
  <line x1="4.2" y1="4.4" x2="8.8" y2="4.4" stroke="currentColor" stroke-width="0.9"/>
  <line x1="4.2" y1="6.6" x2="8.8" y2="6.6" stroke="currentColor" stroke-width="0.9"/>
  <line x1="4.2" y1="8.8" x2="7.2" y2="8.8" stroke="currentColor" stroke-width="0.9"/>
  <circle cx="12.3" cy="12.3" r="2.3" fill="#6C8EBF"/>
  <circle cx="10.4" cy="13.2" r="1.6" fill="#c0a34d"/>
  <circle cx="13.5" cy="13.6" r="1.4" fill="#007878"/>
</svg>
Original notebook ↗
</a>

</div>

</div>
