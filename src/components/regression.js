import * as math from "npm:mathjs";
import jStat from "npm:jstat";

// One-hot encode a categorical array, dropping a reference category (default:
// the smallest value) to avoid collinearity with the intercept.
export function oneHot(x, referenceCategory = "first") {
  let categories = [...new Set(x)].sort();
  const ref = referenceCategory === "first" ? categories[0] : referenceCategory;
  categories = categories.filter((c) => c !== ref);
  return x.map((xi) => categories.map((c) => (xi === c ? 1 : 0)));
}

// Column-bind plain 2D arrays (arrays of row arrays) sharing the same number of rows.
export function cbind(...matrices) {
  const nrows = matrices[0].length;
  const rows = [];
  for (let i = 0; i < nrows; i++) {
    rows.push(matrices.reduce((row, m) => row.concat(m[i]), []));
  }
  return rows;
}

function quadForm(x, A) {
  // x'Ax
  return math.dot(math.multiply(A, x), x);
}

// Ordinary least squares for y = Xβ + ε.
export function leastSquares(y, X) {
  const n = X.length;
  const p = X[0].length;
  const Xt = math.transpose(X);
  const XtXinv = math.inv(math.multiply(Xt, X));
  const betaHat = math.multiply(XtXinv, math.multiply(Xt, y));
  const residuals = math.subtract(y, math.multiply(X, betaHat));
  const s2 = math.dot(residuals, residuals) / (n - p);
  const covBeta = math.multiply(s2, XtXinv);
  return {betaHat, covBeta};
}

// Zellner's g-prior precision block for a set of covariates: Ω0 = (κ0/n)·X'X.
export function zellnerPrior(kappa0, X) {
  const n = X.length;
  return math.multiply(kappa0 / n, math.multiply(math.transpose(X), X));
}

// Ridge (independence) prior precision block: Ω0 = κ0·I_p.
export function ridgePrior(kappa0, p) {
  return math.multiply(kappa0, math.identity(p).toArray());
}

// Combine an independent scalar Normal prior for the intercept, β0 | σ² ~ N(interceptMu0, σ²/interceptOmega0),
// with a prior precision block for the remaining coefficients into one block-diagonal (μ0, Ω0) pair.
// The zero cross-terms give exact prior independence between the intercept and the other coefficients.
export function blockDiagonalPrior(interceptMu0, interceptOmega0, restOmega0) {
  const pRest = restOmega0.length;
  const p = pRest + 1;
  const mu0 = new Array(p).fill(0);
  mu0[0] = interceptMu0;
  const Omega0 = Array.from({length: p}, () => new Array(p).fill(0));
  Omega0[0][0] = interceptOmega0;
  for (let i = 0; i < pRest; i++) {
    for (let j = 0; j < pRest; j++) {
      Omega0[i + 1][j + 1] = restOmega0[i][j];
    }
  }
  return {mu0, Omega0};
}

// Conjugate Normal-Inv-χ² posterior for the Gaussian linear regression
// β|σ² ~ N(μ0, σ²Ω0⁻¹), σ² ~ Inv-χ²(ν0, σ0²).
export function bayesLinReg(y, X, mu0, Omega0, nu0, sigma20) {
  const n = X.length;
  const Xt = math.transpose(X);
  const XtX = math.multiply(Xt, X);
  const betaHat = math.multiply(math.inv(XtX), math.multiply(Xt, y));
  const nuN = nu0 + n;
  const OmegaN = math.add(XtX, Omega0);
  const invOmegaN = math.inv(OmegaN);
  const muN = math.multiply(invOmegaN, math.add(math.multiply(XtX, betaHat), math.multiply(Omega0, mu0)));
  const residuals = math.subtract(y, math.multiply(X, betaHat));
  const RSS = math.dot(residuals, residuals);
  const SSbetaOls = quadForm(math.subtract(muN, betaHat), XtX);
  const SSbetaPrior = quadForm(math.subtract(muN, mu0), Omega0);
  const sigma2N = (nu0 * sigma20 + RSS + SSbetaOls + SSbetaPrior) / nuN;
  return {muN, invOmegaN, nuN, sigma2N};
}

// Student-t density in location-scale form.
export function studentTPdf(x, mu, scale, df) {
  return jStat.studentt.pdf((x - mu) / scale, df) / scale;
}

// Marginal posterior t_ν(μ_j, σ_j²) curves for each named coefficient, β_j|y.
export function marginalPosteriors(muVect, sigmaVect, nu, varnames, nPoints = 200) {
  const rows = [];
  for (let i = 0; i < muVect.length; i++) {
    const mu = muVect[i];
    const sigma = sigmaVect[i];
    const step = (8 * sigma) / nPoints;
    for (let x = mu - 4 * sigma; x <= mu + 4 * sigma; x += step) {
      rows.push({x, pdf: studentTPdf(x, mu, sigma, nu), variable: varnames[i]});
    }
  }
  return rows;
}
