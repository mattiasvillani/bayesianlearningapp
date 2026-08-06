---
title: Non-central Chi-squared
toc: false
---

# Non-central Chi2-distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([1, 20], {value: 2, step: 0.1, label: "k"}),
  Inputs.range([1, 20], {value: 1, step: 0.1, label: "λ"}),
  Inputs.range([Number.EPSILON, 20], {value: 2, step: 0.01, label: "Quantile:"})
]));
```

```js
// Poisson(λ/2)-mixture of central chi-squared(k+2i) — exact, and (unlike a modified
// Bessel function I_{k/2-1}) works for the non-integer k this slider allows.
function ncTerms(k, lambda) {
  const halfLambda = lambda / 2;
  const terms = [];
  for (let i = 0; i < 300; i++) {
    const w = Math.exp(-halfLambda + i * Math.log(halfLambda) - jStat.gammaln(i + 1));
    terms.push({weight: w, df: k + 2 * i});
    if (i > 10 && w < 1e-14) break;
  }
  return terms;
}
function ncpdf(x, terms) {
  return terms.reduce((s, {weight, df}) => s + weight * jStat.chisquare.pdf(x, df), 0);
}
function nccdf(x, terms) {
  return terms.reduce((s, {weight, df}) => s + weight * jStat.chisquare.cdf(x, df), 0);
}

const [k, lambda] = params;
const terms = ncTerms(k, lambda);
const binsize = 0.005;
const pdfdata = d3.range(Number.EPSILON, k + lambda + 4 * Math.sqrt(2 * (k + 2 * lambda)), binsize)
  .map((x) => ({x, pdf: ncpdf(x, terms)}));
const mean = k + lambda;
const sd = Math.sqrt(2 * (k + 2 * lambda));
const cdf = nccdf(params[2], terms);
```

```js
Plot.plot({
  x: {label: "x", axis: true},
  y: {label: "f(x)"},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(pdfdata, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdfdata, {filter: (d) => d.x <= params[2], x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \frac{1}{2}e^{-(x+\lambda)/2}\left(\frac{x}{\lambda}\right)^{k/4-1/2} I_{k/2-1}\!\left(\sqrt{\lambda x}\right) \\[0.4em]
\mathbb{E}(X) &= k+\lambda \\[0.4em]
\mathbb{V}(X) &= 2(k+2\lambda)
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${sd.toPrecision(3)} |
| ${tex`P(X \le ${params[2].toFixed(2)})`} | ${cdf.toPrecision(4)} |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/non-central-chi2-distribution" target="_blank" rel="noopener noreferrer">
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
