---
title: Gamma
toc: false
---

# Gamma distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {createFreezeState, resolveDomain} from "../components/freezeAxis.js";
```

```js
const [alpha, beta] = params;
const jstatScale = parametrization === "rate" ? 1 / beta : beta;
const col = parametrization === "rate" ? mvcolors[0] : mvcolors[1];

const xDomainDynamic = [0, jStat.gamma.inv(0.99, alpha, jstatScale)];
const pdfvals = d3.range(0, xDomainDynamic[1], xDomainDynamic[1] / 1000).map((x) => ({x, pdf: jStat.gamma.pdf(x, alpha, jstatScale)}));
const yDomainDynamic = [0, d3.max(pdfvals, (d) => d.pdf) * 1.05];
const cdf = jStat.gamma.cdf(params[2], alpha, jstatScale);
const mean = parametrization === "rate" ? alpha / beta : alpha * beta;
const variance = parametrization === "rate" ? alpha / beta ** 2 : alpha * beta ** 2;
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
    Plot.line(pdfvals, {x: "x", y: "pdf", stroke: col, strokeWidth: 2}),
    Plot.areaY(pdfvals, {filter: (d) => d.x <= params[2], x: "x", y: "pdf", fill: col, opacity: 0.2})
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
