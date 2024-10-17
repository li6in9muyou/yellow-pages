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

```json
[
  "strings are treated as urls verbatim",
  "unless it contains embedded experssions, e.g. ${input}",
  {
    "predicate": "this is passed to new RegExp(...), if it matches, this template is used",
    "match": "another regex to match against user input or an empty string",
    "replace": "construct url using capture groups of 'match' or verbatim if match is empty"
  }
]
```

## javascript version

coming soon.

## list of predefined identifiers

1. `${input}`, user input
2. `${0}, ${1}, ${2}, ...`, regex capture groups, see `String.prototype.match`
