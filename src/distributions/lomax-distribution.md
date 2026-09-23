---
title: Lomax
toc: false
---

# Lomax distribution (Pareto Type II)

```js
import {mvcolors} from "../components/mvcolors.js";
import {createFreezeState, resolveDomain} from "../components/freezeAxis.js";
```

```js
function lomaxPdf(x, a, b) {
  return (a / b) * (1 + x / b) ** (-(a + 1));
}
function lomaxCdf(x, a, b) {
  return 1 - (1 + x / b) ** (-a);
}
function lomaxInv(p, a, b) {
  return b * ((1 - p) ** (-1 / a) - 1);
}
```

```js
const [alpha, beta] = params;
const xDomainDynamic = [0, lomaxInv(0.99, alpha, beta)];
const lomaxpdf = d3.range(xDomainDynamic[0], xDomainDynamic[1], (xDomainDynamic[1] - xDomainDynamic[0]) / 1200).map((x) => ({x, pdf: lomaxPdf(x, alpha, beta)}));
const lomaxcdf = lomaxCdf(quantile, alpha, beta);
const mean = alpha > 1 ? beta / (alpha - 1) : Infinity;
const variance = alpha > 2 ? (alpha * beta ** 2) / ((alpha - 1) ** 2 * (alpha - 2)) : Infinity;
```

```js
const frozenStateX = createFreezeState();
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0.1, 10], {value: 2, step: 0.1, label: "α"}),
  Inputs.range([0.1, 10], {value: 1, step: 0.1, label: "β"})
]));
```

```js
const quantile = view(Inputs.range([0, 10], {value: 1, step: 0.01, label: "Quantile:"}));
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
    Plot.line(lomaxpdf, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(lomaxpdf, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
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
f(x) &= \frac{\alpha}{\beta}\Big(1+\frac{x}{\beta}\Big)^{-(\alpha+1)},\ \ x\ge 0 \\[0.4em]
\mathbb{E}(X) &= \frac{\beta}{\alpha-1},\ \ \alpha>1 \\[0.4em]
\mathbb{V}(X) &= \frac{\alpha\beta^2}{(\alpha-1)^2(\alpha-2)},\ \ \alpha>2
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${Number.isFinite(mean) ? mean.toPrecision(3) : "∞"} |
| ${tex`\mathbb{S}(X)`} | ${Number.isFinite(variance) ? Math.sqrt(variance).toPrecision(3) : "∞"} |
| ${tex`P(X \le ${quantile.toFixed(2)})`} | ${lomaxcdf.toPrecision(4)} |

</div>

</div>

</div>
