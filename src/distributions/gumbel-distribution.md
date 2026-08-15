---
title: Gumbel
toc: false
---

# Gumbel distribution

```js
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {createFreezeState, resolveDomain} from "../components/freezeAxis.js";
```

```js
const EULER_MASCHERONI = 0.5772156649015329;
const [mu, beta, quantile] = params;

function pdfgumbel(x) {
  const z = (x - mu) / beta;
  return (1 / beta) * Math.exp(-(z + Math.exp(-z)));
}
function cdfgumbel(x) {
  return Math.exp(-Math.exp(-(x - mu) / beta));
}

const mean = mu + beta * EULER_MASCHERONI;
const variance = ((Math.PI ** 2) / 6) * beta ** 2;

const xDomainDynamic = [mu - 4 * beta, mu + 8 * beta];
const pdfdata = d3.range(xDomainDynamic[0], xDomainDynamic[1], (xDomainDynamic[1] - xDomainDynamic[0]) / 1200).map((x) => ({x, pdf: pdfgumbel(x)}));
const yDomainDynamic = [0, d3.max(pdfdata, (d) => d.pdf) * 1.05];
const cdfval = cdfgumbel(quantile);
```

```js
const frozenStateX = createFreezeState();
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-1, 5], {value: 2, step: 0.1, label: "μ"}),
  Inputs.range([0.01, 5], {value: 1, step: 0.01, label: "β"}),
  Inputs.range([-10, 10], {value: 2, step: 0.01, label: "quantile"})
]));
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
  width: Math.min(720, width),
  x: {label: "x", axis: true, domain: xDomain},
  y: {label: "f(x)", axis: false, domain: yDomain},
  marks: [
    Plot.ruleY([0]),
    Plot.line(pdfdata, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdfdata, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
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
f(x) &= \frac{1}{\beta}e^{-(z+e^{-z})}, \,\, z=\frac{x-\mu}{\beta} \\[0.4em]
\mathbb{E}(X) &= \mu + \beta\gamma \\[0.4em]
\mathbb{V}(X) &= \frac{\pi^2}{6}\beta^2
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile.toFixed(2)})`} | ${cdfval.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/gumbel-distribution")}

</div>

</div>
