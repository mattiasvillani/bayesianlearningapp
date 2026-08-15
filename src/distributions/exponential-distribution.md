---
title: Exponential
toc: false
---

# Exponential distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {createFreezeState, resolveDomain} from "../components/freezeAxis.js";
```

```js
const rate = parametrization === "rate" ? params[0] : 1 / params[0];
const col = parametrization === "rate" ? mvcolors[0] : mvcolors[1];

const xDomainDynamic = [0, jStat.exponential.inv(0.99, rate)];
const exponpdf = d3.range(Number.EPSILON, xDomainDynamic[1], xDomainDynamic[1] / 1000).map((x) => ({x, pdf: jStat.exponential.pdf(x, rate)}));
const yDomainDynamic = [0, jStat.exponential.pdf(0, rate)];
const exponcdf = jStat.exponential.cdf(params[1], rate);
```

```js
const frozenStateX = createFreezeState();
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
        Inputs.range([0, 10], {value: 1, step: 0.1, label: "β"}),
        Inputs.range([0, 5], {value: 1, step: 0.01, label: "Quantile:"})
      ])
    : Inputs.form([
        Inputs.range([0, 10], {value: 1, step: 0.1, label: "λ"}),
        Inputs.range([0, 10], {value: 1, step: 0.01, label: "Quantile:"})
      ])
);
```

</div>

<div class="card" style="padding-top: 0.25rem;">

```js
const freezeInput = Inputs.toggle({label: "Freeze x-axis", value: true});
const freezeAxis = view(freezeInput);
```

```js
const xDomain = resolveDomain(frozenStateX, freezeAxis, xDomainDynamic);
const yDomain = yDomainDynamic;
```

```js
Plot.plot({
  x: {label: "x", axis: true, domain: xDomain},
  y: {label: "f(x)", domain: yDomain},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(exponpdf, {x: "x", y: "pdf", stroke: col, strokeWidth: 2}),
    Plot.areaY(exponpdf, {filter: (d) => d.x <= params[1], x: "x", y: "pdf", fill: col, opacity: 0.2})
  ]
})
```

<div style="margin-top: -0.75rem; font-size: 13px;">${freezeInput}</div>

</div>

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

${notebookLink("https://observablehq.com/@mattiasvillani/exponential-distribution")}

</div>

</div>
