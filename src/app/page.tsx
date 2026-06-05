import type { CSSProperties } from "react";

import {
  listIssueDiscoveryItems,
  normalizeIssueDiscoveryQuery,
} from "@/lib/issues/discovery";

interface HomeProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = (await searchParams) ?? {};
  const normalized = normalizeIssueDiscoveryQuery(params);
  const issues = await listIssueDiscoveryItems(params);

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.nav}>
          <a href="/deploy" style={styles.deployLink}>
            Deploy
          </a>
          <a
            href="https://github.com/apps/pvium-bounty-app"
            target="_blank"
            rel="noreferrer"
            style={styles.installLink}
          >
            Install GitHub App
          </a>
        </div>
        <p style={styles.eyebrow}>Pvium issue discovery</p>
        <h1 style={styles.title}>Find funded GitHub work across projects.</h1>
        <p style={styles.lede}>
          Browse connected repository issues by recency or bounty amount. Each
          row links directly to the GitHub issue so contributors can inspect the
          scope and maintainers can keep the deployment workflow under /deploy.
        </p>
      </section>

      <section style={styles.panel}>
        <form style={styles.controls}>
          <label style={styles.control}>
            <span style={styles.label}>Sort</span>
            <select name="sort" defaultValue={normalized.sort} style={styles.select}>
              <option value="recent">Recent issues</option>
              <option value="top">Top issues</option>
            </select>
          </label>
          <label style={styles.control}>
            <span style={styles.label}>Order</span>
            <select name="order" defaultValue={normalized.order} style={styles.select}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </label>
          <label style={styles.control}>
            <span style={styles.label}>Minimum bounty</span>
            <input
              name="minBounty"
              type="number"
              min="0"
              step="1"
              defaultValue={normalized.minBounty || ""}
              placeholder="0"
              style={styles.input}
            />
          </label>
          <button type="submit" style={styles.button}>
            Apply
          </button>
        </form>

        <div style={styles.summary}>
          {issues.length} {issues.length === 1 ? "issue" : "issues"} found
        </div>

        <div style={styles.issueList}>
          {issues.length ? (
            issues.map((issue) => (
              <a
                key={issue.id}
                href={issue.issueUrl}
                target="_blank"
                rel="noreferrer"
                style={styles.card}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.repo}>{issue.repository}</span>
                  <span style={styles.amount}>
                    {issue.amount} {issue.currency}
                  </span>
                </div>
                <h2 style={styles.issueTitle}>{issue.title}</h2>
                {issue.excerpt ? (
                  <p style={styles.excerpt}>{issue.excerpt}</p>
                ) : null}
                <div style={styles.meta}>
                  <span>#{issue.issueNumber}</span>
                  <span>{issue.issueState}</span>
                  <span>{issue.status.toLowerCase().replaceAll("_", " ")}</span>
                  <span>Updated {formatDate(issue.updatedAt)}</span>
                </div>
              </a>
            ))
          ) : (
            <div style={styles.empty}>
              No issues match the current filters. Try lowering the minimum
              bounty or switching sort modes.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    margin: 0,
    padding: "40px 20px",
    background: "#f7f8fb",
    color: "#172033",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  hero: {
    maxWidth: 1080,
    margin: "0 auto 24px",
  },
  nav: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginBottom: 34,
  },
  deployLink: {
    display: "inline-flex",
    alignItems: "center",
    padding: "10px 14px",
    border: "1px solid #c8d0df",
    borderRadius: 8,
    background: "#ffffff",
    color: "#172033",
    fontSize: 14,
    fontWeight: 700,
    textDecoration: "none",
  },
  installLink: {
    display: "inline-flex",
    alignItems: "center",
    padding: "10px 14px",
    borderRadius: 8,
    background: "#172033",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 700,
    textDecoration: "none",
  },
  eyebrow: {
    margin: "0 0 10px",
    color: "#52627a",
    fontSize: 14,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  title: {
    maxWidth: 760,
    margin: "0 0 16px",
    fontSize: 48,
    lineHeight: 1.08,
    letterSpacing: 0,
  },
  lede: {
    maxWidth: 760,
    margin: 0,
    color: "#46556e",
    fontSize: 18,
    lineHeight: 1.65,
  },
  panel: {
    maxWidth: 1080,
    margin: "0 auto",
    padding: 24,
    border: "1px solid #d9deea",
    borderRadius: 8,
    background: "#ffffff",
  },
  controls: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr)) auto",
    alignItems: "end",
    gap: 12,
  },
  control: {
    display: "grid",
    gap: 6,
  },
  label: {
    color: "#52627a",
    fontSize: 13,
    fontWeight: 700,
  },
  select: {
    height: 42,
    border: "1px solid #c8d0df",
    borderRadius: 8,
    background: "#ffffff",
    color: "#172033",
    padding: "0 10px",
    fontSize: 14,
  },
  input: {
    height: 40,
    border: "1px solid #c8d0df",
    borderRadius: 8,
    color: "#172033",
    padding: "0 10px",
    fontSize: 14,
  },
  button: {
    height: 42,
    border: 0,
    borderRadius: 8,
    background: "#172033",
    color: "#ffffff",
    padding: "0 18px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  summary: {
    margin: "20px 0 12px",
    color: "#52627a",
    fontSize: 14,
    fontWeight: 700,
  },
  issueList: {
    display: "grid",
    gap: 12,
  },
  card: {
    display: "block",
    border: "1px solid #d9deea",
    borderRadius: 8,
    padding: 18,
    color: "inherit",
    textDecoration: "none",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },
  repo: {
    color: "#52627a",
    fontSize: 13,
    fontWeight: 700,
  },
  amount: {
    borderRadius: 999,
    background: "#e8f6ef",
    color: "#11633d",
    padding: "5px 9px",
    fontSize: 13,
    fontWeight: 800,
  },
  issueTitle: {
    margin: "0 0 8px",
    fontSize: 20,
    lineHeight: 1.3,
    letterSpacing: 0,
  },
  excerpt: {
    margin: "0 0 12px",
    color: "#46556e",
    fontSize: 14,
    lineHeight: 1.55,
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    color: "#66748a",
    fontSize: 13,
  },
  empty: {
    border: "1px dashed #c8d0df",
    borderRadius: 8,
    color: "#52627a",
    padding: 24,
    textAlign: "center",
  },
};
