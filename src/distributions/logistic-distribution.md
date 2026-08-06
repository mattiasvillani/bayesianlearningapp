---
title: Logistic
toc: false
---

# Logistic distribution

```js
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-10, 10], {value: 0, step: 0.1, label: "μ"}),
  Inputs.range([0.1, 10], {value: 1, step: 0.1, label: "s"}),
  Inputs.range([-10, 10], {value: -1, step: 0.1, label: "quantile"})
]));
```

```js
const [mu, s, quantile] = params;

function pdf_func(x, mu, s) {
  return Math.exp(-(x - mu) / s) / ((s * (1 + Math.exp(-(x - mu) / s))) ** 2);
}
function cdf_func(x, mu, s) {
  return 1 / (1 + Math.exp(-(x - mu) / s));
}

const mean = mu;
const variance = (s ** 2 * Math.PI ** 2) / 3;

const pdfdata = d3.range(mu - 10 * s, mu + 10 * s, 0.05).map((x) => ({x, pdf: pdf_func(x, mu, s)}));
const cdfval = cdf_func(quantile, mu, s);
```

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true},
  y: {label: "f(x)", axis: false},
  marks: [
    Plot.ruleY([0]),
    Plot.line(pdfdata, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdfdata, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \frac{e^{-(x-\mu)/s}}{s\big(1+e^{-(x-\mu)/s}\big)^2} \\[0.4em]
\mathbb{E}(X) &= \mu \\[0.4em]
\mathbb{V}(X) &= \frac{s^2\pi^2}{3}
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile.toFixed(2)})`} | ${cdfval.toPrecision(4)} |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/logistic-distribution" target="_blank" rel="noopener noreferrer">
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
