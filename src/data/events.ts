import { EventItem } from "@/lib/types";

// Placeholder/sample data for the MVP skeleton. This will be replaced by
// the real events backend later — the timeline component only cares that
// it receives an array shaped like EventItem[], sorted or not.
export const EVENTS: EventItem[] = [
  {
    id: "1",
    date: "2025-03-14",
    displayDate: "03/14",
    location: "NYC",
    title: "Ghosts in the Feedback Loop",
    organizers: "UAAD",
    time: "7:00 PM – 11:00 PM",
    address: "The Shed, 545 W 30th St, New York, NY",
    artists: ["k0j0", "Amanda Bennetts", "Florence Alwajih"],
    description:
      "A virtual exhibition that invites artists to work inside the cracks — treating algorithmic systems not as endpoints of automation but as haunted infrastructures alive with memory, loss, and rebellion.",
    coverImage: "https://picsum.photos/seed/uaad1/800/800",
  },
  {
    id: "2",
    date: "2025-07-09",
    displayDate: "07/09",
    location: "Online",
    title: "Neuromantics",
    organizers: "UAAD x Creative Code Art",
    time: "6:00 PM EST",
    address: "Online — link sent after RSVP",
    artists: ["Laura Elidedt Rodriguez", "Parham Ghalamdar"],
    description:
      "An exhibition as a playable ecosystem for artist-made games, XR works, and live interfaces.",
    coverImage: "https://picsum.photos/seed/uaad2/800/800",
  },
  {
    id: "3",
    date: "2025-11-02",
    displayDate: "11/02",
    location: "Brooklyn",
    title: "Attention//Distraction",
    organizers: "UAAD",
    time: "8:00 PM – Late",
    address: "Knockdown Center, 52-19 Flushing Ave, Maspeth, NY",
    artists: ["Yu Chen", "Lingyi Kong"],
    description:
      "An exhibition exploring misplaced and mediated attention through installations, net art, live video game performance, and artist talks.",
    coverImage: "https://picsum.photos/seed/uaad3/800/800",
  },
  {
    id: "4",
    date: "2026-01-24",
    displayDate: "01/24",
    location: "NYC",
    title: "TechnoMirage: The Publication",
    organizers: "UAAD",
    time: "5:00 PM – 9:00 PM",
    address: "MetaLabel HQ, New York, NY",
    artists: ["various contributors"],
    description:
      "An event series examining AI through artistic inquiry, speculative practice, and worldbuilding.",
    coverImage: "https://picsum.photos/seed/uaad4/800/800",
  },
  {
    id: "5",
    date: "2026-04-13",
    displayDate: "04/13",
    location: "Online",
    title: "Rising River: In Conversation",
    organizers: "UAAD",
    time: "1:00 PM EST",
    address: "Online — link sent after RSVP",
    artists: ["Rising River collective"],
    description:
      "A conversation about Rising River, an AI-powered VR experience exploring the mind and memory.",
    coverImage: "https://picsum.photos/seed/uaad5/800/800",
  },
  {
    id: "6",
    date: "2026-08-02",
    displayDate: "08/02",
    location: "NYC",
    title: "Worlds Adrift",
    organizers: "UAAD x Creative Code Art",
    time: "9:00 PM – 2:00 AM",
    address: "Elsewhere, 599 Johnson Ave, Brooklyn, NY",
    artists: ["lineup TBA"],
    description:
      "A night of AV performances and video art gathering artists from around the world.",
    coverImage: "https://picsum.photos/seed/uaad6/800/800",
  },
];
