---
title: Gamma
toc: false
---

# Gamma distribution

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
        Inputs.range([0.01, 20], {value: 3, step: 0.01, label: "shape α"}),
        Inputs.range([0.01, 20], {value: 1, step: 0.01, label: "scale θ"}),
        Inputs.range([0, 5], {value: 1, step: 0.01, label: "Quantile:"})
      ])
    : Inputs.form([
        Inputs.range([0.01, 10], {value: 3, step: 0.01, label: "shape α"}),
        Inputs.range([0.01, 10], {value: 1, step: 0.01, label: "rate β"}),
        Inputs.range([0, 5], {value: 1, step: 0.01, label: "Quantile:"})
      ])
);
```

```js
const [alpha, beta] = params;
const jstatScale = parametrization === "rate" ? 1 / beta : beta;
const col = parametrization === "rate" ? mvcolors[0] : mvcolors[1];

const pdfvals = d3.range(0, 10, 0.01).map((x) => ({x, pdf: jStat.gamma.pdf(x, alpha, jstatScale)}));
const cdf = jStat.gamma.cdf(params[2], alpha, jstatScale);
const mean = parametrization === "rate" ? alpha / beta : alpha * beta;
const variance = parametrization === "rate" ? alpha / beta ** 2 : alpha * beta ** 2;
```

```js
Plot.plot({
  x: {label: "x", axis: true},
  y: {label: "f(x)"},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(pdfvals, {x: "x", y: "pdf", stroke: col, strokeWidth: 2}),
    Plot.areaY(pdfvals, {filter: (d) => d.x <= params[2], x: "x", y: "pdf", fill: col, opacity: 0.2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```js
const pdfFormula = parametrization === "rate"
  ? String.raw`\frac{\beta^\alpha}{\Gamma(\alpha)} x^{\alpha-1} e^{-\beta x}`
  : String.raw`\frac{1}{\Gamma(\alpha)\theta^\alpha} x^{\alpha-1} e^{-x/\theta}`;
const meanFormula = parametrization === "rate" ? String.raw`\frac{\alpha}{\beta}` : String.raw`\alpha\theta`;
const varFormula = parametrization === "rate" ? String.raw`\frac{\alpha}{\beta^2}` : String.raw`\alpha\theta^2`;

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
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${params[2].toFixed(2)})`} | ${cdf.toPrecision(4)} |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/gamma-distribution" target="_blank" rel="noopener noreferrer">
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
