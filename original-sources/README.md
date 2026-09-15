# Local primary sources

Keep your own book files here, or pass the source directory used by your project. Everything here except this README is ignored by Git and the directory is excluded from Git archives.

## Import

From the repository root with Node.js 22+:

```sh
node skills/harry-potter-fanfic/scripts/hp.mjs import
```

The PowerShell compatibility wrapper also works:

```powershell
& .\tools\convert_epub_to_md.ps1
```

The importer supports the supplied English Pottermore EPUB layout. It reads every primary narrative chapter in spine order, including the final epilogue, and excludes front matter and next-book promotional previews from narrative Markdown.

Import overwrites generated same-stem Markdown and `catalogue.local.json`; original EPUBs remain unchanged. The catalogue contains complete chapter text and source hashes and stays local.

## Agent search

```sh
node skills/harry-potter-fanfic/scripts/hp.mjs search --book GoF --query electricity
node skills/harry-potter-fanfic/scripts/hp.mjs read --anchor DH29 --full
```

The files are Git-ignored, so general recursive search may skip them. The local tools read them directly; scoped `rg --no-ignore` also works. Do not force-add source text to Git to make it searchable.

See the [tool guide](../skills/harry-potter-fanfic/references/tools.md), [source guide](../skills/harry-potter-fanfic/references/local-sources.md) and [coverage record](../skills/harry-potter-fanfic/references/coverage.md). Files read by an agent may enter its model-provider context; local storage alone does not mean offline processing.
