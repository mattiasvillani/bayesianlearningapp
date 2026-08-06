---
title: Scaled Inverse Chi-squared
toc: false
---

# Scaled inverse chi2 distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0.1, 100], {value: 3, step: 0.1, label: "ν"}),
  Inputs.range([0.1, 5], {value: 1, step: 0.1, label: "τ²"}),
  Inputs.range([0, 5], {value: 1, step: 0.01, label: "Quantile:"})
]));
```

```js
function scaledinvchi2pdf(x, nu, tau2) {
  // ScaledInverseChiSq(ν,τ²) = InverseGamma(ν/2, ν*τ²/2)
  return jStat.invgamma.pdf(x, nu / 2, nu * tau2 / 2);
}

const [nu, tau2] = params;
const pdfvals = d3.range(0, 10, 0.01).map((x) => ({x, pdf: scaledinvchi2pdf(x, nu, tau2)}));
const cdf = jStat.invgamma.cdf(params[2], nu / 2, nu * tau2 / 2);
const mean = nu * tau2 / (nu - 2);
const variance = 2 * tau2 ** 2 / ((nu - 2) ** 2 * (nu - 4));
```

```js
Plot.plot({
  x: {label: "x", axis: true},
  y: {label: "f(x)", domain: [0, scaledinvchi2pdf((nu * tau2) / (nu + 2), nu, tau2)]},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(pdfvals, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdfvals, {filter: (d) => d.x <= params[2], x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \frac{(\nu\tau^2/2)^{\nu/2}}{\Gamma(\nu/2)}\, x^{-(\nu/2+1)} e^{-\nu\tau^2/(2x)} \\[0.4em]
\mathbb{E}(X) &= \frac{\nu\tau^2}{\nu-2},\ \ \nu>2 \\[0.4em]
\mathbb{V}(X) &= \frac{2\tau^4}{(\nu-2)^2(\nu-4)},\ \ \nu>4
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${params[2].toFixed(2)})`} | ${cdf.toPrecision(4)} |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/scaled-inverse-chi-2-distribution" target="_blank" rel="noopener noreferrer">
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
