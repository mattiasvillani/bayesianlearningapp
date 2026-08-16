---
title: Chi-squared
toc: false
---

# Chi2-distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {createFreezeState, resolveDomain} from "../components/freezeAxis.js";
```

```js
const xDomainDynamic = [0, params[0] + 5 * Math.sqrt(2 * params[0])];
const yDomainDynamic = [0, jStat.chisquare.pdf(Math.max(0, params[0] - 2), params[0])];
const chisquarepdf = d3.range(0.01, xDomainDynamic[1], 0.01)
  .map((x) => ({x, pdf: jStat.chisquare.pdf(x, params[0])}));
const chisquarecdf = jStat.chisquare.cdf(params[1], params[0]);
```

```js
const frozenStateX = createFreezeState();
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([1, 20], {value: 4, step: 1, label: "ν"}),
  Inputs.range([0.01, 10], {value: 2, step: 0.01, label: "Quantile:"})
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
  x: {label: "x", axis: true, domain: xDomain},
  y: {label: "f(x)", domain: yDomain},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(chisquarepdf, {x: "x", y: "pdf", stroke: mvcolors[1], strokeWidth: 2}),
    Plot.areaY(chisquarepdf, {filter: (d) => d.x <= params[1], x: "x", y: "pdf", fill: mvcolors[1], opacity: 0.2})
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
f(x) &= \frac{1}{2^{\nu/2}\Gamma(\nu/2)}\; x^{\nu/2-1} e^{-x/2} \\[0.4em]
\mathbb{E}(X) &= \nu \\[0.4em]
\mathbb{V}(X) &= 2\nu
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${params[0].toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(2 * params[0]).toPrecision(3)} |
| ${tex`P(X \le ${params[1].toFixed(2)})`} | ${chisquarecdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/chi2-distribution")}

</div>

</div>
