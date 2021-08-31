/**
 * Returns true if any items in `itemsSubset` is not included in `items`
 */
export function getExtraItems(items: any[], itemsSubset: any[]): any[] {
  const extraItems = itemsSubset.filter((item) => !items.includes(item));
  return extraItems;
}
