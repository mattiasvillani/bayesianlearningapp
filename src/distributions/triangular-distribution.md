---
title: Triangular
toc: false
---

# Triangular distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const [a, b, c, quantile] = params;

const mean = (a + b + c) / 3;
const variance = (a ** 2 + b ** 2 + c ** 2 - a * b - a * c - b * c) / 18;

const pdf = d3.range(-5, 5, 0.01).map((x) => ({x, pdf: jStat.triangular.pdf(x, a, b, c)}));
const cdf = jStat.triangular.cdf(quantile, a, b, c);
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

<div class="card">

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true},
  y: {label: "f(x)"},
  marks: [
    Plot.ruleY([0]),
    Plot.line(pdf, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdf, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

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
