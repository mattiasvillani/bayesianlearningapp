export function createFreezeState() {
  return {domain: null};
}

// Not Mutable(): a plain shared object survives cell re-runs fine here, and
// Mutable() with no initial value never yields, deadlocking any cell that reads it.
export function resolveDomain(state, frozen, dynamicDomain) {
  if (!frozen || state.domain == null) {
    state.domain = dynamicDomain;
  }
  return frozen ? state.domain : dynamicDomain;
}
