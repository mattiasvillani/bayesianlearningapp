import * as math from "npm:mathjs";

// Exact autocorrelation function of a causal, stationary ARMA(p, q) process
//   X_t = phi_1 X_{t-1} + ... + phi_p X_{t-p} + eps_t + theta_1 eps_{t-1} + ... + theta_q eps_{t-q}
// computed via the discrete Lyapunov equation for the process's companion-form
// state-space representation (Hamilton, 1994, ch. 13). Pass phi = [] for a pure
// MA(q) and theta = [] for a pure AR(p). Returns [rho(0), rho(1), ..., rho(maxLag)]
// with rho(0) = 1 always — the innovation variance cancels out and is not needed.
export function armaACF(phi, theta, maxLag) {
  const r = Math.max(phi.length, theta.length + 1, 1);
  const phiPad = Array.from({length: r}, (_, i) => phi[i] ?? 0);
  const thetaPad = [1, ...Array.from({length: r - 1}, (_, i) => theta[i] ?? 0)];

  // Companion-form state-space representation: alpha_t = F alpha_{t-1} + R eps_t,
  // X_t = alpha_t[0].
  const F = Array.from({length: r}, (_, i) =>
    Array.from({length: r}, (_, j) => (j === 0 ? phiPad[i] : i === j - 1 ? 1 : 0))
  );
  const R = thetaPad;

  // Stationary state covariance Sigma solves Sigma = F Sigma F' + R R' (up to the
  // innovation variance, which cancels in the final ratio). Solved via
  // vec(Sigma) = (I - F⊗F)^-1 vec(R R'); valid here without transposing F in the
  // Kronecker product because R R' and the resulting Sigma are symmetric.
  const RRt = R.map((ri) => R.map((rj) => ri * rj));
  const FkronF = math.kron(F, F);
  const I = math.identity(r * r).toArray();
  const vecSigma = math.lusolve(math.subtract(I, FkronF), RRt.flat()).map((row) => row[0]);
  const Sigma = Array.from({length: r}, (_, i) => vecSigma.slice(i * r, i * r + r));

  const gamma = [Sigma[0][0]];
  let Fpow = F;
  for (let h = 1; h <= maxLag; h++) {
    gamma.push(math.multiply(Fpow, Sigma)[0][0]);
    Fpow = math.multiply(Fpow, F);
  }
  return gamma.map((g) => g / gamma[0]);
}
