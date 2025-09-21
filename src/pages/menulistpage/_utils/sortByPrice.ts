//_utils / sortByPrice.ts;
export const sortByPriceDesc = <T>(
  arr: T[],
  getPrice: (item: T) => number | string | null | undefined
): T[] => {
  return [...arr].sort((a, b) => {
    const pa = Number(getPrice(a) ?? 0);
    const pb = Number(getPrice(b) ?? 0);
    return pb - pa;
  });
};
