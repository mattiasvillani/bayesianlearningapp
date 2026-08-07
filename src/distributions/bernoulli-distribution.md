---
title: Bernoulli
toc: false
---

# Bernoulli distribution

<div class="dist-layout">

<div class="card">

```js
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const p = view(Inputs.range([0, 1], {value: 0.5, step: 0.01, label: "p"}));
```

```js
Plot.plot({
  x: {label: "x", axis: true, domain: [-0.5, 1.5], ticks: [0, 1], tickFormat: ".0"},
  y: {label: "P(x)", domain: [0, 1.05]},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([-0.5]),
    Plot.ruleX(
      [{x: 0, y: 1 - p}, {x: 1, y: p}],
      {x: "x", y: "y", stroke: mvcolors[0], strokeWidth: 2}
    ),
    Plot.dot([{x: 0, y: 1 - p}, {x: 1, y: p}], {x: "x", y: "y", fill: mvcolors[0], r: 5}),
    Plot.text([{x: 0, y: 1 - p}, {x: 1, y: p}], {x: "x", y: "y", text: "y", dy: -15})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
P(x) &= p^x(1-p)^{1-x}, \ x \in \{0,1\} \\[0.4em]
\mathbb{E}(X) &= p \\[0.4em]
\mathbb{V}(X) &= p(1-p)
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${p.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(p * (1 - p)).toPrecision(3)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/bernoulli-distribution")}

</div>

</div>
