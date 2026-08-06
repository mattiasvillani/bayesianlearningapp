export default {
  title: "Bayesian Learning",
  pages: [
    {
      name: "Conjugate Analysis",
      open: true,
      pages: [
        {
          name: "Poisson–Gamma (iid Poisson counts)",
          path: "/conjugate-analysis/bayesian-inference-for-iid-poisson-counts"
        }
      ]
    },
    {
      name: "Distributions — Discrete",
      open: false,
      pages: [
        {name: "Bernoulli", path: "/distributions/bernoulli-distribution"},
        {name: "Binomial", path: "/distributions/binomial-distribution"},
        {name: "Beta-Binomial", path: "/distributions/beta-binomial-distribution"},
        {name: "Geometric", path: "/distributions/geometric-distribution"},
        {name: "Hypergeometric", path: "/distributions/hypergeometric-distribution"},
        {name: "Negative Binomial", path: "/distributions/negative-binomial-distribution"},
        {name: "Poisson", path: "/distributions/poisson-distribution"},
        {name: "Poisson-Gamma", path: "/distributions/poisson-gamma-distribution"},
        {name: "Mixture of Poissons", path: "/distributions/mixture-of-poissons"},
        {name: "Skellam", path: "/distributions/skellam-distribution"},
        {name: "Zero-Inflated Poisson", path: "/distributions/zero-inflated-poisson-distribution"},
        {name: "Zipf", path: "/distributions/zipf-distribution"}
      ]
    },
    {
      name: "Distributions — Bounded",
      open: false,
      pages: [
        {name: "Beta", path: "/distributions/beta-distribution"},
        {name: "Beta (three-parameter)", path: "/distributions/three-parameter-beta-distribution"},
        {name: "Beta (four-parameter)", path: "/distributions/four-parameter-beta-distribution"},
        {name: "Kumaraswamy", path: "/distributions/kumaraswamy-distribution"},
        {name: "Logit-normal", path: "/distributions/logit-normal-distribution"},
        {name: "Triangular", path: "/distributions/triangular-distribution"},
        {name: "Uniform", path: "/distributions/uniform-distribution"}
      ]
    },
    {
      name: "Distributions — Positive/Scale",
      open: false,
      pages: [
        {name: "Gamma", path: "/distributions/gamma-distribution"},
        {name: "Inverse Gamma", path: "/distributions/inverse-gamma-distribution"},
        {name: "Exponential", path: "/distributions/exponential-distribution"},
        {name: "Weibull", path: "/distributions/weibull-distribution"},
        {name: "LogNormal", path: "/distributions/lognormal-distribution"},
        {name: "Pareto", path: "/distributions/pareto-distribution"},
        {name: "Chi-squared", path: "/distributions/chi2-distribution"},
        {name: "Non-central Chi-squared", path: "/distributions/non-central-chi2-distribution"},
        {name: "Scaled Inverse Chi-squared", path: "/distributions/scaled-inverse-chi-2-distribution"},
        {name: "Compound-Gamma", path: "/distributions/compound-gamma-distribution"},
        {name: "F", path: "/distributions/f-distribution"},
        {name: "Inverse Gaussian", path: "/distributions/inverse-gaussian-distribution"},
        {name: "Pólya-Gamma", path: "/distributions/polya-gamma-distribution"}
      ]
    },
    {
      name: "Distributions — Real-valued",
      open: false,
      pages: [
        {name: "Normal (Gaussian)", path: "/distributions/normal-gaussian-distribution"},
        {name: "Student-t (standard)", path: "/distributions/student-t-distribution-standard"},
        {name: "Student-t", path: "/distributions/student-t-distribution"},
        {name: "Cauchy", path: "/distributions/cauchy-distribution"},
        {name: "Laplace", path: "/distributions/laplace-distribution"},
        {name: "Logistic", path: "/distributions/logistic-distribution"},
        {name: "Skew-Normal", path: "/distributions/skew-normal-distribution"},
        {name: "Split-Normal", path: "/distributions/split-normal-distribution"},
        {name: "Split-t", path: "/distributions/split-t-distribution"},
        {name: "Gumbel", path: "/distributions/gumbel-distribution"},
        {name: "Generalized Extreme Value", path: "/distributions/generalized-extreme-value-distribution"},
        {name: "Normal Mixture", path: "/distributions/normal-mixture"},
        {name: "Fisher Z", path: "/distributions/z-distribution"},
        {name: "Truncated Normal", path: "/distributions/truncated-normal-distribution"}
      ]
    },
    {
      name: "Distributions — Multivariate & Circular",
      open: false,
      pages: [
        {name: "Multivariate Normal", path: "/distributions/multivariate-normal-distribution"},
        {name: "Dirichlet", path: "/distributions/dirichlet-distribution"},
        {name: "Multivariate logit-normal", path: "/distributions/multivariate-logitnormal-distribution"},
        {name: "Gumbel–Softmax", path: "/distributions/gumbel-softmax-distribution"},
        {name: "von Mises", path: "/distributions/von-mises-distribution"}
      ]
    }
  ],
  header: `
<button id="theme-toggle" type="button" aria-label="Toggle light and dark mode" title="Toggle light/dark mode">
  <svg id="theme-toggle-sun" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="3.2" fill="currentColor"/>
    <g stroke="currentColor" stroke-width="1.3" stroke-linecap="round">
      <line x1="8" y1="0.8" x2="8" y2="2.4"/>
      <line x1="8" y1="13.6" x2="8" y2="15.2"/>
      <line x1="0.8" y1="8" x2="2.4" y2="8"/>
      <line x1="13.6" y1="8" x2="15.2" y2="8"/>
      <line x1="2.6" y1="2.6" x2="3.7" y2="3.7"/>
      <line x1="12.3" y1="12.3" x2="13.4" y2="13.4"/>
      <line x1="2.6" y1="13.4" x2="3.7" y2="12.3"/>
      <line x1="12.3" y1="3.7" x2="13.4" y2="2.6"/>
    </g>
  </svg>
  <svg id="theme-toggle-moon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 9.5A6 6 0 1 1 6.5 2.5a5 5 0 0 0 7 7Z" fill="currentColor"/>
  </svg>
</button>
<script>
(function () {
  var root = document.documentElement;
  var stored = localStorage.getItem("mv-theme");
  if (stored === "light" || stored === "dark") root.setAttribute("data-theme", stored);
  document.addEventListener("click", function (event) {
    if (!event.target.closest("#theme-toggle")) return;
    var current = root.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("mv-theme", next);
  });
})();
</script>`,
  footer: "Bayesian Learning — companion widgets for the BayesBook textbook.",
  toc: false,
  sidebar: true,
  root: "src",
  style: "styles.css"
};
