export type IssueSort = "recent" | "top";
export type SortOrder = "asc" | "desc";

export interface IssueDiscoveryQuery {
  sort?: string | string[];
  order?: string | string[];
  minBounty?: string | string[];
}

export function normalizeIssueDiscoveryQuery(query: IssueDiscoveryQuery) {
  const sort = first(query.sort);
  const order = first(query.order);
  const minBountyValue = Number(first(query.minBounty) ?? 0);

  return {
    sort: sort === "top" ? ("top" as const) : ("recent" as const),
    order: order === "asc" ? ("asc" as const) : ("desc" as const),
    minBounty:
      Number.isFinite(minBountyValue) && minBountyValue > 0
        ? minBountyValue
        : 0,
  };
}

export function sortIssueDiscoveryItemsForTest(
  items: Array<{ amount: string; updatedAt: Date }>,
  sort: IssueSort,
  order: SortOrder,
) {
  const direction = order === "asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    if (sort === "top") {
      return (Number(a.amount) - Number(b.amount)) * direction;
    }
    return (a.updatedAt.getTime() - b.updatedAt.getTime()) * direction;
  });
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
