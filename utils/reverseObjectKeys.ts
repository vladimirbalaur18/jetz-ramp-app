export default function reverseObjectProperties<T>(
  obj: Record<string, T>,
  sortFunction: (a: string, b: string) => number
): Record<string, T> {
  return Object.keys(obj)
    .sort(sortFunction) // Sort the keys to ensure a consistent order
    .reverse() // Reverse the order of the keys
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {} as Record<string, T>);
}
