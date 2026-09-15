"""Dependency-free release checks; not a full YAML parser or literary evaluator."""
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / 'skills' / 'harry-potter-fanfic'


def check(condition, message):
    if not condition:
        raise ValueError(message)


def main():
    files = [p for p in ROOT.rglob('*') if p.is_file()
             and '.git' not in p.relative_to(ROOT).parts
             and '__pycache__' not in p.parts
             and 'dist' not in p.relative_to(ROOT).parts
             and not ('original-sources' in p.relative_to(ROOT).parts and p.name != 'README.md')]
    text = (SKILL / 'SKILL.md').read_text(encoding='utf-8-sig')
    check(text.startswith('---\n'), 'Missing frontmatter opening')
    header, body = text[4:].split('\n---\n', 1)
    check('name: harry-potter-fanfic' in header.splitlines(), 'Unexpected skill name')
    check('version: "0.1.0-rc.1"' in header, 'Unexpected candidate version')
    check('0.1.0-rc.1' in (ROOT / 'README.md').read_text(), 'README version mismatch')
    desc = re.search(r'^description: (.+)$', header, re.M)
    check(desc and 0 < len(desc.group(1)) <= 1024, 'Invalid description')
    check(len(body.splitlines()) < 500, 'Entrypoint exceeds recommended size')
    for name in ('LICENSE', 'ACKNOWLEDGMENTS.md'):
        check((ROOT / name).read_bytes() == (SKILL / name).read_bytes(), f'{name} copy differs')
    for file in files:
        relative = file.relative_to(ROOT)
        check(file.suffix.lower() not in {'.epub', '.pdf', '.mobi', '.azw', '.azw3'}, f'Book-format file in package: {relative}')
        if file.suffix != '.md':
            continue
        content = file.read_text(encoding='utf-8-sig')
        check('\ufffd' not in content, f'Encoding replacement in {relative}')
        check(not re.search(r'(?m)^(<<<<<<< |=======\s*$|>>>>>>> )', content), f'Conflict marker in {relative}')
        for link in re.findall(r'\]\(([^)]+)\)', content):
            if '://' in link or link.startswith('#'):
                continue
            destination = (file.parent / link.split('#')[0]).resolve()
            check(destination.is_relative_to(ROOT), f'External filesystem link: {relative}: {link}')
            check(destination.exists(), f'Broken link: {relative}: {link}')
        if file.is_relative_to(SKILL):
            check(not re.search(r'Vicky|Zsófi|Hearthbound|C:[/\\]Users[/\\]Alex', content), f'Private project content: {relative}')
    if (ROOT / '.git').exists():
        for probe in ('original-sources/example.epub', 'original-sources/books.md', 'original-sources/nested/book.txt'):
            result = subprocess.run(['git', 'check-ignore', '-q', probe], cwd=ROOT)
            check(result.returncode == 0, f'Source path not ignored: {probe}')
        tracked = subprocess.check_output(['git', 'ls-files'], cwd=ROOT, text=True).splitlines()
        check(all(not p.startswith('original-sources/') or p == 'original-sources/README.md' for p in tracked), 'Source content is tracked')
        result = subprocess.check_output(['git', 'check-attr', 'export-ignore', '--', 'original-sources/'], cwd=ROOT, text=True)
        check(result.rstrip().endswith(': set'), 'Sources not excluded from Git archive')
    print(f'PASS: {len(files)} package files; metadata shape, links, encoding, bundled notices and release boundaries.')
    print('This checks packaging invariants, not general YAML syntax, canon accuracy or prose quality.')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as exc:
        print(f'FAIL: {exc}', file=sys.stderr)
        sys.exit(1)
