---
title: Truncated Normal
toc: false
---

# Truncated Normal distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-5, 5], {value: 0, step: 0.1, label: "μ"}),
  Inputs.range([0.01, 20], {value: 1, step: 0.1, label: "σ"}),
  Inputs.range([-5, 5], {value: -2, step: 0.1, label: "a"}),
  Inputs.range([-5, 5], {value: 3, step: 0.1, label: "b"}),
  Inputs.range([-5, 5], {value: -1, step: 0.01, label: "quantile"})
]));
```

```js
const [mu, sigma, a, b, quantile] = params;

function truncnormalpdf(x, mu, sigma, a, b) {
  if (x < a || x > b) return 0;
  return jStat.normal.pdf(x, mu, sigma) / (jStat.normal.cdf(b, mu, sigma) - jStat.normal.cdf(a, mu, sigma));
}
function truncnormalcdf(x, mu, sigma, a, b) {
  return (jStat.normal.cdf(x, mu, sigma) - jStat.normal.cdf(a, mu, sigma)) / (jStat.normal.cdf(b, mu, sigma) - jStat.normal.cdf(a, mu, sigma));
}

const normfactor = jStat.normal.cdf(b, mu, sigma) - jStat.normal.cdf(a, mu, sigma);
const mean = mu + (truncnormalpdf(a, mu, sigma, a, b) - truncnormalpdf(b, mu, sigma, a, b)) / normfactor;
const variance = sigma ** 2 * (
  1 - (b * truncnormalpdf(b, mu, sigma, a, b) - a * truncnormalpdf(a, mu, sigma, a, b)) / normfactor
  - ((truncnormalpdf(a, mu, sigma, a, b) - truncnormalpdf(b, mu, sigma, a, b)) / normfactor) ** 2
);

const pdfdata = d3.range(-5, 5, 0.01).map((x) => ({x, pdf: truncnormalpdf(x, mu, sigma, a, b)}));
const cdfval = truncnormalcdf(quantile, mu, sigma, a, b);
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
f(x) &= \frac{\phi(x\mid\mu,\sigma^2)}{\Phi(b\mid\mu,\sigma^2)-\Phi(a\mid\mu,\sigma^2)}, \,\, a \le x \le b \\[0.4em]
\mathbb{E}(X) &= \mu + \frac{\phi(a\mid\mu,\sigma^2)-\phi(b\mid\mu,\sigma^2)}{\Phi(b\mid\mu,\sigma^2)-\Phi(a\mid\mu,\sigma^2)} \\[0.4em]
\mathbb{V}(X) &= \sigma^2\Big(1-\tfrac{b\phi(b)-a\phi(a)}{Z}-\big(\tfrac{\phi(a)-\phi(b)}{Z}\big)^2\Big),\,\, Z=\Phi(b)-\Phi(a)
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

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/truncated-normal-distribution" target="_blank" rel="noopener noreferrer">
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
