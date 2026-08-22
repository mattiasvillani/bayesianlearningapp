---
title: Bivariate normal
toc: false
---

# Bivariate normal distribution

```js
import * as math from "npm:mathjs";
import Plotly from "npm:plotly.js-dist-min";
import {notebookLink} from "../components/notebookLink.js";
import {hexbinGrid, densityLegend, themeColor} from "../components/functionLibrary.js";
import {createFreezeState, resolveDomain} from "../components/freezeAxis.js";
```

```js
function mvnpdf(x, mu, Sigma) {
  const p = mu.length;
  return (2 * Math.PI) ** (-p / 2) * math.det(Sigma) ** -0.5 *
    math.exp(-0.5 * math.multiply(math.multiply(math.transpose(math.subtract(x, mu)), math.inv(Sigma)), math.subtract(x, mu)));
}

// Exact boundary of the region containing probability mass p, via the
// Cholesky factor of Sigma (Sigma = L L^T with L = [[s1,0],[rho*s2, s2*sqrt(1-rho^2)]]).
// For a bivariate normal, {x : (x-mu)'Sigma^-1(x-mu) <= c} has probability
// 1 - exp(-c/2), so c = -2*log(1-p).
function mvnEllipse(mu, sigma1, sigma2, rho, p, n = 100) {
  const c = Math.sqrt(-2 * Math.log(1 - p));
  const theta = d3.range(0, n + 1).map((i) => (2 * Math.PI * i) / n);
  const x1 = theta.map((t) => mu[0] + c * sigma1 * Math.cos(t));
  const x2 = theta.map((t) => mu[1] + c * (rho * sigma2 * Math.cos(t) + sigma2 * Math.sqrt(1 - rho * rho) * Math.sin(t)));
  return {x1, x2};
}

const mu = [param[0], param[1]];
const sigma1 = param[2];
const sigma2 = param[3];
const rho = param[4];
const Sigma = [[sigma1 ** 2, rho * sigma1 * sigma2], [rho * sigma1 * sigma2, sigma2 ** 2]];

const x1DomainDynamic = [mu[0] - 4 * sigma1, mu[0] + 4 * sigma1];
const x2DomainDynamic = [mu[1] - 4 * sigma2, mu[1] + 4 * sigma2];
const x1Domain = resolveDomain(frozenStateX1, freezeAxes, x1DomainDynamic);
const x2Domain = resolveDomain(frozenStateX2, freezeAxes, x2DomainDynamic);

const resolution = 50;
const mvnormal_on_grid = hexbinGrid(resolution, x1Domain, x2Domain, (x) => mvnpdf(x, mu, Sigma));

const surfaceResolution = 40;
const x1vals = d3.range(x1Domain[0], x1Domain[1], (x1Domain[1] - x1Domain[0]) / surfaceResolution);
const x2vals = d3.range(x2Domain[0], x2Domain[1], (x2Domain[1] - x2Domain[0]) / surfaceResolution);
const zmatrix = x2vals.map((x2) => x1vals.map((x1) => mvnpdf([x1, x2], mu, Sigma)));
const pdfDomain = [0, d3.max(zmatrix.flat())];

const probLevels = [0.5, 0.75, 0.9, 0.95, 0.99];
const pdfLevels = probLevels.map((p) => pdfDomain[1] * (1 - p)).sort((a, b) => a - b);
```

```js
const frozenStateX1 = createFreezeState();
const frozenStateX2 = createFreezeState();
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card param-card">

```js
const param = view(Inputs.form([
  Inputs.range([-1, 1], {label: tex`\mu_1`, step: 0.1, value: 0}),
  Inputs.range([-1, 1], {label: tex`\mu_2`, step: 0.1, value: 0}),
  Inputs.range([0.1, 2], {label: tex`\sigma_1`, step: 0.1, value: 1}),
  Inputs.range([0.1, 2], {label: tex`\sigma_2`, step: 0.1, value: 1}),
  Inputs.range([-0.99, 0.99], {label: tex`\rho`, step: 0.01, value: 0})
]));
```

</div>

<div class="card" style="padding-top: 0.25rem;">

```js
const freezeInput = Inputs.toggle({label: "Freeze axes", value: true});
const freezeAxes = view(freezeInput);
```

```js
const viewInput = Inputs.radio(["Contour plot", "Surface plot"], {value: "Contour plot", label: "View:"});
const viewMode = view(viewInput);
```

<div class="surface-col">

```js
viewMode === "Surface plot"
  ? (async () => {
      // The div we create below is detached (0x0) at the moment newPlot runs, so
      // autosize/responsive can't measure a real container yet and briefly
      // render at Plotly's hardcoded default size before a later resize
      // corrects it — a visible flash. Measure the already-mounted static
      // wrapper directly for the true size instead.
      const host = document.querySelector(".surface-col");
      const plotSize = Math.round(host?.getBoundingClientRect().width || 500);

      const div = document.createElement("div");
      div.style.width = `${plotSize}px`;
      div.style.height = `${plotSize}px`;

      const background = themeColor("--theme-background-a", "#ffffff");
      const foreground = themeColor("--theme-foreground", "#1b1e23");

      const ellipseTraces = probLevels.map((p) => {
        const {x1, x2} = mvnEllipse(mu, sigma1, sigma2, rho, p);
        return {
          type: "scatter3d",
          mode: "lines",
          x: x1,
          y: x2,
          z: x1.map(() => 0),
          line: {color: "black", width: 3},
          showlegend: false,
          hoverinfo: "skip"
        };
      });

      // Plotly interpolates linearly between colorscale stops, so a plain
      // 2-stop scale spends almost all visible color near the peak (density
      // decays fast). Using many stops positioned at sqrt(t) approximates a
      // sqrt-scaled color mapping, stretching contrast across low density.
      const colorscale = d3.range(0, 1.001, 0.05).map((t) => [t, d3.interpolateRgb(background, "#08306b")(Math.sqrt(t))]);

      await Plotly.newPlot(div, [{
        type: "surface",
        x: x1vals,
        y: x2vals,
        z: zmatrix,
        opacity: 1,
        colorscale,
        showscale: false
      }, ...ellipseTraces], {
        width: plotSize,
        height: plotSize,
        margin: {l: 0, r: 0, t: 0, b: 0},
        paper_bgcolor: "rgba(0,0,0,0)",
        scene: {
          xaxis: {title: {text: "x₁", font: {size: 12, color: foreground}}, tickfont: {size: 11, color: foreground}, color: foreground, gridcolor: foreground, showbackground: false, showgrid: false, autorange: "reversed"},
          yaxis: {title: {text: "x₂", font: {size: 12, color: foreground}}, tickfont: {size: 11, color: foreground}, color: foreground, gridcolor: foreground, showbackground: false, showgrid: false, autorange: "reversed"},
          zaxis: {title: {text: "f(x)", font: {size: 12, color: foreground}}, tickfont: {size: 11, color: foreground}, color: foreground, gridcolor: foreground, showbackground: false, showgrid: false, range: [-0.05 * pdfDomain[1], pdfDomain[1] * 1.05]}
        }
      }, {displayModeBar: false});

      return div;
    })()
  : Plot.plot({
      width: Math.round(document.querySelector(".surface-col")?.getBoundingClientRect().width || 500),
      height: Math.round(document.querySelector(".surface-col")?.getBoundingClientRect().width || 500),
      x: {label: "x₁", domain: x1Domain},
      y: {label: "x₂", domain: x2Domain},
      color: {type: "sqrt", range: [themeColor("--theme-background-a", "#ffffff"), "#08306b"], domain: pdfDomain, legend: false},
      marks: [
        Plot.contour(mvnormal_on_grid, {
          filter: (d) => d.pdf > Number.EPSILON, x: "x1", y: "x2", fill: "pdf", stroke: "black",
          blur: 2, thresholds: pdfLevels
        }),
        Plot.ruleY([x2Domain[0]], {stroke: "currentColor"}),
        Plot.ruleX([x1Domain[0]], {stroke: "currentColor"})
      ]
    })
```

</div>

```js
densityLegend(pdfDomain, {orientation: "horizontal", length: width, color: "#08306b", label: "pdf", scale: "sqrt", tickFontSize: "13px", labelFontSize: "14px"})
```

<div style="margin-top: -0.75rem; font-size: 13px;">${freezeInput}</div>

</div>

</div>

<div class="dist-side">

<div class="card properties-card">

### Properties

```tex
\begin{aligned}
&f(x_1, x_2) = c\cdot\exp\Bigg(-\frac{1}{2(1-\rho^2)}g(x_1,x_2)\Bigg) \\[0.4em]
&c = \frac{1}{2\pi\sigma_1\sigma_2\sqrt{1-\rho^2}} \\[0.4em]
& g(x_1,x_2) = \frac{(x_1-\mu_1)^2}{\sigma_1^2} + \frac{(x_2-\mu_2)^2}{\sigma_2^2} - \frac{2\rho(x_1-\mu_1)(x_2-\mu_2)}{\sigma_1\sigma_2} 
\end{aligned}
```

```tex
\begin{aligned}
&\mathbb{E}(X_1) = \mu_1, \quad \mathbb{E}(X_2) = \mu_2 \\[0.4em]
&\mathbb{S}(X_1) = \sigma_1, \quad \mathbb{S}(X_2) = \sigma_2 \\[0.4em]
&\mathrm{Corr}(X_1, X_2) = \rho
\end{aligned}
```

</div>

<div class="card numerical-properties-card">

### Numerical properties

```js
display(tex.block`
\begin{aligned}
&\mathbb{E}(X_1) = ${mu[0].toPrecision(2)}, \quad \mathbb{E}(X_2) = ${mu[1].toPrecision(2)} \\[0.4em]
&\mathbb{S}(X_1) = ${sigma1.toPrecision(3)}, \quad \mathbb{S}(X_2) = ${sigma2.toPrecision(3)} \\[0.4em]
&\mathrm{Cov}(X_1, X_2) = ${(rho * sigma1 * sigma2).toPrecision(3)}
\end{aligned}
`);
```

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/multivariate-normal-distribution")}

</div>

</div>

<style>

.param-card input[type="range"] {
  margin-left: 0.35rem;
}

.properties-card .katex {
  font-size: 0.95em;
}

.properties-card .katex-display,
.numerical-properties-card .katex-display,
.properties-card .katex-display > .katex,
.numerical-properties-card .katex-display > .katex {
  text-align: left;
}

</style>
