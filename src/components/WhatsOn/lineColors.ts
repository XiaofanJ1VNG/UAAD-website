// Each year gets its own "subway line" color, drawn from the UAAD brand
// palette. Add more here as the concept grows into "each line = one
// research initiative or a year-round theme," per the original brief.
const PALETTE = ["#4934E8", "#B554FF", "#D3F668", "#FF6246", "#FF8B32"];

export function colorForYear(year: number, allYears: number[]): string {
  const index = allYears.indexOf(year);
  return PALETTE[index % PALETTE.length];
}
