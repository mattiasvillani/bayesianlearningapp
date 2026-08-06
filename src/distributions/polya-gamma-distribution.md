---
title: Pólya-Gamma
toc: false
---

# Pólya-Gamma distribution

```js
import * as math from "npm:mathjs";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([1, 10], {value: 1, step: 1, label: "b"}),
  Inputs.range([0, 10], {value: 1, step: 0.1, label: "c"}),
  Inputs.range([0, 5], {value: 0.2, step: 0.01, label: "Quantile:"})
]));
```

```js
const gridsize = 0.001;
const TRUNC = 0.64;
const ntrunc = 20;

function logcosh(x) {
  return x + Math.log1p(Math.exp(-2 * x)) - Math.log(2);
}

function acoef(n, x, r = TRUNC) {
  if (x > TRUNC) {
    return Math.PI * (n + 0.5) * Math.exp(-((n + 0.5) ** 2) * Math.PI ** 2 * x / 2);
  } else {
    return (2 / Math.PI / x) ** 1.5 * Math.PI * (n + 0.5) * Math.exp(-2 * (n + 0.5) ** 2 / x);
  }
}

function jacobi_logpdf(z, x, n) {
  let v = 0;
  for (let i = 0; i <= n; i++) {
    v += (i % 2 === 0 ? 1 : -1) * acoef(i, x);
  }
  return logcosh(z) - x * (z ** 2) / 2 + Math.log(v);
}

function pg_logcoef(x, b, n) {
  return math.lgamma(n + b) - math.lgamma(n + 1) + Math.log(2 * n + b) - Math.log(2 * Math.PI * x ** 3) / 2 - ((2 * n + b) ** 2) / (8 * x);
}

function pg0_logpdf(x, b, n) {
  let v = 0;
  for (let i = 0; i <= n; i++) {
    v += (i % 2 === 0 ? 1 : -1) * Math.exp(pg_logcoef(x, b, i));
  }
  return (b - 1) * Math.log(2) - math.lgamma(b) + Math.log(v);
}

function pg_logpdf(b, c, x, n) {
  return b * logcosh(c / 2) - x * c ** 2 / 2 + pg0_logpdf(x, b, n);
}

function pgpdf(x, b, c) {
  if (b === 1) {
    return Math.exp(jacobi_logpdf(c / 2, 4 * x, ntrunc) + Math.log(4));
  } else {
    return Math.exp(pg_logpdf(b, c, x, ntrunc));
  }
}

const [b, c] = params;
// c = 0 is a removable singularity in both formulas below; use the known PG(b,0) limits there.
const mean = c < 1e-8 ? b / 4 : (b / (2 * c)) * ((Math.exp(c) - 1) / (1 + Math.exp(c)));
const variance = c < 1e-8 ? b / 24 : (b / (4 * c ** 3)) * (Math.sinh(c) - c) * (math.sech(c / 2) ** 2);

const pdfdata = d3.range(Number.EPSILON, 3, gridsize).map((x) => ({x, pdf: pgpdf(x, b, c)}));
const cdf = d3.sum(pdfdata.filter((d) => d.x <= params[2]).map((d) => d.pdf)) * gridsize;
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
f(x) &= \cosh^b(c/2)\,\frac{2^{b-1}}{\Gamma(b)}\sum_{n=0}^{\infty} (-1)^n \frac{\Gamma(n+b)}{n!}\frac{(2n+b)}{\sqrt{2\pi x^3}}\exp\!\left(-\frac{(2n+b)^2}{8x}-\frac{c^2 x}{2}\right) \\[0.4em]
\mathbb{E}(X) &= \frac{b}{2c}\left(\frac{e^c-1}{1+e^c}\right) \\[0.4em]
\mathbb{V}(X) &= \frac{b}{4c^3}\big(\sinh(c)-c\big)\,\mathrm{sech}^2(c/2)
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

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/polya-gamma-distribution" target="_blank" rel="noopener noreferrer">
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
