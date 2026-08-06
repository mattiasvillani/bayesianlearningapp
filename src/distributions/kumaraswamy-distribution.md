---
title: Kumaraswamy
toc: false
---

# Kumaraswamy distribution

```js
import jStat from "npm:jstat";
import * as math from "npm:mathjs";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0, 10], {value: 4, step: 0.1, label: "a"}),
  Inputs.range([0, 10], {value: 2, step: 0.1, label: "b"}),
  Inputs.range([0, 1], {value: 0.5, step: 0.01, label: "Quantile:"})
]));
```

```js
const [a, b, quantile] = params;

const mean = (b * math.gamma(b) * math.gamma(1 + 1 / a)) / math.gamma(1 + 1 / a + b);
const variance = b * jStat.betafn(1 + 2 / a, b) - b ** 2 * jStat.betafn(1 + 1 / a, b) ** 2;

const pdfdata = d3.range(0, 1, 0.001).map((x) => ({x, pdf: jStat.kumaraswamy.pdf(x, a, b)}));
const cdf = jStat.kumaraswamy.cdf(quantile, a, b);
```

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true},
  y: {label: "f(x)"},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
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
f(x) &= a b\, x^{a-1}(1-x^a)^{b-1} \\[0.4em]
\mathbb{E}(X) &= \frac{b\,\Gamma(1+1/a)\,\Gamma(b)}{\Gamma(1+1/a+b)} \\[0.4em]
\mathbb{V}(X) &= b\,\Beta\big(1+\tfrac{2}{a},b\big) - b^2\Beta\big(1+\tfrac{1}{a},b\big)^2
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

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/kumaraswamy-distribution" target="_blank" rel="noopener noreferrer">
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
