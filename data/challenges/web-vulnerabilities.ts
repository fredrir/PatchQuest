import type { Challenge } from "@/domain/challenge";
import { buildChallenge, fix } from "../builder";

export const webVulnerabilityChallenges: readonly Challenge[] = [
  buildChallenge({
    id: "web-xss-reflected-search",
    title: "Reflected XSS in search results",
    summary:
      "An Express handler echoes a query parameter back into HTML without escaping.",
    courseTopic: "web-vulnerabilities",
    difficulty: "intro",
    tags: ["xss", "express"],
    language: "javascript",
    code: `app.get("/search", (req, res) => {
  const q = req.query.q;
  res.send(
    "<h1>Results for " + q + "</h1>" +
    "<ul>" + renderResults(q) + "</ul>"
  );
});`,
    vulnerableLines: [2, 4],
    vulnerabilityType: "Reflected Cross-Site Scripting",
    fixOptions: [
      fix(
        "escape",
        "Escape the user input before insertion",
        "Encoding HTML special characters neutralises the payload before the browser parses it as markup.",
        {
          code: `const safe = escapeHtml(req.query.q);
res.send(\`<h1>Results for \${safe}</h1>\`);`,
        },
      ),
      fix(
        "blacklist",
        "Strip the literal string '<script>'",
        "Blacklists are trivially bypassed (e.g. <Script>, <ScRiPt>, event-handler attributes, SVG onload).",
        { tempting: true },
      ),
      fix(
        "client-strip",
        "Sanitise on the client with regex before display",
        "Output encoding must happen on the server. Client-only filtering does not protect users who never run that script.",
        { tempting: true },
      ),
      fix(
        "csp-only",
        "Add a Content-Security-Policy header and ship as is",
        "CSP is defence in depth, not a substitute for output encoding. Inline reflection still breaks an open policy.",
      ),
    ],
    correctFixId: "escape",
    explanation:
      "The handler concatenates `req.query.q` into the response without HTML-encoding it. An attacker can send a link such as `/search?q=<script>fetch('/steal',{method:'POST',body:document.cookie})</script>`. Because the response sets no CSP and includes the payload verbatim, the browser executes it in the victim's origin. The robust mitigation is contextual output encoding at the point of insertion (HTML-escape the value before placing it in HTML).",
    examKeywords: ["reflected", "encoding", "escape", "context", "untrusted input"],
    owaspTop10: "A03",
    owaspWstg: "WSTG-INPV-01",
    modeData: {
      multipleChoice: {
        question: "Which mitigation reliably stops reflected XSS in this handler?",
        options: [
          {
            id: "a",
            text: "Contextual HTML-encoding of the query value at output time.",
            correct: true,
            rationale:
              "Encoding the value where it is inserted into HTML neutralises the payload regardless of how cleverly it is crafted.",
          },
          {
            id: "b",
            text: "Reject queries containing the substring '<script>'.",
            correct: false,
            rationale:
              "Blacklists are bypassed by case folding, attribute-based payloads, or SVG/MathML tags.",
          },
          {
            id: "c",
            text: "Filter the input on the client with a regex before submitting.",
            correct: false,
            rationale:
              "An attacker controls their own client and can send any request directly.",
          },
          {
            id: "d",
            text: "Set HttpOnly on the session cookie.",
            correct: false,
            rationale:
              "HttpOnly only stops cookie theft via JS — the XSS itself still runs.",
          },
        ],
      },
    },
  }),

  buildChallenge({
    id: "web-xss-stored-comment",
    title: "Stored XSS in comments",
    summary:
      "A React-rendered comment widget uses `dangerouslySetInnerHTML` for plain-text content.",
    courseTopic: "web-vulnerabilities",
    difficulty: "core",
    tags: ["xss", "react"],
    language: "javascript",
    code: `function Comment({ comment }) {
  return (
    <div className="comment">
      <strong>{comment.author}</strong>
      <div dangerouslySetInnerHTML={{ __html: comment.body }} />
    </div>
  );
}`,
    vulnerableLines: [5],
    vulnerabilityType: "Stored Cross-Site Scripting",
    fixOptions: [
      fix(
        "render-text",
        "Render the body as text, not HTML",
        "React escapes children by default. Removing `dangerouslySetInnerHTML` and rendering `{comment.body}` is sufficient when the body is plain text.",
        { code: `<div>{comment.body}</div>` },
      ),
      fix(
        "sanitise",
        "Run the HTML through an allow-list sanitiser (e.g. DOMPurify) if HTML is needed",
        "If the product genuinely needs rich text, sanitise with a vetted library that uses a strict allow-list of tags and attributes.",
      ),
      fix(
        "strip-script",
        "Strip <script> tags server-side before saving",
        "Stored XSS does not require <script>. `<img src=x onerror=...>`, `<iframe srcdoc>`, and event handlers all work.",
        { tempting: true },
      ),
      fix(
        "encode-display",
        "Escape only when the comment contains '<' characters",
        "Conditional escaping is fragile. Always encode untrusted content for the output context.",
        { tempting: true },
      ),
    ],
    correctFixId: "render-text",
    explanation:
      "`dangerouslySetInnerHTML` bypasses React's automatic escaping. Any payload an attacker stores becomes live HTML for every viewer (stored XSS). If the field is a plain comment, render it as a child node so React encodes it. If rich text is genuinely required, run it through an allow-list sanitiser at render time and never store untrusted HTML directly.",
    examKeywords: [
      "stored",
      "dangerouslysetinnerhtml",
      "sanitisation",
      "allow-list",
      "react escapes",
    ],
    owaspTop10: "A03",
    owaspWstg: "WSTG-INPV-02",
    modeData: {
      multipleChoice: {
        question:
          "What is the safest default for displaying user-submitted comments in React?",
        options: [
          {
            id: "a",
            text: "Render the value as a child node so React encodes it.",
            correct: true,
            rationale:
              "React encodes children automatically; `dangerouslySetInnerHTML` opts out of that protection.",
          },
          {
            id: "b",
            text: "Server-side strip of `<script>` tags before persisting.",
            correct: false,
            rationale:
              "XSS payloads do not require `<script>` tags — `onerror` handlers, `<iframe srcdoc>`, etc. work fine.",
          },
          {
            id: "c",
            text: "Set the body as innerHTML after escaping quotes.",
            correct: false,
            rationale: "Quote escaping is the wrong context — attribute escaping ≠ HTML escaping.",
          },
          {
            id: "d",
            text: "Add `rel=noopener` to anchors.",
            correct: false,
            rationale: "Unrelated to XSS.",
          },
        ],
      },
    },
  }),

  buildChallenge({
    id: "web-xss-dom-redirect",
    title: "DOM XSS via location.hash",
    summary: "A welcome banner reads a value from the URL fragment and writes it into the DOM.",
    courseTopic: "web-vulnerabilities",
    difficulty: "core",
    tags: ["xss", "dom"],
    language: "javascript",
    code: `const banner = document.getElementById("banner");
const name = decodeURIComponent(location.hash.slice(1));
banner.innerHTML = "Welcome back, " + name + "!";`,
    vulnerableLines: [2, 3],
    vulnerabilityType: "DOM-based Cross-Site Scripting",
    fixOptions: [
      fix(
        "textcontent",
        "Use textContent and treat the value as text",
        "`textContent` writes the string verbatim, never as markup. Ideal when the content is plain text.",
        { code: `banner.textContent = "Welcome back, " + name + "!";` },
      ),
      fix(
        "trusted-types",
        "Adopt Trusted Types and reject untrusted strings sinking into innerHTML",
        "Trusted Types makes the dangerous sink unreachable for raw strings.",
      ),
      fix(
        "regex-allow",
        "Allow only [A-Za-z] in the hash and continue using innerHTML",
        "Restricting characters helps but innerHTML on user input remains a fragile invariant; one regex change re-opens the bug.",
        { tempting: true },
      ),
      fix(
        "csp-strict",
        "Set a strict Content-Security-Policy and keep innerHTML",
        "CSP blocks inline scripts but does not block injected DOM nodes (event handlers, link rel, etc.).",
        { tempting: true },
      ),
    ],
    correctFixId: "textcontent",
    explanation:
      "DOM XSS happens entirely in the browser: the source is `location.hash` and the sink is `innerHTML`. Choosing the right sink (`textContent`) eliminates the issue. Trusted Types is the strongest defence at scale because it makes risky sinks unreachable for untrusted strings.",
    examKeywords: [
      "dom xss",
      "source",
      "sink",
      "innerHTML",
      "textContent",
      "trusted types",
    ],
    owaspTop10: "A03",
    owaspWstg: "WSTG-INPV-01",
  }),

  buildChallenge({
    id: "web-sqli-login",
    title: "SQL injection in a login query",
    summary:
      "A Java JDBC handler builds a SQL string by concatenating credentials from the request.",
    courseTopic: "web-vulnerabilities",
    difficulty: "intro",
    tags: ["sqli", "java"],
    language: "java",
    code: `public User login(String username, String password) {
  String sql = "SELECT * FROM users WHERE username = '" + username +
               "' AND password = '" + password + "'";
  Statement st = conn.createStatement();
  ResultSet rs = st.executeQuery(sql);
  if (rs.next()) return User.from(rs);
  return null;
}`,
    vulnerableLines: [2, 3, 4, 5],
    vulnerabilityType: "SQL Injection",
    fixOptions: [
      fix(
        "prepared",
        "Use a prepared statement with bound parameters",
        "Prepared statements separate code from data: the query text is parsed once, parameters are values only.",
        {
          code: `PreparedStatement ps = conn.prepareStatement(
  "SELECT * FROM users WHERE username = ? AND password_hash = ?");
ps.setString(1, username);
ps.setString(2, hash(password));`,
        },
      ),
      fix(
        "escape-quotes",
        "Replace single quotes in the inputs with two single quotes",
        "Manual escaping breaks for non-string contexts and is brittle. Use parameterised queries.",
        { tempting: true },
      ),
      fix(
        "stored-proc",
        "Wrap the same string concatenation in a stored procedure",
        "If the procedure body still concatenates, you have moved the injection — not removed it.",
        { tempting: true },
      ),
      fix(
        "deny-special",
        "Reject inputs containing semicolons, quotes, or '--'",
        "Input filtering misses many payloads (boolean-based, time-based, comments inside strings) and breaks legitimate input.",
      ),
    ],
    correctFixId: "prepared",
    explanation:
      "The query is built by string concatenation, so any quote in the input changes the SQL grammar. A username such as `' OR '1'='1` collapses the WHERE clause and authenticates as the first user. Prepared statements bind parameters at the protocol layer, so the user data never participates in parsing. Storing only password hashes is a separate but essential second control.",
    examKeywords: [
      "prepared statement",
      "parameterised",
      "concatenation",
      "bind",
      "injection",
    ],
    owaspTop10: "A03",
    owaspWstg: "WSTG-INPV-05",
    modeData: {
      multipleChoice: {
        question: "Why does input filtering fail to stop SQL injection?",
        options: [
          {
            id: "a",
            text: "Many payloads avoid the filtered tokens (boolean tricks, encoding, comments).",
            correct: true,
            rationale:
              "SQLi has many shapes; only structural separation of code and data via parameters is reliable.",
          },
          {
            id: "b",
            text: "Modern databases ignore SQL comments.",
            correct: false,
            rationale: "They don't.",
          },
          {
            id: "c",
            text: "It is fast enough but does not log attacks.",
            correct: false,
            rationale: "Logging is unrelated to the failure mode.",
          },
          {
            id: "d",
            text: "Filters break performance under load.",
            correct: false,
            rationale: "Performance is not the security concern.",
          },
        ],
      },
    },
  }),

  buildChallenge({
    id: "web-sqli-orderby",
    title: "Tainted ORDER BY clause",
    summary:
      "A reporting endpoint accepts a `sort` query parameter and uses it directly in an ORDER BY clause.",
    courseTopic: "web-vulnerabilities",
    difficulty: "advanced",
    tags: ["sqli", "node", "order-by"],
    language: "typescript",
    code: `app.get("/reports", async (req, res) => {
  const sort = req.query.sort as string;
  const rows = await db.query(
    \`SELECT id, total FROM reports ORDER BY \${sort}\`
  );
  res.json(rows);
});`,
    vulnerableLines: [2, 3, 4],
    vulnerabilityType: "SQL Injection (identifier)",
    fixOptions: [
      fix(
        "allow-list",
        "Map the `sort` parameter to an allow-list of column names",
        "Identifiers cannot be parameterised in standard SQL — they must be validated against a fixed set of known-safe columns.",
        {
          code: `const ALLOWED = { id: "id", total: "total", date: "created_at" } as const;
const col = ALLOWED[req.query.sort as keyof typeof ALLOWED] ?? "id";`,
        },
      ),
      fix(
        "escape-id",
        "Escape the identifier with backticks",
        "Identifier escaping varies per database and does not stop injection of valid columns or comma-separated terms (e.g. `total; DROP TABLE`).",
        { tempting: true },
      ),
      fix(
        "param-bind",
        "Bind the column name with `db.query(..., [sort])`",
        "Parameter binding is for values, not identifiers — most drivers will treat the column name as a literal string.",
        { tempting: true },
      ),
      fix(
        "regex",
        "Allow only `[a-zA-Z_]+` in the sort parameter",
        "A loose regex still permits any column name in the schema, including ones the user shouldn't be able to sort by.",
      ),
    ],
    correctFixId: "allow-list",
    explanation:
      "Standard SQL parameter binding only works for values, not for identifiers like column or table names. A sort parameter that lands in ORDER BY needs an explicit allow-list mapping the user's input to a known-safe column. Without it, attackers can inject SQL fragments such as `1; DROP TABLE reports --` or use blind techniques (`(CASE WHEN ...)` ordering) to exfiltrate data.",
    examKeywords: [
      "allow-list",
      "identifier",
      "order by",
      "parameter binding",
      "injection",
    ],
    owaspTop10: "A03",
    owaspWstg: "WSTG-INPV-05",
  }),

  buildChallenge({
    id: "web-idor-orders",
    title: "IDOR — orders endpoint trusts the URL id",
    summary:
      "An order detail endpoint loads any order id passed in the URL without an ownership check.",
    courseTopic: "web-vulnerabilities",
    difficulty: "intro",
    tags: ["idor", "authz"],
    language: "python",
    code: `@app.get("/orders/<int:order_id>")
@login_required
def order_detail(order_id):
    order = Order.query.get(order_id)
    if order is None:
        abort(404)
    return jsonify(order.to_dict())`,
    vulnerableLines: [4, 6],
    vulnerabilityType: "Insecure Direct Object Reference",
    fixOptions: [
      fix(
        "ownership",
        "Filter by the current user when loading the order",
        "Authorisation must be enforced server-side using the authenticated identity, not the URL id.",
        {
          code: `order = Order.query.filter_by(id=order_id, user_id=current_user.id).first()
if order is None:
    abort(404)`,
        },
      ),
      fix(
        "uuid",
        "Switch numeric ids to long random UUIDs",
        "Unguessable ids are defence in depth at best — the access-control bug is unfixed and a leaked link still exposes data.",
        { tempting: true },
      ),
      fix(
        "client-hide",
        "Hide other users' order ids from the UI",
        "Hiding URLs in the UI does not stop a direct request. Authorisation must be on the server.",
        { tempting: true },
      ),
      fix(
        "rate-limit",
        "Add a rate limit on the endpoint",
        "Rate-limiting reduces enumeration cost but does not stop a single targeted access.",
      ),
    ],
    correctFixId: "ownership",
    explanation:
      "The handler authenticates the caller (login required) but never authorises the lookup. Anyone with a valid session can iterate `order_id` values and read other users' orders. The fix is to scope the database query by the authenticated user id (object-level authorisation). Long ids are not a substitute — the door is still unlocked, just harder to find.",
    examKeywords: [
      "object-level",
      "authorisation",
      "ownership",
      "idor",
      "direct reference",
    ],
    owaspTop10: "A01",
    owaspWstg: "WSTG-ATHZ-04",
    modeData: {
      multipleChoice: {
        question: "Which control actually fixes an IDOR?",
        options: [
          {
            id: "a",
            text: "Server-side authorisation that scopes the query by the caller's identity.",
            correct: true,
            rationale: "Object-level authorisation is the only control that works.",
          },
          {
            id: "b",
            text: "Switching to UUIDs.",
            correct: false,
            rationale:
              "Unguessable ids are obscurity, not access control. Authenticated users can still leak ids.",
          },
          {
            id: "c",
            text: "Hiding the link from the UI.",
            correct: false,
            rationale: "Direct HTTP requests bypass the UI.",
          },
          {
            id: "d",
            text: "Adding HSTS.",
            correct: false,
            rationale: "Unrelated control.",
          },
        ],
      },
    },
  }),

  buildChallenge({
    id: "web-csrf-statechange",
    title: "CSRF on a state-changing endpoint",
    summary:
      "A profile-update endpoint accepts cookie-authenticated POSTs without any anti-CSRF token.",
    courseTopic: "web-vulnerabilities",
    difficulty: "core",
    tags: ["csrf", "express"],
    language: "javascript",
    code: `app.post("/account/email", (req, res) => {
  const userId = req.session.userId;
  Users.update(userId, { email: req.body.email });
  res.redirect("/account");
});`,
    vulnerableLines: [1, 3],
    vulnerabilityType: "Cross-Site Request Forgery",
    fixOptions: [
      fix(
        "samesite-token",
        "Require a per-session anti-CSRF token AND set the session cookie SameSite=Lax",
        "Tokens defend against POSTs originating off-site; SameSite=Lax stops most CSRF at the cookie layer.",
      ),
      fix(
        "referer",
        "Reject requests whose `Referer` header is missing or off-origin",
        "Some browsers and privacy tools strip Referer; relying on it produces both false positives and bypasses.",
        { tempting: true },
      ),
      fix(
        "captcha",
        "Add a CAPTCHA to the endpoint",
        "CAPTCHAs harden against bots, not the cross-site attack pattern.",
        { tempting: true },
      ),
      fix(
        "post-only",
        "Accept the change only over POST",
        "CSRF works fine via POST — auto-submitted forms are the standard payload.",
      ),
    ],
    correctFixId: "samesite-token",
    explanation:
      "Cookie auth means the browser sends credentials on every request, including ones initiated by malicious sites. A POST to `/account/email` from an attacker-controlled page silently changes the victim's email and lets the attacker reset the password. The standard mitigation is the synchronizer-token pattern (or the double-submit cookie), combined with SameSite=Lax (or Strict) on the session cookie.",
    examKeywords: ["csrf", "samesite", "token", "synchronizer", "state-changing"],
    owaspTop10: "A01",
    owaspWstg: "WSTG-SESS-05",
  }),

  buildChallenge({
    id: "web-ssrf-thumbnail",
    title: "SSRF via image-thumbnail service",
    summary:
      "A thumbnail service fetches whatever URL the client supplies, then serves the bytes back.",
    courseTopic: "web-vulnerabilities",
    difficulty: "core",
    tags: ["ssrf", "node"],
    language: "typescript",
    code: `app.get("/thumb", async (req, res) => {
  const url = req.query.url as string;
  const r = await fetch(url);
  const buf = Buffer.from(await r.arrayBuffer());
  res.type("image/png").send(buf);
});`,
    vulnerableLines: [2, 3],
    vulnerabilityType: "Server-Side Request Forgery",
    fixOptions: [
      fix(
        "allow-list",
        "Resolve the URL host and reject anything not on an explicit allow-list",
        "Allow-listing combined with re-resolution defeats DNS rebinding and link-shortener tricks.",
      ),
      fix(
        "block-private",
        "Block requests to RFC1918 private ranges and the metadata IP",
        "A start, but DNS rebinding can flip a public name to an internal IP after the check. Combine with allow-listing.",
        { tempting: true },
      ),
      fix(
        "client-validate",
        "Validate the URL on the client before submitting",
        "Client-side validation is bypassable with a direct request.",
        { tempting: true },
      ),
      fix(
        "user-agent",
        "Send a custom User-Agent header",
        "Has no effect on whether the request is reachable internally.",
      ),
    ],
    correctFixId: "allow-list",
    explanation:
      "The endpoint fetches arbitrary URLs from inside the data centre. Attackers point it at `http://169.254.169.254/latest/meta-data/` to read cloud credentials, or at internal admin services. Robust mitigation is allow-listing exact hosts, re-resolving DNS to an IP, and forbidding HTTP redirects to other origins.",
    examKeywords: ["ssrf", "metadata", "allow-list", "dns rebinding", "private network"],
    owaspTop10: "A10",
    owaspWstg: "WSTG-INPV-19",
  }),

  buildChallenge({
    id: "web-cmdi-ping",
    title: "Command injection in a ping helper",
    summary:
      "A diagnostics endpoint shells out to `ping` with the host taken from the request.",
    courseTopic: "web-vulnerabilities",
    difficulty: "core",
    tags: ["command-injection", "python"],
    language: "python",
    code: `@app.post("/admin/ping")
def admin_ping():
    host = request.form["host"]
    out = subprocess.check_output("ping -c 1 " + host, shell=True)
    return out`,
    vulnerableLines: [3, 4],
    vulnerabilityType: "OS Command Injection",
    fixOptions: [
      fix(
        "argv",
        "Run the binary with an argument list and shell=False",
        "Passing arguments as a list and not invoking a shell removes the metacharacter parsing surface entirely.",
        {
          code: `subprocess.check_output(["ping", "-c", "1", host], shell=False)`,
        },
      ),
      fix(
        "escape-shell",
        "Escape the host with backslashes before concatenating",
        "Manual shell escaping is wrong subtly often. Avoid the shell.",
        { tempting: true },
      ),
      fix(
        "regex-host",
        "Allow only ASCII letters, digits, dot and dash, then keep `shell=True`",
        "Tighter input helps but pairs poorly with `shell=True`. Combine input validation with `shell=False`.",
      ),
      fix(
        "sudo",
        "Run the subprocess as a non-privileged user",
        "Reduces blast radius but the injection still happens — the attacker can still scan and execute as that user.",
        { tempting: true },
      ),
    ],
    correctFixId: "argv",
    explanation:
      "`shell=True` invokes `/bin/sh -c`, which parses metacharacters in the joined string. A host of `127.0.0.1; cat /etc/passwd` runs both commands. Calling the binary directly with `shell=False` and an argument list eliminates shell parsing, so user input cannot become syntax.",
    examKeywords: ["shell=true", "argv", "metacharacters", "command injection"],
    owaspTop10: "A03",
    owaspWstg: "WSTG-INPV-12",
    modeData: {
      multipleChoice: {
        question: "What's the safest way to call an external binary with user input?",
        options: [
          {
            id: "a",
            text: "Pass arguments as a list with shell=False.",
            correct: true,
            rationale: "Bypasses shell parsing entirely.",
          },
          {
            id: "b",
            text: "Quote the input with shlex.quote().",
            correct: false,
            rationale:
              "Better than nothing, but argv-style invocation with no shell is strictly safer.",
          },
          {
            id: "c",
            text: "Reject inputs with semicolons.",
            correct: false,
            rationale: "Many other metacharacters exist (&, |, $, backticks).",
          },
          {
            id: "d",
            text: "Use sudo to constrain privileges.",
            correct: false,
            rationale: "Reduces impact, doesn't fix the bug.",
          },
        ],
      },
    },
  }),

  buildChallenge({
    id: "web-fileupload-php",
    title: "Unrestricted file upload",
    summary:
      "A PHP avatar uploader trusts the client-provided file name and saves into the web root.",
    courseTopic: "web-vulnerabilities",
    difficulty: "core",
    tags: ["file-upload", "php"],
    language: "php",
    code: `<?php
$name = $_FILES["avatar"]["name"];
$tmp  = $_FILES["avatar"]["tmp_name"];
move_uploaded_file($tmp, __DIR__ . "/uploads/" . $name);
?>`,
    vulnerableLines: [2, 3, 4],
    vulnerabilityType: "Insecure File Upload",
    fixOptions: [
      fix(
        "validate-and-rename",
        "Validate type by content, store outside the web root with a server-generated name",
        "Trusting the file name and the extension is the root cause; rename to a UUID and serve via a controller that sets headers.",
        {
          code: `$ext = match (mime_content_type($tmp)) {
  "image/jpeg" => "jpg",
  "image/png"  => "png",
  default      => throw new RuntimeException("bad type"),
};
$dst = STORAGE_DIR . "/" . bin2hex(random_bytes(16)) . "." . $ext;
move_uploaded_file($tmp, $dst);`,
        },
      ),
      fix(
        "ext-deny",
        "Reject filenames ending in .php, .phtml, .phar",
        "Apache/nginx mishandling, double extensions, and case folding still allow execution.",
        { tempting: true },
      ),
      fix(
        "content-type",
        "Trust the request `Content-Type` header",
        "The client controls the header; it is not a security signal.",
        { tempting: true },
      ),
      fix(
        "client-resize",
        "Resize the image client-side before upload",
        "Anything that runs on the client can be skipped by an attacker.",
      ),
    ],
    correctFixId: "validate-and-rename",
    explanation:
      "Storing client-supplied file names inside the web root lets an attacker upload `shell.php` and execute it on the next request. The fix has three parts: (1) determine type from content (e.g. `mime_content_type`), (2) save with a server-generated name and a fixed extension, (3) store outside the web-served directory so even mis-detection can't lead to code execution.",
    examKeywords: [
      "double extension",
      "mime sniffing",
      "rename",
      "outside web root",
      "execution",
    ],
    owaspTop10: "A04",
    owaspWstg: "WSTG-BUSL-09",
  }),

  buildChallenge({
    id: "web-cookie-session-flags",
    title: "Session cookie missing security flags",
    summary:
      "An Express session cookie is created without `Secure`, `HttpOnly`, or `SameSite` set.",
    courseTopic: "web-vulnerabilities",
    difficulty: "intro",
    tags: ["cookies", "session"],
    language: "javascript",
    code: `app.use(session({
  name: "sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 },
}));`,
    vulnerableLines: [6],
    vulnerabilityType: "Insecure Session Cookie",
    fixOptions: [
      fix(
        "flags",
        "Set httpOnly, secure, and sameSite on the cookie config",
        "Defence in depth: HttpOnly blocks JS theft, Secure prevents leakage on HTTP, SameSite mitigates CSRF.",
        {
          code: `cookie: {
  maxAge: 1000 * 60 * 60 * 8,
  httpOnly: true,
  secure: true,
  sameSite: "lax",
}`,
        },
      ),
      fix(
        "regen-only",
        "Regenerate the id on login and logout",
        "Necessary, but unrelated to the missing flags. Both controls matter.",
        { tempting: true },
      ),
      fix(
        "store",
        "Move the secret to an environment variable",
        "It is already an env var, and that does not address cookie flags.",
      ),
      fix(
        "expiry",
        "Lower the `maxAge` to 1 hour",
        "Shorter sessions help but cookie hardening is still missing.",
      ),
    ],
    correctFixId: "flags",
    explanation:
      "Without `HttpOnly`, an XSS payload can steal the session id. Without `Secure`, the browser will leak the cookie on a downgrade to HTTP. Without `SameSite`, the cookie rides along with cross-site requests, enabling CSRF. All three flags should be the default for any session cookie; combine with regeneration on login.",
    examKeywords: ["httponly", "secure", "samesite", "session cookie"],
    owaspTop10: "A05",
    owaspWstg: "WSTG-SESS-02",
    modeData: {
      multipleChoice: {
        question: "Which flag prevents JavaScript from reading the session cookie?",
        options: [
          { id: "a", text: "HttpOnly", correct: true, rationale: "HttpOnly hides the cookie from `document.cookie`." },
          { id: "b", text: "Secure", correct: false, rationale: "Secure restricts to HTTPS." },
          { id: "c", text: "SameSite", correct: false, rationale: "SameSite controls cross-origin cookie sending." },
          { id: "d", text: "Path", correct: false, rationale: "Path restricts the URL scope." },
        ],
      },
    },
  }),

  buildChallenge({
    id: "web-cors-wildcard",
    title: "Permissive CORS on a private API",
    summary:
      "An internal API replies with `Access-Control-Allow-Origin: *` and reflects credentials.",
    courseTopic: "web-vulnerabilities",
    difficulty: "core",
    tags: ["cors"],
    language: "javascript",
    code: `app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});`,
    vulnerableLines: [2, 3],
    vulnerabilityType: "Misconfigured CORS",
    fixOptions: [
      fix(
        "allow-list",
        "Echo only an allow-listed origin and keep credentials true",
        "CORS is per-origin: the allowed origin must come from a server-side allow-list of the legitimate front-end origins.",
        {
          code: `const ALLOWED = new Set(["https://app.example.com"]);
const origin = req.headers.origin;
if (origin && ALLOWED.has(origin)) {
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
}`,
        },
      ),
      fix(
        "wildcard-no-creds",
        "Keep `*` but drop the credentials header",
        "Acceptable for truly public, no-credentials APIs — but the design here clearly intends to use sessions.",
        { tempting: true },
      ),
      fix(
        "reflect-origin",
        "Reflect whatever Origin the request sends back",
        "Reflection equals trusting any caller; an attacker page becomes a same-origin reader.",
        { tempting: true },
      ),
      fix(
        "preflight-only",
        "Disable preflight for simple requests",
        "Preflights are a CORS feature, not a defence; turning them off does not change which origins can read.",
      ),
    ],
    correctFixId: "allow-list",
    explanation:
      "`Allow-Origin: *` plus `Allow-Credentials: true` is a contradiction the browser refuses, but reflecting any `Origin` and credentials achieves the worst-case behaviour: any malicious page can read responses on behalf of authenticated users. The right configuration is an explicit server-side allow-list and the `Vary: Origin` header so caches don't leak responses across origins.",
    examKeywords: ["cors", "allow-origin", "credentials", "vary", "allow-list"],
    owaspTop10: "A05",
    owaspWstg: "WSTG-CLNT-07",
  }),

  buildChallenge({
    id: "web-clickjacking",
    title: "Account-deletion page lacks framing protection",
    summary:
      "A delete-account page uses cookie auth and sets no `X-Frame-Options` or CSP `frame-ancestors`.",
    courseTopic: "web-vulnerabilities",
    difficulty: "core",
    tags: ["clickjacking", "headers"],
    language: "plaintext",
    code: `Response headers (excerpt)
HTTP/1.1 200 OK
Content-Type: text/html
Cache-Control: no-store
Set-Cookie: sid=...; Secure; HttpOnly; SameSite=Lax
# (no X-Frame-Options, no CSP frame-ancestors)`,
    vulnerableLines: [2, 3, 4, 5, 6],
    vulnerabilityType: "Clickjacking",
    fixOptions: [
      fix(
        "frame-ancestors",
        "Send `Content-Security-Policy: frame-ancestors 'none'`",
        "`frame-ancestors` is the modern, standardised replacement for X-Frame-Options.",
      ),
      fix(
        "xfo",
        "Send `X-Frame-Options: DENY`",
        "Acceptable for legacy browsers; combine with CSP for full coverage.",
        { tempting: true },
      ),
      fix(
        "frame-bust",
        "Add `if (top !== self) top.location = self.location` to the page",
        "Frame-busting JS can be defeated by sandboxed iframes that block navigation.",
        { tempting: true },
      ),
      fix(
        "double-confirm",
        "Add a confirmation dialog before deletion",
        "A click can be redirected to the dialog as easily as to the button. Defence-in-depth, not a fix.",
      ),
    ],
    correctFixId: "frame-ancestors",
    explanation:
      "Without framing protection an attacker can iframe the page, overlay decoy UI, and trick the user into clicking the delete button. CSP `frame-ancestors 'none'` is the standardised mitigation; `X-Frame-Options: DENY` is the older equivalent and is still useful for legacy clients.",
    examKeywords: ["clickjacking", "frame-ancestors", "x-frame-options", "ui redress"],
    owaspTop10: "A05",
    owaspWstg: "WSTG-CLNT-09",
  }),

  buildChallenge({
    id: "web-logging-leak",
    title: "Sensitive data leaking to logs",
    summary:
      "A debug print logs the entire request body, including the password and credit-card fields.",
    courseTopic: "web-vulnerabilities",
    difficulty: "intro",
    tags: ["logging", "leak"],
    language: "python",
    code: `def handle_payment(req):
    logger.info("incoming payment: %s", req.json())
    process(req)`,
    vulnerableLines: [2],
    vulnerabilityType: "Sensitive Information Disclosure (Logging)",
    fixOptions: [
      fix(
        "redact",
        "Log only non-sensitive identifiers and redact known secrets",
        "Field-level redaction keeps logs useful without exposing PAN or passwords.",
        {
          code: `safe = {k: ("***" if k in {"password","cardNumber","cvv"} else v) for k,v in req.json().items()}
logger.info("incoming payment: %s", safe)`,
        },
      ),
      fix(
        "log-warn",
        "Lower the log level to WARNING",
        "Lowering verbosity hides the message in production but the leak is still in the code path; enabling debug for any reason re-exposes it.",
        { tempting: true },
      ),
      fix(
        "rotate-fast",
        "Shorten the log retention to 24 hours",
        "Reduces exposure window, doesn't fix the leak. Logs may also be replicated to backup systems.",
        { tempting: true },
      ),
      fix(
        "tls-only",
        "Send logs over TLS",
        "Transport encryption is unrelated to whether secrets are in the log message.",
      ),
    ],
    correctFixId: "redact",
    explanation:
      "Logging entire request bodies on payment paths is a textbook sensitive-data exposure. Logs end up in many systems (SIEM, backups, support consoles). The right fix is structured logging with explicit redaction of known sensitive fields and never logging credentials, full PAN, CVV, or session tokens.",
    examKeywords: ["redact", "pii", "leak", "logging", "sensitive data"],
    owaspTop10: "A09",
  }),
];
