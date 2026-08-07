---
title: Gamma
toc: false
---

# Gamma distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
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

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

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

</div>

<div class="card">

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

${notebookLink("https://observablehq.com/@mattiasvillani/gamma-distribution")}

</div>

</div>
