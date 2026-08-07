---
title: Negative Binomial
toc: false
---

# Negative binomial distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const r = params[0];
const p = parametrization === "standard" ? params[1] : r / (params[1] + r);
const mean = r * (1 - p) / p;
const variance = r * (1 - p) / (p ** 2);
const xgrid = d3.range(0, mean + 4 * Math.sqrt(variance) + 1, 1);
const negbinpdf = xgrid.map((x) => ({x, pdf: jStat.negbin.pdf(x, r, p), pdfpois: jStat.poisson.pdf(x, mean)}));
const negbincdf = jStat.negbin.cdf(params[2], r, p);
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const parametrization = view(Inputs.radio(["standard", "mean"], {label: "Parameterization:", value: "standard"}));
```

```js
const params = view(
  parametrization === "standard"
    ? Inputs.form([
        Inputs.range([1, 10], {value: 1, step: 0.1, label: "r"}),
        Inputs.range([0.01, 0.99], {value: 0.5, step: 0.01, label: "p"}),
        Inputs.range([0, 20], {value: 1, step: 1, label: "quantile"})
      ])
    : Inputs.form([
        Inputs.range([1, 1000], {value: 1, step: 0.5, label: "r"}),
        Inputs.range([0.1, 10], {value: 2, step: 0.01, label: "μ"}),
        Inputs.range([0, 20], {value: 1, step: 1, label: "quantile"})
      ])
);
```

```js
const plotpois = view(Inputs.toggle({label: "plot Poisson(μ) overlay", value: false}));
```

</div>

<div class="card">

```js
Plot.plot({
  x: {label: "x", axis: true},
  y: {label: "f(x)", axis: true},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(negbinpdf, {
      x: "x", y: "pdf", fill: mvcolors[0], fillOpacity: 0.3, strokeWidth: 0,
      title: (d) => `P(X=${d.x}) = ${d.pdf.toPrecision(4)}`
    }),
    Plot.barY(negbinpdf, {
      filter: (d) => d.x <= params[2], x: "x", y: "pdf", fill: mvcolors[0],
      title: (d) => `P(X=${d.x}) = ${d.pdf.toPrecision(4)}`
    }),
    Plot.line(negbinpdf, {filter: () => plotpois, x: "x", y: "pdfpois", stroke: mvcolors[1], strokeWidth: 2}),
    Plot.dot(negbinpdf, {filter: () => plotpois, x: "x", y: "pdfpois", stroke: mvcolors[1]})
  ]
})
```

</div>

</div>

<div class="dist-side">

<div class="card">

### Properties

```js
const pdfFormula = parametrization === "standard"
  ? String.raw`\binom{x+r-1}{x} p^r(1-p)^x`
  : String.raw`\binom{x+r-1}{x} \Big(\frac{r}{r+\mu}\Big)^r\Big(\frac{\mu}{r+\mu}\Big)^x`;
const meanFormula = parametrization === "standard" ? String.raw`\frac{r(1-p)}{p}` : String.raw`\mu`;
const varFormula = parametrization === "standard"
  ? String.raw`\frac{r(1-p)}{p^2}`
  : String.raw`\mu\Big(1+\frac{\mu}{r}\Big)`;

display(tex.block`
\begin{aligned}
P(x) &= ${pdfFormula}, \ x = 0,1,2,\ldots \\[0.4em]
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
| ${tex`P(X \le ${params[2]})`} | ${negbincdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/negative-binomial-distribution")}

</div>

</div>
