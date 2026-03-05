export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];

export const DEFAULT_TABLE_PAGINATION = {
  defaultPageSize: DEFAULT_PAGE_SIZE,
  showSizeChanger: true,
  pageSizeOptions: PAGE_SIZE_OPTIONS.map(String),
};
