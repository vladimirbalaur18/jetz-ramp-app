export const SafeNumber = (value: any) => typeof value === "number" ? value.toFixed(2) : value