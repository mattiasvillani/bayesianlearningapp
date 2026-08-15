---
title: Triangular
toc: false
---

# Triangular distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {createFreezeState, resolveDomain} from "../components/freezeAxis.js";
```

```js
const [a, b, c, quantile] = params;

const mean = (a + b + c) / 3;
const variance = (a ** 2 + b ** 2 + c ** 2 - a * b - a * c - b * c) / 18;

const loBound = Math.min(a, b);
const hiBound = Math.max(a, b);
const margin = Math.max(0.1 * (hiBound - loBound), 0.1);
const xDomainDynamic = [loBound - margin, hiBound + margin];
const pdf = d3.range(xDomainDynamic[0], xDomainDynamic[1], (xDomainDynamic[1] - xDomainDynamic[0]) / 1000).map((x) => ({x, pdf: jStat.triangular.pdf(x, a, b, c)}));
const cdf = jStat.triangular.cdf(quantile, a, b, c);
```

```js
const frozenStateX = createFreezeState();
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-5, 5], {value: 0, step: 0.1, label: "lower, a"}),
  Inputs.range([-5, 5], {value: 1, step: 0.1, label: "upper, b"}),
  Inputs.range([-5, 5], {value: 0.5, step: 0.1, label: "mode, c"}),
  Inputs.range([-5, 5], {value: 1, step: 0.1, label: "Quantile:"})
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
```

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true, domain: xDomain},
  y: {label: "f(x)"},
  marks: [
    Plot.ruleY([0]),
    Plot.line(pdf, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdf, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
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
f(x) &= \begin{cases} \dfrac{2(x-a)}{(b-a)(c-a)} & a\le x< c \\[0.6em] \dfrac{2(b-x)}{(b-a)(b-c)} & c\le x\le b \end{cases} \\[0.4em]
\mathbb{E}(X) &= \frac{a+b+c}{3} \\[0.4em]
\mathbb{V}(X) &= \frac{a^2+b^2+c^2-ab-ac-bc}{18}
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile.toFixed(2)})`} | ${cdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/triangular-distribution")}

</div>

</div>
