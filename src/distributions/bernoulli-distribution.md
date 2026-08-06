---
title: Bernoulli
toc: false
---

# Bernoulli distribution

<div class="dist-layout">

<div class="card">

```js
import {mvcolors} from "../components/mvcolors.js";
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

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/bernoulli-distribution" target="_blank" rel="noopener noreferrer">
<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="1.5" width="9" height="13" rx="1.2" stroke="currentColor" stroke-width="1.1"/>
  <line x1="4.2" y1="4.4" x2="8.8" y2="4.4" stroke="currentColor" stroke-width="0.9"/>
  <line x1="4.2" y1="6.6" x2="8.8" y2="6.6" stroke="currentColor" stroke-width="0.9"/>
  <line x1="4.2" y1="8.8" x2="7.2" y2="8.8" stroke="currentColor" stroke-width="0.9"/>
  <circle cx="12.3" cy="12.3" r="2.3" fill="#6C8EBF"/>
  <circle cx="10.4" cy="13.2" r="1.6" fill="#c0a34d"/>
  <circle cx="13.5" cy="13.6" r="1.4" fill="#007878"/>
</svg>
Original notebook ↗
</a>

</div>

</div>
