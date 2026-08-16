---
title: Beta
toc: false
---

# Beta distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const distparam =
  parametrization === "traditional"
    ? {alpha: params[0], beta: params[1]}
    : {alpha: params[0] * params[1], beta: (1 - params[0]) * params[1]};
const {alpha, beta} = distparam;
const col = parametrization === "traditional" ? mvcolors[1] : mvcolors[2];

const betapdf = d3.range(0, 1.01, 0.001).map((x) => ({x, pdf: jStat.beta.pdf(x, alpha, beta)}));
const betacdf = jStat.beta.cdf(params[2], alpha, beta);
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const parametrization = view(Inputs.radio(["traditional", "mean"], {label: "Parameterization:", value: "traditional"}));
```

```js
const params = view(
  parametrization === "traditional"
    ? Inputs.form([
        Inputs.range([0.1, 20], {value: 3, step: 0.1, label: "α"}),
        Inputs.range([0.1, 20], {value: 3, step: 0.1, label: "β"}),
        Inputs.range([0, 1], {value: 0.2, step: 0.01, label: "Quantile:"})
      ])
    : Inputs.form([
        Inputs.range([0.001, 0.999], {value: 0.5, step: 0.001, label: "μ"}),
        Inputs.range([0.01, 1000], {value: 6, step: 0.1, label: "φ"}),
        Inputs.range([0, 1], {value: 0.2, step: 0.01, label: "Quantile:"})
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
    Plot.line(betapdf, {x: "x", y: "pdf", stroke: col, strokeWidth: 2}),
    Plot.areaY(betapdf, {filter: (d) => d.x <= params[2], x: "x", y: "pdf", fill: col, opacity: 0.2})
  ]
})
```

</div>

</div>

<div class="dist-side">

<div class="card">

### Properties

```js
const pdfFormula = parametrization === "traditional"
  ? String.raw`\frac{1}{\Beta(\alpha,\beta)} x^{\alpha-1}(1-x)^{\beta-1}`
  : String.raw`\frac{1}{\Beta(\mu\phi,(1-\mu)\phi)} x^{\mu\phi-1}(1-x)^{(1-\mu)\phi-1}`;
const meanFormula = parametrization === "traditional" ? String.raw`\frac{\alpha}{\alpha+\beta}` : String.raw`\mu`;
const varFormula = parametrization === "traditional"
  ? String.raw`\frac{\alpha\beta}{(\alpha+\beta)^2(\alpha+\beta+1)}`
  : String.raw`\frac{\mu(1-\mu)}{1+\phi}`;

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
| ${tex`\mathbb{E}(X)`} | ${(alpha / (alpha + beta)).toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt((alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1))).toPrecision(3)} |
| ${tex`P(X \le ${params[2].toFixed(2)})`} | ${betacdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/beta-distribution")}

</div>

</div>
