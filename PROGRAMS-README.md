# Updating Programs

The archive (`program.html`) and individual pages (`program-item.html?slug=...`) both read `programs.json`. Place entries in newest-first order within `IRL`, `Virtual`, and `Publications`.

Copy an existing object to add a program. Required fields:

- `slug`: unique lowercase URL name, for example `new-uaad-program`
- `title`, `date`, `year`, `venue`, `section`, `introduction`
- `tags`: list of labels used in the archive
- `artists`: grid entries with `name`, `headshot`, and `piece`
- `images`: gallery entries with `src`, `alt`, and optional `caption`
- `url`: external event page, shown as a button at the end of the project page

Example:

```json
{
  "slug": "new-uaad-program",
  "title": "New UAAD Program",
  "date": "Oct 18, 2026",
  "year": "2026",
  "venue": "Hex House, Brooklyn",
  "section": "IRL",
  "tags": ["Performance", "Community Gathering"],
  "description": "Short archive summary.",
  "introduction": "A longer introduction for the individual project page.",
  "artists": [
    {"name": "Artist Name", "headshot": "images/new-program/artist.webp", "piece": "Title of Work"}
  ],
  "images": [
    {"src": "images/new-program/01.webp", "alt": "Opening night", "caption": "Photo by Photographer Name"},
    {"src": "images/new-program/02.webp", "alt": "Installation view"}
  ],
  "url": "https://example.com/event"
}
```

Leave `headshot` or `piece` empty when unavailable. The artist grid uses a letter placeholder for missing headshots. Use `"artists": []` when artist credits are unavailable, and `"images": []` when photos are unavailable. The archive gallery arrows activate once an entry has at least two images.

Some original entries are missing headshots, work titles, and additional photos. Existing first images are retained. The homepage timeline uses the separate `curation.json`; add a program to both files only if it should appear there too.

To preview locally, run `python3 -m http.server 8000` in this folder and open `http://localhost:8000/program.html`.
