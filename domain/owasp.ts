/**
 * OWASP Top 10 (2021) categories — the value is the category id, the label is
 * the human-friendly name. Storing both lets us render badges and filter by id.
 */
export const OWASP_TOP_10 = {
  A01: "Broken Access Control",
  A02: "Cryptographic Failures",
  A03: "Injection",
  A04: "Insecure Design",
  A05: "Security Misconfiguration",
  A06: "Vulnerable & Outdated Components",
  A07: "Identification & Authentication Failures",
  A08: "Software & Data Integrity Failures",
  A09: "Security Logging & Monitoring Failures",
  A10: "Server-Side Request Forgery (SSRF)",
} as const;

export type OwaspTop10Id = keyof typeof OWASP_TOP_10;

/**
 * OWASP WSTG mapping (Web Security Testing Guide). Not exhaustive — covers the
 * categories used by the seed challenges. Add more as challenges require them.
 */
export const OWASP_WSTG = {
  "WSTG-INPV-01": "Test for Reflected Cross Site Scripting",
  "WSTG-INPV-02": "Test for Stored Cross Site Scripting",
  "WSTG-INPV-05": "Test for SQL Injection",
  "WSTG-INPV-12": "Test for Command Injection",
  "WSTG-INPV-19": "Test for SSRF",
  "WSTG-ATHN-01": "Test for Credentials Transported over an Encrypted Channel",
  "WSTG-ATHN-02": "Test for Default Credentials",
  "WSTG-ATHN-03": "Test for Weak Lockout Mechanism",
  "WSTG-ATHN-07": "Test for Weak Password Policy",
  "WSTG-ATHN-09": "Test for Weak Password Change or Reset Functionalities",
  "WSTG-ATHZ-01": "Test Directory Traversal File Include",
  "WSTG-ATHZ-02": "Test for Bypassing Authorization Schema",
  "WSTG-ATHZ-04": "Test for Insecure Direct Object References",
  "WSTG-SESS-02": "Test for Cookies Attributes",
  "WSTG-SESS-05": "Test for Cross Site Request Forgery",
  "WSTG-CRYP-01": "Test for Weak Transport Layer Security",
  "WSTG-CRYP-03": "Test for Sensitive Information Sent via Unencrypted Channels",
  "WSTG-CRYP-04": "Test for Weak Encryption",
  "WSTG-BUSL-09": "Test Upload of Malicious Files",
  "WSTG-CONF-07": "Test HTTP Strict Transport Security",
  "WSTG-CLNT-09": "Test for Clickjacking",
  "WSTG-CLNT-07": "Test for Cross Origin Resource Sharing",
} as const;

export type OwaspWstgId = keyof typeof OWASP_WSTG;
