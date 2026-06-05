import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  normalizeIssueDiscoveryQuery,
  sortIssueDiscoveryItemsForTest,
} from "../src/lib/issues/discovery-query.ts";

describe("normalizeIssueDiscoveryQuery", () => {
  it("defaults to recent descending with no minimum bounty", () => {
    assert.deepEqual(normalizeIssueDiscoveryQuery({}), {
      sort: "recent",
      order: "desc",
      minBounty: 0,
    });
  });

  it("accepts top sorting, ascending order, and minimum bounty", () => {
    assert.deepEqual(
      normalizeIssueDiscoveryQuery({
        sort: "top",
        order: "asc",
        minBounty: "25",
      }),
      {
        sort: "top",
        order: "asc",
        minBounty: 25,
      },
    );
  });

  it("sanitizes invalid query values", () => {
    assert.deepEqual(
      normalizeIssueDiscoveryQuery({
        sort: "unknown",
        order: "sideways",
        minBounty: "-1",
      }),
      {
        sort: "recent",
        order: "desc",
        minBounty: 0,
      },
    );
  });
});

describe("sortIssueDiscoveryItemsForTest", () => {
  const items = [
    { amount: "25", updatedAt: new Date("2026-01-01T00:00:00Z") },
    { amount: "5", updatedAt: new Date("2026-03-01T00:00:00Z") },
    { amount: "100", updatedAt: new Date("2026-02-01T00:00:00Z") },
  ];

  it("sorts top issues by amount descending", () => {
    assert.deepEqual(
      sortIssueDiscoveryItemsForTest(items, "top", "desc").map(
        (item) => item.amount,
      ),
      ["100", "25", "5"],
    );
  });

  it("sorts recent issues by updated date descending", () => {
    assert.deepEqual(
      sortIssueDiscoveryItemsForTest(items, "recent", "desc").map(
        (item) => item.amount,
      ),
      ["5", "100", "25"],
    );
  });
});
