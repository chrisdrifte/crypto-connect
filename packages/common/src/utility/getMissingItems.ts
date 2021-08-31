/**
 * Returns any items in `items` not included in `itemsSubset`
 */
export function getMissingItems(items: any[], itemsSubset: any[]): any[] {
  const missingItems = items.filter((item) => !itemsSubset.includes(item));
  return missingItems;
}
