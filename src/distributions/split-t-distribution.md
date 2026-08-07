---
title: Split-t
toc: false
---

# Split-*t* distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
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

${notebookLink("https://observablehq.com/@mattiasvillani/split-t-distribution")}

</div>

</div>
