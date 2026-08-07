---
title: Bayesian Learning
toc: false
footer: false
---

```js
import jStat from "npm:jstat";
import {mvcolors} from "./components/mvcolors.js";
```

<div class="hero">
  <h1>Bayesian Learning</h1>
  <h2>An interactive companion to the book <a href="https://mattiasvillani.com/BayesianLearningBook/">Bayesian Learning</a></h2>
</div>

<div class="grid grid-cols-3">
  <a href="./conjugate-analysis/" class="card hero-card" style="display:block; text-decoration:none; color:inherit;">
    <h2>Conjugate Analysis</h2>
    <span>Prior-to-posterior updating for conjugate models.</span>
  </a>
  <a href="./distributions/" class="card hero-card" style="display:block; text-decoration:none; color:inherit;">
    <h2>Distributions</h2>
    <span>Interactive explorers for probability distributions.</span>
  </a>
  <a href="./data-stories/internet-speed-data" class="card hero-card" style="display:block; text-decoration:none; color:inherit;">
    <h2>Data stories</h2>
    <span>Full worked examples applying Bayesian inference to real data.</span>
  </a>
</div>

<div class="card" style="margin-top: 2rem;">

<div style="display: flex; gap: 2rem; flex-wrap: wrap;">
  <div>
    <b>Data</b>
    ${heroNInput}
    ${heroSInput}
  </div>
  <div>
    <b>Prior</b>
    ${heroInput}
  </div>
</div>

```js
const heroNInput = Inputs.range([1, 100], {value: 10, step: 1, label: tex`n`});
const heroN = view(heroNInput);
```

```js
const heroSInput = Inputs.range([0, heroN], {value: 7, step: 1, label: tex`s`});
const heroS = view(heroSInput);
```

```js
const heroInput = Inputs.form([
  Inputs.range([0.5, 10], {value: 3, step: 0.1, label: tex`\alpha`}),
  Inputs.range([0.5, 10], {value: 2, step: 0.1, label: tex`\beta`})
]);
const heroParams = view(heroInput);
```

```js
const heroF = heroN - heroS;
const heroThetas = d3.range(0.001, 1, 0.001);
const heroDd = [
  ...heroThetas.map((theta) => ({theta, pdf: jStat.beta.pdf(theta, heroParams[0], heroParams[1]), type: "prior"})),
  ...heroThetas.map((theta) => ({theta, pdf: jStat.beta.pdf(theta, heroS, heroF), type: "likelihood"})),
  ...heroThetas.map((theta) => ({theta, pdf: jStat.beta.pdf(theta, heroParams[0] + heroS, heroParams[1] + heroF), type: "posterior"}))
];
```

```js
Plot.plot({
  width: Math.min(880, width),
  height: 260,
  color: {legend: true, domain: ["prior", "likelihood", "posterior"], range: [mvcolors[1], mvcolors[0], mvcolors[2]]},
  x: {domain: [0, 1], label: "θ"},
  y: {axis: false},
  marks: [
    Plot.ruleY([0]),
    Plot.line(heroDd, {x: "theta", y: "pdf", stroke: "type", strokeWidth: 2.5})
  ]
})
```

</div>

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 1.5rem 0 3rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 0.5rem 0 1rem;
  padding: 0.5rem 0 1rem;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--mv-color-0), var(--mv-color-1), var(--mv-color-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 40em;
  font-size: 18px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

.hero h2 a {
  color: inherit;
  text-decoration: underline;
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 64px;
  }
}

.hero-card {
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.hero-card h2 {
  font-weight: 700;
}

.hero-card:hover {
  transform: translateY(-2px);
  border-color: var(--theme-foreground-focus);
}

</style>
