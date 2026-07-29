// Each year gets its own "subway line" color. Two for now — add more here
// as the concept grows into "each line = one research initiative or a
// year-round theme," per the original brief.
const PALETTE = ["#CBFD50", "#5AC8FA", "#FF6B6B", "#C084FC"];

export function colorForYear(year: number, allYears: number[]): string {
  const index = allYears.indexOf(year);
  return PALETTE[index % PALETTE.length];
}
