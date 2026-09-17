#!/usr/bin/env python3
"""Convert the 1,140-page Hungarian DH reflow PDF to private, auditable text.

Requires pypdf. This is an edition-specific importer, not OCR or a translation
corrector. Its input has flattened paragraph formatting, missing accents, and
displaced initials. Preserve those defects rather than inventing source text.
Store outputs in a Git-ignored directory; they contain the complete book.

Example:
    python tools/import_hu_pdf.py --input PRIVATE/book.pdf \
        --output PRIVATE/07-deathly-hallows.md

The default sidecars are <output-stem>.pdf.local.json (one book),
<output-stem>.pdf.pages.jsonl (unmodified per-page extraction), and
<output-stem>.pdf.raw.txt (the same pages separated by form feeds).
"""

from __future__ import annotations

import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
import re
import sys

import pypdf


EDITION_PAGES = 1140
ORDINALS = (
    "ELSŐ MÁSODIK HARMADIK NEGYEDIK ÖTÖDIK HATODIK HETEDIK NYOLCADIK "
    "KILENCEDIK TIZEDIK TIZENEGYEDIK TIZENKETTEDIK TIZENHARMADIK "
    "TIZENNEGYEDIK TIZENÖTÖDIK TIZENHATODIK TIZENHETEDIK TIZENNYOLCADIK "
    "TIZENKILENCEDIK HUSZADIK HUSZONEGYEDIK HUSZONKETTEDIK "
    "HUSZONHARMADIK HUSZONNEGYEDIK HUSZONÖTÖDIK HUSZONHATODIK "
    "HUSZONHETEDIK HUSZONNYOLCADIK HUSZONKILENCEDIK HARMINCADIK "
    "HARMINCEGYEDIK HARMINCKETTEDIK HARMINCHARMADIK HARMINCNEGYEDIK "
    "HARMINCÖTÖDIK HARMINCHATODIK"
).split()
HEADINGS = {f"{ordinal} FEJEZET": i for i, ordinal in enumerate(ORDINALS, 1)}
# The narrative heading for chapter 22 omits FEJEZET in this PDF.
HEADINGS.update({"HUSZONKETTEDIK": 22, "EPILÓGUS": 37})
END_SENTENCE = re.compile(r'[.!?…][”’\")\]]*$')
DIALOGUE = re.compile(r'^(?:[-–—]\s*|[„“"])[^\s]')


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def compact(text: str) -> str:
    return " ".join(text.split())


def location(line: dict) -> dict:
    return {key: line[key] for key in ("page", "line")}


def paragraphs(lines: list[dict]) -> str:
    """Reflow soft lines; conservatively infer paragraph starts, without edits.

    Source paragraph spacing/indentation has already been lost. Dialogue starts
    and sentence-final lines followed by uppercase text are useful but imperfect
    cues. Page breaks alone are never a paragraph boundary. No dehyphenation,
    spelling changes, initial relocation, or guessed diacritics are performed.
    """
    result: list[str] = []
    current: list[str] = []
    for item in lines:
        text = compact(item["text"])
        if not text:
            continue
        previous = current[-1] if current else ""
        starts = bool(DIALOGUE.match(text)) or (
            bool(END_SENTENCE.search(previous)) and text[0].isupper()
        )
        if current and starts:
            result.append(" ".join(current))
            current = []
        current.append(text)
    if current:
        result.append(" ".join(current))
    return "\n\n".join(result)


def extract(source: Path) -> tuple[list[str], list[dict]]:
    reader = pypdf.PdfReader(source)
    if reader.is_encrypted:
        raise ValueError("Encrypted PDF is not supported")
    if len(reader.pages) != EDITION_PAGES:
        raise ValueError(f"Expected {EDITION_PAGES} PDF pages; got {len(reader.pages)}")
    pages: list[str] = []
    lines: list[dict] = []
    for page_number, page in enumerate(reader.pages, 1):
        text = page.extract_text(extraction_mode="plain")
        if not text.strip():
            raise ValueError(f"Empty text layer on page {page_number}; OCR review required")
        pages.append(text)
        for number, line in enumerate(text.splitlines(), 1):
            if line.strip():
                lines.append({"page": page_number, "line": number, "text": line.strip()})
        if page_number % 100 == 0:
            print(f"Extracted {page_number}/{EDITION_PAGES} pages", file=sys.stderr)
    return pages, lines


def compare_pages(source: Path, pages: list[str]) -> dict:
    """Optional independent text-layer check; differences are reported, not fixed."""
    import pdfplumber

    token_differences = []
    sequence_differences = []
    character_differences = []
    with pdfplumber.open(source) as document:
        if len(document.pages) != len(pages):
            raise ValueError("Extraction engines disagree on PDF page count")
        for number, page in enumerate(document.pages, 1):
            primary = pages[number - 1]
            secondary = page.extract_text() or ""
            if primary.split() != secondary.split():
                token_differences.append(number)
            a, b = "".join(primary.split()), "".join(secondary.split())
            if a != b:
                sequence_differences.append(number)
            if Counter(a) != Counter(b):
                character_differences.append(number)
            page.close()
            if number % 100 == 0:
                print(f"Cross-checked {number}/{len(pages)} pages", file=sys.stderr)
    return {"backend": "pdfplumber", "backend_version": pdfplumber.__version__,
            "pages_compared": len(pages), "token_difference_pages": token_differences,
            "nonwhitespace_sequence_difference_pages": sequence_differences,
            "nonwhitespace_character_count_difference_pages": character_differences,
            "interpretation": "Independent text-layer comparison, not OCR or semantic verification"}


def convert(source: Path, output: Path, metadata: Path, raw_output: Path,
            verify_with_pdfplumber: bool = False) -> dict:
    raw_text_output = raw_output.with_name(output.stem + ".pdf.raw.txt")
    paths = [output, metadata, raw_output, raw_text_output]
    if len(set(paths + [source])) != 5:
        raise ValueError("Input and all output paths must be distinct")
    if any(p.suffix.lower() == ".pdf" for p in paths):
        raise ValueError("Refusing to overwrite a PDF with extracted text")
    pages, original_lines = extract(source)
    # Persist the untouched text layer even if a later edition check fails.
    for target in paths:
        target.parent.mkdir(parents=True, exist_ok=True)
    raw_bytes = b"".join(
        (json.dumps({"page": i, "text": text, "sha256": digest(text.encode("utf-8"))},
                    ensure_ascii=False) + "\n").encode("utf-8")
        for i, text in enumerate(pages, 1)
    )
    raw_output.write_bytes(raw_bytes)
    raw_text_output.write_bytes("\f".join(pages).encode("utf-8"))

    page_labels = [line for line in original_lines if re.fullmatch(r"[0-9]+", line["text"])]
    labels = [int(line["text"]) for line in page_labels]
    # Validate the complete original folio sequence before removing number-only
    # lines, including folios embedded in the middle of reflowed PDF pages.
    if labels != list(range(1, 524)):
        raise ValueError("Original folios do not form 1..523; review numeric lines before removal")
    lines = [line for line in original_lines if not re.fullmatch(r"[0-9]+", line["text"])]
    markers = [(i, HEADINGS[line["text"]]) for i, line in enumerate(lines)
               if line["text"] in HEADINGS]
    if [number for _, number in markers] != list(range(1, 38)) * 2:
        raise ValueError("Expected 37 contents headings followed by 37 narrative headings")
    narrative = markers[37:]
    chapters = []
    ranges = []
    title_differences = []
    included_lines = 0
    source_chars: Counter = Counter()
    output_chars: Counter = Counter()
    for j, (start, number) in enumerate(narrative):
        stop = narrative[j + 1][0] if j + 1 < len(narrative) else len(lines)
        heading, title_line = lines[start:start + 2]
        title = title_line["text"]
        body_lines = lines[start + 2:stop]
        text = paragraphs(body_lines)
        original = compact(" ".join(line["text"] for line in body_lines))
        if compact(text) != original:
            raise ValueError(f"Non-whitespace narrative change in chapter {number}")
        words = len(text.split())
        if words < 100:
            raise ValueError(f"Implausibly short chapter {number}")
        anchor = f"DH{number}" if number <= 36 else "DH-epilogue"
        chapters.append({
            "anchor": anchor, "number": number, "title": title,
            "entry": f"pdf:page={heading['page']};line={heading['line']}",
            "words": words, "sha256": digest(text.encode("utf-8")), "text": text,
        })
        ranges.append({"anchor": anchor, "heading": location(heading),
                       "title": location(title_line), "first": location(body_lines[0]),
                       "last": location(body_lines[-1]), "source_lines": len(body_lines),
                       "normalized_text_sha256": digest(original.encode("utf-8"))})
        contents_title = lines[markers[j][0] + 1]["text"]
        if title != contents_title:
            title_differences.append({"anchor": anchor, "contents": contents_title,
                                      "narrative": title})
        included_lines += len(body_lines)
        source_chars.update(c for c in original if not c.isspace())
        output_chars.update(c for c in text if not c.isspace())
    front = lines[:narrative[0][0]]
    if included_lines + 74 + len(front) + len(page_labels) != len(original_lines):
        raise ValueError("Line accounting failed")
    if source_chars != output_chars:
        raise ValueError("Narrative Unicode character accounting failed")
    replacement_count = sum(text.count("\ufffd") for text in pages)
    # This is only a candidate list: a standalone A can also be a real article.
    isolated = [dict(line) for line in lines[narrative[0][0]:]
                if re.fullmatch(r"[A-ZÁÉÍÓÖŐÚÜŰ]", line["text"])]
    conversion = {
        "format_version": 1, "converter": "tools/import_hu_pdf.py",
        "edition": "hu-dh-reflow-1140-pages-523-folios",
        "backend": "pypdf", "backend_version": pypdf.__version__,
        "pdf_pages": len(pages), "nonempty_text_pages": len(pages), "ocr_performed": False,
        "raw_pages": {"file": raw_output.name, "sha256": digest(raw_bytes)},
        "raw_text": {"file": raw_text_output.name,
                     "sha256": digest(raw_text_output.read_bytes()), "page_separator": "form feed"},
        "narrative_ranges": ranges, "title_policy": "Exact narrative headings; no accent restoration",
        "contents_title_differences": title_differences,
        "removed_folios": page_labels,
        "omitted_front_matter": {"lines": len(front), "first": location(front[0]),
                                 "last": location(front[-1]),
                                 "description": "Title, dedication and contents; retained in raw pages"},
        "omitted_back_matter": [],
        "paragraph_policy": "Heuristic dialogue/sentence boundaries; join soft wraps across pages",
        "narrative_edits": "Whitespace only; no OCR, accent guessing, dehyphenation or initial relocation",
        "verification": {"narrative_whitespace_normalized_equality": True,
                         "all_nonempty_lines_accounted_for": True,
                         "unicode_character_counts_equal": True,
                         "narrative_source_lines": included_lines,
                         "replacement_characters": replacement_count,
                         "diacritic_counts": {c: source_chars[c] for c in "áéíóöőúüűÁÉÍÓÖŐÚÜŰ"},
                         "semantic_reading": False, "full_editorial_verification": False},
        "isolated_capital_candidates": isolated,
        "warnings": [
            "The PDF visibly lacks many Hungarian accents. Existing characters are preserved; missing accents cannot be reliably recovered from this source.",
            "Chapter-opening initials are displaced in this edition, sometimes into later lines. No letters are silently moved or inserted.",
            "Paragraph boundaries are inferred: the PDF has flattened indentation and spacing. Exact original paragraphs cannot be certified.",
            "Spelling, inconsistent terminology, damaged word spacing and punctuation remain source-faithful; this is not an editorially corrected edition.",
            "No OCR was run. Text-layer coverage does not establish translation quality or fidelity to a published Hungarian edition.",
        ],
    }
    if replacement_count:
        conversion["warnings"].append("Unicode replacement characters remain; inspect the raw text layer.")
    if verify_with_pdfplumber:
        comparison = compare_pages(source, pages)
        conversion["verification"]["independent_extraction"] = comparison
        if comparison["token_difference_pages"]:
            conversion["warnings"].append(
                "Extraction engines differ in word spacing or reading order on the recorded pages; character and sequence comparisons are recorded separately."
            )
    book = {"code": "DH", "title": "Harry Potter és a Halál ereklyéi", "language": "hu", "source": source.name,
            "sha256": digest(source.read_bytes()), "chapters": chapters,
            "excluded": [], "conversion": conversion}
    markdown = "# Harry Potter és a Halál ereklyéi\n\n" + "\n\n".join(
        f"## {c['anchor']}: {c['title']}\n\n{c['text']}" for c in chapters
    ) + "\n"
    output.write_bytes(markdown.encode("utf-8"))
    metadata.write_bytes((json.dumps(book, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
    # Verify the actual persisted artifacts, including exact UTF-8 hashes.
    saved = json.loads(metadata.read_text(encoding="utf-8"))
    saved_md = output.read_text(encoding="utf-8")
    for chapter in saved["chapters"]:
        if (digest(chapter["text"].encode("utf-8")) != chapter["sha256"]
                or len(chapter["text"].split()) != chapter["words"]
                or f"## {chapter['anchor']}: {chapter['title']}\n\n{chapter['text']}" not in saved_md):
            raise ValueError(f"Persisted artifact verification failed: {chapter['anchor']}")
    return {"pdf_pages": len(pages), "chapters": len(chapters),
            "words": sum(c["words"] for c in chapters), "removed_folios": len(page_labels),
            "replacement_characters": replacement_count, "output": str(output),
            "metadata": str(metadata), "raw_pages": str(raw_output),
            "raw_text": str(raw_text_output), "verification": "pass; see conversion warnings"}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--input", type=Path, required=True, help="Unmodified source PDF")
    parser.add_argument("--output", type=Path, required=True, help="Private output Markdown path")
    parser.add_argument("--metadata", type=Path, help="Private single-book JSON path")
    parser.add_argument("--raw-output", type=Path, help="Private raw per-page JSONL path")
    parser.add_argument("--verify-with-pdfplumber", action="store_true",
                        help="Compare all pages with a second engine and record discrepancies")
    args = parser.parse_args()
    output = args.output.resolve()
    metadata = (args.metadata or output.with_suffix(".pdf.local.json")).resolve()
    raw_output = (args.raw_output or output.with_suffix(".pdf.pages.jsonl")).resolve()
    try:
        result = convert(args.input.resolve(strict=True), output, metadata, raw_output,
                         args.verify_with_pdfplumber)
    except (ValueError, OSError, ImportError, pypdf.errors.PdfReadError) as exc:
        print(f"Conversion failed: {exc}", file=sys.stderr)
        return 1
    print(json.dumps(result, ensure_ascii=True, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
