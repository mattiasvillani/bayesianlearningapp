---
title: Split-t
toc: false
---

# Split-*t* distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-10, 10], {value: 0, step: 0.1, label: "location, μ"}),
  Inputs.range([0.01, 10], {value: 1, step: 0.1, label: "scale, τ"}),
  Inputs.range([0.01, 10], {value: 1.3, step: 0.01, label: "skew, λ"}),
  Inputs.range([1, 50], {value: 4, step: 1, label: "df, ν"}),
  Inputs.range([-10, 10], {value: -1, step: 0.01, label: "quantile"})
]));
```

```js
const [mu, tau, lambda, nu, quantile] = params;

function betaFn(a, b) {
  return (jStat.gammafn(a) * jStat.gammafn(b)) / jStat.gammafn(a + b);
}
function splittpdf(x, mu, tau, lambda, nu) {
  const c = 2 / ((1 + lambda) * tau * Math.sqrt(nu) * betaFn(nu / 2, 0.5));
  return x <= mu
    ? c * (1 + (1 / nu) * ((x - mu) / tau) ** 2) ** (-(nu + 1) / 2)
    : c * (1 + (1 / nu) * ((x - mu) / (lambda * tau)) ** 2) ** (-(nu + 1) / 2);
}
function splittcdf(x, mu, tau, lambda, nu) {
  const a = x > mu ? lambda : 1;
  const t = (nu * a ** 2 * tau ** 2) / (nu * a ** 2 * tau ** 2 + (x - mu) ** 2);
  return 1 / (1 + lambda) + ((a * Math.sign(x - mu)) / (1 + lambda)) * (1 - jStat.beta.cdf(t, nu / 2, 0.5));
}

const h = (2 * Math.sqrt(nu) * tau * (lambda - 1)) / ((nu - 1) * betaFn(nu / 2, 0.5));
const mean = mu + h;
const variance = ((1 + lambda ** 3) / (1 + lambda)) * (nu / (nu - 2)) * tau ** 2 - h ** 2;
const thirdCentralMoment = 2 * h ** 3 + 2 * h * tau ** 2 * (lambda ** 2 + 1) * (nu / (nu - 3))
  - (3 * h * tau ** 2 * (lambda ** 3 + 1) * nu) / ((lambda + 1) * (nu - 2));
const skewness = thirdCentralMoment / variance ** 1.5;

const pdfdata = d3.range(mu - 8 * tau * Math.max(1, lambda), mu + 8 * tau * Math.max(1, lambda), 0.02).map((x) => ({x, pdf: splittpdf(x, mu, tau, lambda, nu)}));
const cdfval = splittcdf(quantile, mu, tau, lambda, nu);
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
f(x) &= \begin{cases} c \cdot \kappa_\nu(x\mid\mu,\tau) & x \leq \mu \\ c \cdot \kappa_\nu(x\mid\mu,\lambda\tau) & x > \mu \end{cases} \\[0.4em]
c &= \frac{2}{(1+\lambda)\tau\sqrt{\nu}\,\mathrm{B}(\nu/2,1/2)} \\[0.4em]
\mathbb{E}(X) &= \mu + h \\[0.4em]
\mathbb{V}(X) &= \frac{1+\lambda^3}{1+\lambda}\frac{\nu}{\nu-2}\tau^2 - h^2
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(Math.abs(variance)).toPrecision(3)} |
| ${tex`\text{Skewness}(X)`} | ${skewness.toPrecision(3)} |
| ${tex`P(X \le ${quantile.toFixed(2)})`} | ${cdfval.toPrecision(4)} |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/split-t-distribution" target="_blank" rel="noopener noreferrer">
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
