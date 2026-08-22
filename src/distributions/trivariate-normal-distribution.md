---
title: Trivariate normal
toc: false
---

# Trivariate normal distribution

```js
import Plotly from "npm:plotly.js-dist-min";
import jStat from "npm:jstat";
import {notebookLink} from "../components/notebookLink.js";
import {themeColor} from "../components/functionLibrary.js";
import {createFreezeState, resolveDomain} from "../components/freezeAxis.js";
```

```js
function mvnpdf3(x, mu, Sigma) {
  const dx0 = x[0] - mu[0], dx1 = x[1] - mu[1], dx2 = x[2] - mu[2];
  const [[s00, s01, s02], [s10, s11, s12], [s20, s21, s22]] = Sigma;
  const det = s00 * (s11 * s22 - s12 * s21) - s01 * (s10 * s22 - s12 * s20) + s02 * (s10 * s21 - s11 * s20);
  const inv00 = (s11 * s22 - s12 * s21) / det;
  const inv01 = (s02 * s21 - s01 * s22) / det;
  const inv02 = (s01 * s12 - s02 * s11) / det;
  const inv11 = (s00 * s22 - s02 * s20) / det;
  const inv12 = (s02 * s10 - s00 * s12) / det;
  const inv22 = (s00 * s11 - s01 * s10) / det;
  const quad = dx0 * (inv00 * dx0 + inv01 * dx1 + inv02 * dx2)
    + dx1 * (inv01 * dx0 + inv11 * dx1 + inv12 * dx2)
    + dx2 * (inv02 * dx0 + inv12 * dx1 + inv22 * dx2);
  return (2 * Math.PI) ** -1.5 * det ** -0.5 * Math.exp(-0.5 * quad);
}

// Lower-triangular Cholesky factor of a 3x3 symmetric positive-definite matrix.
function cholesky3(Sigma) {
  const [[s00, s01, s02], [, s11, s12], [, , s22]] = Sigma;
  const l00 = Math.sqrt(s00);
  const l10 = s01 / l00;
  const l20 = s02 / l00;
  const l11 = Math.sqrt(s11 - l10 * l10);
  const l21 = (s12 - l20 * l10) / l11;
  const l22 = Math.sqrt(s22 - l20 * l20 - l21 * l21);
  return [[l00, 0, 0], [l10, l11, 0], [l20, l21, l22]];
}

const mu = [mu1, mu2, mu3];
const probLevel = probOuter;
const probLevel2 = probInner;

const Sigma = [
  [sigma1 ** 2, rho12 * sigma1 * sigma2, rho13 * sigma1 * sigma3],
  [rho12 * sigma1 * sigma2, sigma2 ** 2, rho23 * sigma2 * sigma3],
  [rho13 * sigma1 * sigma3, rho23 * sigma2 * sigma3, sigma3 ** 2]
];
// A 3x3 correlation-based covariance always has positive leading 1x1/2x2
// minors when each |rho| < 1, so det(Sigma) > 0 alone is sufficient here
// for positive-definiteness (Sylvester's criterion).
const detSigma = Sigma[0][0] * (Sigma[1][1] * Sigma[2][2] - Sigma[1][2] * Sigma[2][1])
  - Sigma[0][1] * (Sigma[1][0] * Sigma[2][2] - Sigma[1][2] * Sigma[2][0])
  + Sigma[0][2] * (Sigma[1][0] * Sigma[2][1] - Sigma[1][1] * Sigma[2][0]);
const isValid = detSigma > 1e-9;

const x1DomainDynamic = [mu[0] - 4 * sigma1, mu[0] + 4 * sigma1];
const x2DomainDynamic = [mu[1] - 4 * sigma2, mu[1] + 4 * sigma2];
const x3DomainDynamic = [mu[2] - 4 * sigma3, mu[2] + 4 * sigma3];
const x1Domain = resolveDomain(frozenStateX1, freezeAxes, x1DomainDynamic);
const x2Domain = resolveDomain(frozenStateX2, freezeAxes, x2DomainDynamic);
const x3Domain = resolveDomain(frozenStateX3, freezeAxes, x3DomainDynamic);

// Exact ellipsoid boundary for the region containing probability mass p:
// {x : (x-mu)'Sigma^-1(x-mu) <= c} has probability P(chi^2_3 <= c).
function mvnEllipsoid3(mu, Sigma, p, res = 36, scaleFactor = 1) {
  const L = cholesky3(Sigma);
  const scale = scaleFactor * Math.sqrt(jStat.chisquare.inv(p, 3));
  const X = [];
  const Y = [];
  const Z = [];
  for (let i = 0; i <= res; i++) {
    const theta = (Math.PI * i) / res;
    const rowX = [];
    const rowY = [];
    const rowZ = [];
    for (let j = 0; j <= res; j++) {
      const phi = (2 * Math.PI * j) / res;
      const u0 = Math.sin(theta) * Math.cos(phi);
      const u1 = Math.sin(theta) * Math.sin(phi);
      const u2 = Math.cos(theta);
      rowX.push(mu[0] + scale * L[0][0] * u0);
      rowY.push(mu[1] + scale * (L[1][0] * u0 + L[1][1] * u1));
      rowZ.push(mu[2] + scale * (L[2][0] * u0 + L[2][1] * u1 + L[2][2] * u2));
    }
    X.push(rowX);
    Y.push(rowY);
    Z.push(rowZ);
  }
  return {X, Y, Z};
}

const ellipsoid = isValid ? mvnEllipsoid3(mu, Sigma, probLevel) : null;
const ellipsoid2 = isValid ? mvnEllipsoid3(mu, Sigma, probLevel2) : null;


// A handful of meridian/parallel lines from a slightly larger ellipsoid
// (so they sit just outside the opaque surface, avoiding z-fighting),
// giving the classic dashed lat/long wireframe look on a solid ellipsoid.
const wireframeRes = 36;
const meridianCount = 8;
const parallelCount = 4;
function wireframeLines(p) {
  const wf = mvnEllipsoid3(mu, Sigma, p, wireframeRes, 1.01);
  const meridians = d3.range(meridianCount).map((k) => {
    const j = Math.round((k / meridianCount) * wireframeRes);
    return {x: wf.X.map((row) => row[j]), y: wf.Y.map((row) => row[j]), z: wf.Z.map((row) => row[j])};
  });
  const parallels = d3.range(1, parallelCount + 1).map((k) => {
    const i = Math.round((k / (parallelCount + 1)) * wireframeRes);
    return {x: wf.X[i], y: wf.Y[i], z: wf.Z[i]};
  });
  return [...meridians, ...parallels];
}
const outerWireframe = isValid ? wireframeLines(probLevel) : [];
const innerWireframe = isValid ? wireframeLines(probLevel2) : [];
```

```js
const frozenStateX1 = createFreezeState();
const frozenStateX2 = createFreezeState();
const frozenStateX3 = createFreezeState();
```

```js
// Plain object, not a reactive param — survives across slider-driven
// re-renders (each of which throws away and rebuilds the whole Plotly
// figure), so a legend click stays applied when a slider moves.
const legendState = {outer: true, inner: true};
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card param-card">

```js
const mu1Input = Inputs.range([-1, 1], {label: tex`\mu_1`, step: 0.1, value: 0});
const mu2Input = Inputs.range([-1, 1], {label: tex`\mu_2`, step: 0.1, value: 0});
const mu3Input = Inputs.range([-1, 1], {label: tex`\mu_3`, step: 0.1, value: 0});
const mu1 = view(mu1Input);
const mu2 = view(mu2Input);
const mu3 = view(mu3Input);
```

<div class="grid grid-cols-3" style="gap: 0 1rem; margin: 0;">
  <div>${mu1Input}</div>
  <div>${mu2Input}</div>
  <div>${mu3Input}</div>
</div>

```js
const sigma1Input = Inputs.range([0.1, 2], {label: tex`\sigma_1`, step: 0.1, value: 1});
const sigma2Input = Inputs.range([0.1, 2], {label: tex`\sigma_2`, step: 0.1, value: 1});
const sigma3Input = Inputs.range([0.1, 2], {label: tex`\sigma_3`, step: 0.1, value: 1});
const sigma1 = view(sigma1Input);
const sigma2 = view(sigma2Input);
const sigma3 = view(sigma3Input);
```

<div class="grid grid-cols-3" style="gap: 0 1rem; margin: 0;">
  <div>${sigma1Input}</div>
  <div>${sigma2Input}</div>
  <div>${sigma3Input}</div>
</div>

```js
const rho12Input = Inputs.range([-0.99, 0.99], {label: tex`\rho_{12}`, step: 0.01, value: 0});
const rho13Input = Inputs.range([-0.99, 0.99], {label: tex`\rho_{13}`, step: 0.01, value: 0});
const rho23Input = Inputs.range([-0.99, 0.99], {label: tex`\rho_{23}`, step: 0.01, value: 0});
const rho12 = view(rho12Input);
const rho13 = view(rho13Input);
const rho23 = view(rho23Input);
```

<div class="grid grid-cols-3" style="gap: 0 1rem; margin: 0;">
  <div>${rho12Input}</div>
  <div>${rho13Input}</div>
  <div>${rho23Input}</div>
</div>

```js
const probOuterInput = Inputs.range([0.76, 0.99], {label: "probability outer ellipsoid", step: 0.01, value: 0.95});
const probInnerInput = Inputs.range([0.01, 0.75], {label: "probability inner ellipsoid", step: 0.01, value: 0.5});
const probOuter = view(probOuterInput);
const probInner = view(probInnerInput);
```

<div class="prob-row" style="display: flex; flex-direction: column; gap: 0; margin: 0;">
  <div>${probOuterInput}</div>
  <div>${probInnerInput}</div>
</div>

</div>

<div class="card" style="padding-top: 0.25rem;">

```js
const freezeInput = Inputs.toggle({label: "Freeze axes", value: true});
const freezeAxes = view(freezeInput);
```

```js
const showTooltip = view(Inputs.toggle({label: "show tooltip", value: false}));
```

<div style="margin-top: -0.5rem; font-size: 13px;">${freezeInput}</div>

<div class="surface-col" style="margin-top: -1rem;">

```js
(async () => {
  const host = document.querySelector(".surface-col");
  const plotSize = Math.round(host?.getBoundingClientRect().width || 500);
  const plotHeight = Math.round(plotSize * 0.7);

  const div = document.createElement("div");
  div.style.width = `${plotSize}px`;
  div.style.height = `${plotHeight}px`;

  const foreground = themeColor("--theme-foreground", "#1b1e23");

  if (!isValid) {
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.style.textAlign = "center";
    div.style.color = foreground;
    div.style.padding = "1rem";
    div.textContent = "This combination of ρ₁₂, ρ₁₃, ρ₂₃ is not a valid correlation matrix (not positive definite). Try smaller correlations.";
    return div;
  }

  const background = themeColor("--theme-background-a", "#ffffff");
  const lightBlue = d3.interpolateRgb(background, "#08306b")(0.35);
  const color2 = themeColor("--mv-color-2", "#B85450");

  const outerLineTraces = outerWireframe.map(({x, y, z}) => ({
    type: "scatter3d",
    mode: "lines",
    x, y, z,
    line: {color: "gray", width: 2},
    legendgroup: "outer",
    showlegend: false,
    hoverinfo: "skip",
    visible: legendState.outer
  }));

  // Shown only when the outer ellipsoid is hidden via the legend and the
  // inner one is the sole ellipsoid left visible.
  const innerLinesVisible = !legendState.outer && legendState.inner;
  const innerLineTraces = innerWireframe.map(({x, y, z}) => ({
    type: "scatter3d",
    mode: "lines",
    x, y, z,
    line: {color: color2, width: 2},
    legendgroup: "inner",
    showlegend: false,
    hoverinfo: "skip",
    visible: innerLinesVisible
  }));

  // An invisible dense point cloud spanning the whole box, so hovering
  // anywhere in 3D space (not just on the ellipsoid) reports the pdf there.
  const probeTraces = [];
  if (showTooltip) {
    const res = 20;
    const px = [], py = [], pz = [], pdfVals = [];
    for (let i = 0; i < res; i++) {
      const x1 = x1Domain[0] + (i / (res - 1)) * (x1Domain[1] - x1Domain[0]);
      for (let j = 0; j < res; j++) {
        const x2 = x2Domain[0] + (j / (res - 1)) * (x2Domain[1] - x2Domain[0]);
        for (let k = 0; k < res; k++) {
          const x3 = x3Domain[0] + (k / (res - 1)) * (x3Domain[1] - x3Domain[0]);
          px.push(x1);
          py.push(x2);
          pz.push(x3);
          pdfVals.push(Math.log(mvnpdf3([x1, x2, x3], mu, Sigma)));
        }
      }
    }
    probeTraces.push({
      type: "scatter3d",
      mode: "markers",
      x: px, y: py, z: pz,
      customdata: pdfVals,
      marker: {size: 4, opacity: 0, color: foreground},
      hovertemplate: "x₁: %{x:.3f}<br>x₂: %{y:.3f}<br>x₃: %{z:.3f}<br>log pdf: %{customdata:.3g}<extra></extra>",
      showlegend: false
    });
  }

  await Plotly.newPlot(div, [{
    type: "surface",
    x: ellipsoid.X, y: ellipsoid.Y, z: ellipsoid.Z,
    colorscale: [[0, lightBlue], [1, lightBlue]],
    showscale: false,
    contours: {x: {highlight: false}, y: {highlight: false}, z: {highlight: false}},
    hoverinfo: "skip",
    opacity: 0.55,
    name: `Ellipsoid with probability ${probLevel.toFixed(2)}`,
    legendgroup: "outer",
    showlegend: true,
    visible: legendState.outer ? true : "legendonly"
  }, {
    type: "surface",
    x: ellipsoid2.X, y: ellipsoid2.Y, z: ellipsoid2.Z,
    colorscale: [[0, color2], [1, color2]],
    showscale: false,
    hoverinfo: "skip",
    opacity: 0.3,
    name: `Ellipsoid with probability ${probLevel2.toFixed(2)}`,
    legendgroup: "inner",
    showlegend: true,
    visible: legendState.inner ? true : "legendonly"
  }, ...outerLineTraces, ...innerLineTraces, ...probeTraces], {
    width: plotSize,
    height: plotHeight,
    margin: {l: 0, r: 0, t: 0, b: 0},
    showlegend: true,
    legend: {orientation: "h", x: 0, xanchor: "left", y: 1, yanchor: "bottom", font: {color: foreground, size: 11}, bgcolor: "rgba(0,0,0,0)"},
    paper_bgcolor: "rgba(0,0,0,0)",
    scene: {
      xaxis: {title: {text: "x₁", font: {size: 12, color: foreground}}, tickfont: {size: 11, color: foreground}, color: foreground, gridcolor: foreground, showbackground: false, showgrid: false, showspikes: showTooltip, range: x1Domain},
      yaxis: {title: {text: "x₂", font: {size: 12, color: foreground}}, tickfont: {size: 11, color: foreground}, color: foreground, gridcolor: foreground, showbackground: false, showgrid: false, showspikes: showTooltip, range: x2Domain},
      zaxis: {title: {text: "x₃", font: {size: 12, color: foreground}}, tickfont: {size: 11, color: foreground}, color: foreground, gridcolor: foreground, showbackground: false, showgrid: false, showspikes: showTooltip, range: x3Domain}
    }
  }, {displayModeBar: false});

  // Persist legend on/off state across slider-driven re-renders (each of
  // which throws away and rebuilds the whole Plotly figure from scratch),
  // and show the inner ellipsoid's own wireframe once it's the only one left.
  const innerLineStart = 2 + outerLineTraces.length;
  const innerLineIndices = d3.range(innerLineStart, innerLineStart + innerLineTraces.length);
  div.on("plotly_restyle", () => {
    const outerHidden = div.data[0].visible === "legendonly";
    const innerHidden = div.data[1].visible === "legendonly";
    legendState.outer = !outerHidden;
    legendState.inner = !innerHidden;
    const shouldShow = outerHidden && !innerHidden;
    const currentlyShown = div.data[innerLineStart]?.visible !== false;
    if (innerLineIndices.length && shouldShow !== currentlyShown) {
      Plotly.restyle(div, {visible: shouldShow}, innerLineIndices);
    }
  });

  return div;
})()
```

</div>

</div>

</div>

<div class="dist-side">

<div class="card properties-card">

### Properties

```tex
\begin{aligned}
f(\boldsymbol{x}) &= \vert 2\pi\boldsymbol{\Sigma}\vert^{-1/2}\exp\Big(-\frac{1}{2}(\boldsymbol{x}-\boldsymbol{\mu})^\top\boldsymbol{\Sigma}^{-1}(\boldsymbol{x}-\boldsymbol{\mu})\Big) \\[0.4em]
\mathbb{E}(\boldsymbol{x}) &= \boldsymbol{\mu} \\[0.4em]
\mathrm{Cov}(\boldsymbol{x}) &= \begin{pmatrix}\sigma_1^2 & \rho_{12}\sigma_1\sigma_2 & \rho_{13}\sigma_1\sigma_3 \\ \rho_{12}\sigma_1\sigma_2 & \sigma_2^2 & \rho_{23}\sigma_2\sigma_3 \\ \rho_{13}\sigma_1\sigma_3 & \rho_{23}\sigma_2\sigma_3 & \sigma_3^2\end{pmatrix}
\end{aligned}
```

Partitioning ${tex`\boldsymbol{x}`}, ${tex`\boldsymbol{\mu}`} and ${tex`\boldsymbol{\Sigma}`} into subvectors/blocks:

```tex
\boldsymbol{x} = \begin{pmatrix}\boldsymbol{x}_1\\ \boldsymbol{x}_2\end{pmatrix},\quad
\boldsymbol{\mu} = \begin{pmatrix}\boldsymbol{\mu}_1\\ \boldsymbol{\mu}_2\end{pmatrix},\quad
\boldsymbol{\Sigma} = \begin{pmatrix}\boldsymbol{\Sigma}_{11} & \boldsymbol{\Sigma}_{12}\\ \boldsymbol{\Sigma}_{21} & \boldsymbol{\Sigma}_{22}\end{pmatrix}
```

the conditional distribution is

```tex
\begin{aligned}
\boldsymbol{x}_1 \mid \boldsymbol{x}_2 &\sim \mathcal{N}\big(\boldsymbol{\mu}_{1\mid 2},\ \boldsymbol{\Sigma}_{1\mid 2}\big) \\[0.4em]
\boldsymbol{\mu}_{1\mid 2} &= \boldsymbol{\mu}_1 + \boldsymbol{\Sigma}_{12}\boldsymbol{\Sigma}_{22}^{-1}(\boldsymbol{x}_2-\boldsymbol{\mu}_2) \\[0.4em]
\boldsymbol{\Sigma}_{1\mid 2} &= \boldsymbol{\Sigma}_{11}-\boldsymbol{\Sigma}_{12}\boldsymbol{\Sigma}_{22}^{-1}\boldsymbol{\Sigma}_{21}
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  | 1 | 2 | 3 |
|---|---|---|---|
| ${tex`\mathbb{E}(\boldsymbol{x})`} | ${mu[0].toPrecision(3)} | ${mu[1].toPrecision(3)} | ${mu[2].toPrecision(3)} |
| ${tex`\mathbb{S}(\boldsymbol{x})`} | ${sigma1.toPrecision(3)} | ${sigma2.toPrecision(3)} | ${sigma3.toPrecision(3)} |

<div style="text-align: left;">

```js
display(tex.block`
\mathrm{Cov}(\boldsymbol{x}) = \left(\begin{array}{rrr}
${Sigma[0][0].toFixed(3)} & ${Sigma[0][1].toFixed(3)} & ${Sigma[0][2].toFixed(3)} \\
${Sigma[1][0].toFixed(3)} & ${Sigma[1][1].toFixed(3)} & ${Sigma[1][2].toFixed(3)} \\
${Sigma[2][0].toFixed(3)} & ${Sigma[2][1].toFixed(3)} & ${Sigma[2][2].toFixed(3)}
\end{array}\right)
`);
```

</div>

|  |  |
|---|---|
| Valid correlation matrix | ${isValid ? "yes" : "no"} |

</div>

</div>

</div>

<style>

.param-card input[type="range"] {
  margin-left: 0.35rem;
}

.param-card .prob-row .inputs-3a86ea {
  --label-width: 150px;
  --input-width: 140px;
}

.param-card .grid-cols-3 .inputs-3a86ea {
  --label-width: 22px;
  --input-width: 160px;
}

.properties-card .katex {
  font-size: 0.95em;
}

</style>
