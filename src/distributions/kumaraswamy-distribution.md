---
title: Kumaraswamy
toc: false
---

# Kumaraswamy distribution

```js
import jStat from "npm:jstat";
import * as math from "npm:mathjs";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0, 10], {value: 4, step: 0.1, label: "a"}),
  Inputs.range([0, 10], {value: 2, step: 0.1, label: "b"}),
  Inputs.range([0, 1], {value: 0.5, step: 0.01, label: "Quantile:"})
]));
```

```js
const [a, b, quantile] = params;

const mean = (b * math.gamma(b) * math.gamma(1 + 1 / a)) / math.gamma(1 + 1 / a + b);
const variance = b * jStat.betafn(1 + 2 / a, b) - b ** 2 * jStat.betafn(1 + 1 / a, b) ** 2;

const pdfdata = d3.range(0, 1, 0.001).map((x) => ({x, pdf: jStat.kumaraswamy.pdf(x, a, b)}));
const cdf = jStat.kumaraswamy.cdf(quantile, a, b);
```

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true},
  y: {label: "f(x)"},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(pdfdata, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdfdata, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= a b\, x^{a-1}(1-x^a)^{b-1} \\[0.4em]
\mathbb{E}(X) &= \frac{b\,\Gamma(1+1/a)\,\Gamma(b)}{\Gamma(1+1/a+b)} \\[0.4em]
\mathbb{V}(X) &= b\,\Beta\big(1+\tfrac{2}{a},b\big) - b^2\Beta\big(1+\tfrac{1}{a},b\big)^2
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

${notebookLink("https://observablehq.com/@mattiasvillani/kumaraswamy-distribution")}

</div>

</div>
