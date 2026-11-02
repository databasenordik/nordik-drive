export const COMMUNITY_FILTER_MESSAGES = {
  panelAriaLabel: "Community filter panel",
  title: "Filter by community",
  closeLabel: "Close filter",
  closeButtonText: "X",
  searchAriaLabel: "Search communities",
  searchPlaceholder: "Search communities",
  clearSearchAriaLabel: "Clear community search",
  clearLabel: "Clear",
  clearAriaLabel: "Clear selected communities",
  selectedLabel: "selected",
  emptyState: "No communities found.",
  listboxAriaLabel: "Community list",
} as const;

export const getSelectVisibleLabel = (_count: number) => "Select all";

export const getSelectVisibleAriaLabel = (count: number) =>
  `Select visible communities (${count})`;

export const getSelectedCountAriaLabel = (count: number) => `Selected count ${count}`;
