export const CONSENT_STORAGE_KEY = "rombilde-consent";
export const CONSENT_EVENT = "rombilde-consent-changed";

export type ConsentValue = "granted" | "denied";

export function getStoredConsent(): ConsentValue | null {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function setStoredConsent(value: ConsentValue) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // ignorer – f.eks. privat nettlesing der localStorage kan kaste feil
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}
