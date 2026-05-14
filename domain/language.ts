export const CODE_LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "go",
  "php",
  "ruby",
  "sql",
  "html",
  "bash",
  "yaml",
  "json",
  "http",
  "plaintext",
] as const;

export type CodeLanguage = (typeof CODE_LANGUAGES)[number];

export const LANGUAGE_LABEL: Record<CodeLanguage, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  java: "Java",
  csharp: "C#",
  go: "Go",
  php: "PHP",
  ruby: "Ruby",
  sql: "SQL",
  html: "HTML",
  bash: "Bash",
  yaml: "YAML",
  json: "JSON",
  http: "HTTP",
  plaintext: "Text",
};
