# Yellow Pages

Bookmarks with URL templates

# todo

- [x] automatically fill `templateInput` with user's clipboard content
- [x] match and replace input with regex and captured groups
- [ ] introduce tailwindcss and make it look better
- [x] design a URL template scheme
- [x] add an `input:file` to accept user's URL templates and save it somewhere
- [ ] save a history of clicked links to localStorage or indexed DB or whatever
- [x] remove vite template stuff
- [ ] find another way to trigger readFile, try onMouseMove
- [x] document bookmark template scheme here
- [ ] support javascript bookmark templates
- [ ] feat: single input can generate multiple links

# bookmark template scheme

## JSON version

An array of bookmarks. Supported bookmark types are:

- verbatim
- strings wih embbed expressions to reference user input
- match-and-replace with three variants

```json
[
  "www.example.com",
  "example.com/${input}/view",
  {
    "predicate": "uuid-\\w{4}",
    "match": ["uuid-\\w{4}","uuid-\\w{4}"],
    "replace": ["https://example.com/${0}/edit", "https://example.com/${0}/view"]
  }
  {
    "predicate": "uuid-\\w{4}",
    "match": ["uuid-\\w{4}"],
    "replace": ["https://example.com/${0}/edit", "https://example.com/${0}/view"]
  }
]
```

## javascript version

coming soon.

## list of predefined identifiers

1. `${input}`, user input
2. `${0}, ${1}, ${2}, ...`, regex capture groups, see `String.prototype.match`
