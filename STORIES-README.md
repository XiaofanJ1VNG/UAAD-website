# Updating UAAD Stories

The homepage and Stories use the same header and footer from `shared.js` and `shared.css`. Edit those two files when you want a change to appear on every page.

## Add a story

1. Open `stories.json` and copy one complete object in the array. Give it a unique `slug` (lowercase, with hyphens), then edit `title`, `date`, `read`, `author`, `tags`, `image`, `excerpt`, and `url`.
2. Choose tags from: `Art`, `Design`, `Photography`, `Film`, `Tech`, `Music`, `Craft`, `Essay`, `Event`, `Interview`. A story can have several tags. Example: `"tags": ["Interview", "Tech"]`.
3. Write your own content in `body`. The article page at `story.html?slug=your-slug` displays it automatically. Blocks can be `paragraph`, `heading`, `quote`, or `image`.
4. Place the new story where you want it in the array, typically newest first. No HTML edits are required.

Example object:

```json
{
  "slug": "example-new-story",
  "title": "A New UAAD Story",
  "date": "Sep 27, 2026",
  "read": "5 min read",
  "author": "Amy Jiang",
  "tags": ["Interview", "Tech"],
  "category": "Interview",
  "image": "images/example-cover.webp",
  "imageAlt": "Description of the cover image",
  "excerpt": "A brief introduction to the story.",
  "url": "https://www.uaad.art/post/original-story",
  "body": [
    {"type": "paragraph", "text": "Opening paragraph."},
    {"type": "heading", "text": "About the artist"},
    {"type": "paragraph", "text": "More context."},
    {"type": "image", "src": "images/example-detail.webp", "alt": "Artwork description", "caption": "Artwork credit."},
    {"type": "quote", "text": "A short pull quote."}
  ]
}
```

The existing articles have summaries rather than copied full text; each links to its complete original on uaad.art. A full local article appears as you add blocks to `body`. For local preview run `python3 -m http.server 8000` from the folder, then visit `http://localhost:8000/stories.html`. Opening the HTML directly as a file cannot load JSON in most browsers.
