import type { BountyStatus } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import {
  normalizeIssueDiscoveryQuery,
  type IssueDiscoveryQuery,
} from "@/lib/issues/discovery-query";

export { normalizeIssueDiscoveryQuery };

export interface IssueDiscoveryItem {
  id: string;
  title: string;
  repository: string;
  amount: string;
  currency: string;
  status: BountyStatus;
  issueState: string;
  issueNumber: number;
  issueUrl: string;
  excerpt: string;
  updatedAt: Date;
  createdAt: Date;
}

export async function listIssueDiscoveryItems(query: IssueDiscoveryQuery = {}) {
  const normalized = normalizeIssueDiscoveryQuery(query);
  const orderBy =
    normalized.sort === "top"
      ? [{ amount: normalized.order }, { updatedAt: "desc" as const }]
      : [{ issueUpdatedAt: normalized.order }, { updatedAt: normalized.order }];

  const bounties = await prisma.bounty.findMany({
    where: {
      amount: normalized.minBounty ? { gte: normalized.minBounty } : undefined,
    },
    include: {
      repository: true,
    },
    orderBy,
  });

  return bounties.map((bounty): IssueDiscoveryItem => ({
    id: bounty.id,
    title: bounty.issueTitle ?? `Issue #${bounty.issueNumber}`,
    repository: `${bounty.repository.owner}/${bounty.repository.repo}`,
    amount: bounty.amount.toString(),
    currency: bounty.currency,
    status: bounty.status,
    issueState: bounty.issueState ?? "unknown",
    issueNumber: bounty.issueNumber,
    issueUrl:
      bounty.issueUrl ??
      `https://github.com/${bounty.repository.owner}/${bounty.repository.repo}/issues/${bounty.issueNumber}`,
    excerpt: bounty.issueExcerpt ?? "",
    updatedAt: bounty.issueUpdatedAt ?? bounty.updatedAt,
    createdAt: bounty.issueCreatedAt ?? bounty.createdAt,
  }));
}
