// Each year gets its own "subway line" color, drawn from the UAAD brand
// palette. Add more here as the concept grows into "each line = one
// research initiative or a year-round theme," per the original brief.
const PALETTE = ["#DEDEDE"];

export function colorForYear(year: number, allYears: number[]): string {
  const index = allYears.indexOf(year);
  return PALETTE[index % PALETTE.length];
}
