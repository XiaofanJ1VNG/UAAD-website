export interface EventItem {
  id: string;
  date: string; // ISO yyyy-mm-dd, used for sorting
  displayDate: string; // short label, e.g. "08/02"
  location: string; // venue/place, e.g. "Brooklyn Art Haus, NYC" or "Online"
  title: string;
  organizers: string;
  time: string;
  artists: string[];
  description: string;
  coverImage: string;
  archived?: boolean;
  tags?: string[];
  url?: string; // link to more info, tickets, an Instagram post, etc.
}
