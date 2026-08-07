---
title: Fisher Z
toc: false
---

# Fisher *Z*-distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
// digamma and trigamma via standard asymptotic-series approximations (jStat has no special function for these)
function digamma(x) {
  let r = 0;
  while (x < 6) { r -= 1 / x; x += 1; }
  const x2 = 1 / (x * x);
  return r + Math.log(x) - 1 / (2 * x) - x2 * (1 / 12 - x2 * (1 / 120 - x2 * (1 / 252 - x2 * (1 / 240 - x2 / 132))));
}
function trigamma(x) {
  let r = 0;
  while (x < 6) { r += 1 / (x * x); x += 1; }
  return r + 1 / x + 1 / (2 * x ** 2) + 1 / (6 * x ** 3) - 1 / (30 * x ** 5) + 1 / (42 * x ** 7) - 1 / (30 * x ** 9);
}
function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }
function zpdf(x, alpha, beta, mu, sigma) {
  const z = (x - mu) / sigma;
  const y = sigmoid(z);
  return (jStat.beta.pdf(y, alpha, beta) * y * (1 - y)) / sigma;
}
function zcdf(x, alpha, beta, mu, sigma) {
  return jStat.beta.cdf(sigmoid((x - mu) / sigma), alpha, beta);
}

const [alpha, beta, mu, sigma, quantile] = params;
const Zmean = mu + sigma * (digamma(alpha) - digamma(beta));
const Zvar = sigma ** 2 * (trigamma(alpha) + trigamma(beta));

const xgrid = d3.range(-20, 20, 0.02);
const zpdfdata = xgrid.map((x) => ({x, pdf: zpdf(x, alpha, beta, mu, sigma)}));
const normpdfdata = xgrid.map((x) => ({x, pdf: jStat.normal.pdf(x, Zmean, Math.sqrt(Zvar))}));
const zcdfval = zcdf(quantile, alpha, beta, mu, sigma);
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0.1, 100], {value: 0.5, step: 0.1, label: "α"}),
  Inputs.range([0.1, 100], {value: 0.5, step: 0.1, label: "β"}),
  Inputs.range([-10, 10], {value: 0, step: 0.1, label: "μ"}),
  Inputs.range([0.1, 10], {value: 1, step: 0.01, label: "σ"}),
  Inputs.range([-10, 10], {value: -1.96, step: 0.01, label: "quantile"})
]));
```

```js
const shownormal = view(Inputs.toggle({value: true, label: "show closest normal"}));
```

</div>

<div class="card">

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true},
  y: {label: "f(x)", axis: false},
  marks: [
    Plot.ruleY([0]),
    Plot.line(zpdfdata, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(zpdfdata, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2}),
    ...(shownormal ? [
      Plot.line(normpdfdata, {x: "x", y: "pdf", stroke: mvcolors[1], strokeWidth: 2})
    ] : [])
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
f(x) &= \frac{1}{\sigma B(\alpha,\beta)}\frac{e^{\alpha z}}{(1+e^{z})^{\alpha+\beta}}, \,\, z=\frac{x-\mu}{\sigma} \\[0.4em]
\mathbb{E}(X) &= \mu + \sigma\big(\psi(\alpha) - \psi(\beta)\big) \\[0.4em]
\mathbb{V}(X) &= \sigma^2\big(\psi'(\alpha) + \psi'(\beta)\big)
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${Zmean.toPrecision(4)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(Zvar).toPrecision(4)} |
| ${tex`P(X \le ${quantile.toFixed(2)})`} | ${zcdfval.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/z-distribution")}

</div>

</div>
