/**
 * Coarse course-topic taxonomy used for filtering and badge colouring.
 * Maps roughly onto the TDT4237 syllabus.
 */
export const COURSE_TOPICS = [
  "web-vulnerabilities",
  "authentication",
  "authorization",
  "cryptography",
  "threat-modeling",
  "risk-management",
  "secure-development",
  "microservices-supply-chain",
  "privacy-gdpr",
  "ai-security",
  "security-basics",
] as const;

export type CourseTopic = (typeof COURSE_TOPICS)[number];

export interface CourseTopicMeta {
  readonly id: CourseTopic;
  readonly label: string;
  readonly short: string;
  readonly color: string; // Mantine color name from the NTNU palette
  readonly description: string;
}

export const COURSE_TOPIC_META: Record<CourseTopic, CourseTopicMeta> = {
  "web-vulnerabilities": {
    id: "web-vulnerabilities",
    label: "Web vulnerabilities",
    short: "Web",
    color: "ntnuBlue",
    description: "XSS, SQLi, CSRF, IDOR, SSRF, file upload, cookies, CORS.",
  },
  authentication: {
    id: "authentication",
    label: "Authentication",
    short: "AuthN",
    color: "lightBlue",
    description: "Password hashing, MFA, lockout, sessions, reset flows.",
  },
  authorization: {
    id: "authorization",
    label: "Authorization",
    short: "AuthZ",
    color: "purple",
    description: "RBAC, ABAC, object-level access, privilege escalation.",
  },
  cryptography: {
    id: "cryptography",
    label: "Cryptography",
    short: "Crypto",
    color: "turquoise",
    description: "Symmetric/asymmetric, hashes, MACs, signatures, TLS, OTP.",
  },
  "threat-modeling": {
    id: "threat-modeling",
    label: "Threat modeling",
    short: "Threats",
    color: "magenta",
    description: "STRIDE, DFDs, misuse cases, attack trees, bow-tie.",
  },
  "risk-management": {
    id: "risk-management",
    label: "Risk management",
    short: "Risk",
    color: "orange",
    description: "Likelihood, impact, CVSS, security requirements.",
  },
  "secure-development": {
    id: "secure-development",
    label: "Secure development",
    short: "SDLC",
    color: "lime",
    description: "SDLC, touchpoints, maturity, source-code analysis.",
  },
  "microservices-supply-chain": {
    id: "microservices-supply-chain",
    label: "Microservices & supply chain",
    short: "Supply",
    color: "beige",
    description: "Service auth, secrets, gateways, SBOM, dependency risk.",
  },
  "privacy-gdpr": {
    id: "privacy-gdpr",
    label: "Privacy & GDPR",
    short: "Privacy",
    color: "yellow",
    description: "Personal data, lawful basis, minimization, DPIA.",
  },
  "ai-security": {
    id: "ai-security",
    label: "AI security",
    short: "AI",
    color: "magenta",
    description: "Prompt injection, jailbreaking, vulnerable AI code.",
  },
  "security-basics": {
    id: "security-basics",
    label: "Security basics",
    short: "Basics",
    color: "ntnuBlue",
    description: "CIA, defense in depth, fail securely, least privilege.",
  },
};
