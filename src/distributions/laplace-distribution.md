---
title: Laplace
toc: false
---

# Laplace distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {createFreezeState, resolveDomain} from "../components/freezeAxis.js";
```

```js
const [mu, b, quantile] = params;

function laplacepdf(x, mu, b) {
  return (1 / (2 * b)) * Math.exp(-Math.abs((x - mu) / b));
}
function laplacecdf(x, mu, b) {
  return x <= mu ? 0.5 * Math.exp((x - mu) / b) : 1 - 0.5 * Math.exp(-(x - mu) / b);
}

const mean = mu;
const variance = 2 * b ** 2;
const sigmaMatched = Math.sqrt(2) * b;

const xDomainDynamic = [mu - 8 * b, mu + 8 * b];
const x = d3.range(xDomainDynamic[0], xDomainDynamic[1], (xDomainDynamic[1] - xDomainDynamic[0]) / 1200);
const laplacedata = x.map((x) => ({x, pdf: laplacepdf(x, mu, b)}));
const normaldata = x.map((x) => ({x, pdf: jStat.normal.pdf(x, mu, sigmaMatched)}));
const yDomainDynamic = [0, d3.max(laplacedata, (d) => d.pdf) * 1.05];
const cdfval = laplacecdf(quantile, mu, b);
```

```js
const frozenStateX = createFreezeState();
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-5, 5], {value: 0, step: 0.1, label: "location μ"}),
  Inputs.range([0.1, 5], {value: 1, step: 0.01, label: "scale b"}),
  Inputs.range([-10, 10], {value: -1.96, step: 0.01, label: "quantile"})
]));
```

```js
const shownormal = view(Inputs.toggle({value: false, label: "show normal (moment matched)"}));
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
    Plot.line(laplacedata, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(laplacedata, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2}),
    ...(shownormal ? [Plot.line(normaldata, {x: "x", y: "pdf", stroke: mvcolors[1], strokeWidth: 2})] : [])
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
f(x) &= \frac{1}{2b}\exp\Big(-\frac{|x-\mu|}{b}\Big) \\[0.4em]
\mathbb{E}(X) &= \mu \\[0.4em]
\mathbb{V}(X) &= 2b^2
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

${notebookLink("https://observablehq.com/@mattiasvillani/laplace-distribution")}

</div>

</div>
