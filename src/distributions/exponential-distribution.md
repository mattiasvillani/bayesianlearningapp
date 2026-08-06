---
title: Exponential
toc: false
---

# Exponential distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const parametrization = view(Inputs.radio(["scale", "rate"], {label: "Parameterization:", value: "rate"}));
```

```js
const params = view(
  parametrization === "scale"
    ? Inputs.form([
        Inputs.range([0, 10], {value: 1, step: 0.1, label: "β"}),
        Inputs.range([0, 5], {value: 1, step: 0.01, label: "Quantile:"})
      ])
    : Inputs.form([
        Inputs.range([0, 10], {value: 1, step: 0.1, label: "λ"}),
        Inputs.range([0, 10], {value: 1, step: 0.01, label: "Quantile:"})
      ])
);
```

```js
const rate = parametrization === "rate" ? params[0] : 1 / params[0];
const col = parametrization === "rate" ? mvcolors[0] : mvcolors[1];

const exponpdf = d3.range(Number.EPSILON, 5, 0.001).map((x) => ({x, pdf: jStat.exponential.pdf(x, rate)}));
const exponcdf = jStat.exponential.cdf(params[1], rate);
```

```js
Plot.plot({
  x: {label: "x", axis: true, domain: [0, 5]},
  y: {label: "f(x)", domain: [0, jStat.exponential.pdf(0.01, rate)]},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(exponpdf, {x: "x", y: "pdf", stroke: col, strokeWidth: 2}),
    Plot.areaY(exponpdf, {filter: (d) => d.x <= params[1], x: "x", y: "pdf", fill: col, opacity: 0.2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```js
const pdfFormula = parametrization === "rate" ? String.raw`\lambda e^{-\lambda x}` : String.raw`\frac{1}{\beta} e^{-x/\beta}`;
const meanFormula = parametrization === "rate" ? String.raw`\frac{1}{\lambda}` : String.raw`\beta`;
const varFormula = parametrization === "rate" ? String.raw`\frac{1}{\lambda^2}` : String.raw`\beta^2`;

display(tex.block`
\begin{aligned}
f(x) &= ${pdfFormula} \\[0.4em]
\mathbb{E}(X) &= ${meanFormula} \\[0.4em]
\mathbb{V}(X) &= ${varFormula}
\end{aligned}
`);
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${(1 / rate).toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${(1 / rate).toPrecision(3)} |
| ${tex`P(X \le ${params[1].toFixed(2)})`} | ${exponcdf.toPrecision(4)} |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/exponential-distribution" target="_blank" rel="noopener noreferrer">
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
