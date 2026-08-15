---
title: Pareto
toc: false
---

# Pareto distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {createFreezeState, resolveDomain} from "../components/freezeAxis.js";
```

```js
const [xm, alpha] = params;
const xDomainDynamic = [xm, jStat.pareto.inv(0.99, xm, alpha)];
const paretopdf = d3.range(xDomainDynamic[0], xDomainDynamic[1], (xDomainDynamic[1] - xDomainDynamic[0]) / 1200).map((x) => ({x, pdf: jStat.pareto.pdf(x, xm, alpha)}));
const paretocdf = jStat.pareto.cdf(quantile, xm, alpha);
const mean = alpha > 1 ? (alpha * xm) / (alpha - 1) : Infinity;
const variance = alpha > 2 ? (alpha * xm ** 2) / ((alpha - 1) ** 2 * (alpha - 2)) : Infinity;
```

```js
const frozenStateX = createFreezeState();
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0.1, 5], {value: 1, step: 0.1, label: "xₘ"}),
  Inputs.range([1, 10], {value: 4, step: 0.1, label: "α"})
]));
```

```js
const quantile = view(Inputs.range([params[0], 10], {value: params[0] + 1, step: 0.01, label: "Quantile:"}));
```

</div>

<div class="card" style="padding-top: 0.25rem;">

```js
const freezeInput = Inputs.toggle({label: "Freeze x-axis", value: true});
const freezeAxis = view(freezeInput);
```

```js
const xDomain = resolveDomain(frozenStateX, freezeAxis, xDomainDynamic);
```

```js
Plot.plot({
  x: {label: "x", axis: true, domain: xDomain},
  y: {label: "f(x)"},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(paretopdf, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(paretopdf, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

<div style="margin-top: -0.75rem; font-size: 13px;">${freezeInput}</div>

</div>

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \frac{\alpha x_m^\alpha}{x^{\alpha+1}},\ \ x\ge x_m \\[0.4em]
\mathbb{E}(X) &= \frac{\alpha x_m}{\alpha-1},\ \ \alpha>1 \\[0.4em]
\mathbb{V}(X) &= \frac{\alpha x_m^2}{(\alpha-1)^2(\alpha-2)},\ \ \alpha>2
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile.toFixed(2)})`} | ${paretocdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/pareto-distribution")}

</div>

</div>
