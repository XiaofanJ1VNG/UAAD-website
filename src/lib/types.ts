export interface EventItem {
  id: string;
  date: string; // ISO yyyy-mm-dd, used for sorting
  displayDate: string; // short label, e.g. "08/02"
  location: string; // e.g. "NYC" or "Online"
  title: string;
  organizers: string;
  time: string;
  address: string;
  artists: string[];
  description: string;
  coverImage: string;
  archived?: boolean;
}
