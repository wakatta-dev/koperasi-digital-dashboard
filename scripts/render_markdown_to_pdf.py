#!/usr/bin/env python3

from __future__ import annotations

import math
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


PAGE_WIDTH = 595.0
PAGE_HEIGHT = 842.0
MARGIN_X = 52.0
MARGIN_TOP = 56.0
MARGIN_BOTTOM = 56.0


@dataclass(frozen=True)
class TextStyle:
    font_key: str
    font_name: str
    font_size: float
    line_height: float
    indent: float = 0.0
    paragraph_gap: float = 2.0
    char_factor: float = 0.52


NORMAL = TextStyle("F1", "Helvetica", 11.0, 15.0)
BOLD = TextStyle("F2", "Helvetica-Bold", 11.0, 15.0)
ITALIC = TextStyle("F4", "Helvetica-Oblique", 11.0, 15.0)
H1 = TextStyle("F2", "Helvetica-Bold", 20.0, 26.0, paragraph_gap=8.0, char_factor=0.58)
H2 = TextStyle("F2", "Helvetica-Bold", 16.0, 22.0, paragraph_gap=6.0, char_factor=0.57)
H3 = TextStyle("F2", "Helvetica-Bold", 14.0, 19.0, paragraph_gap=5.0, char_factor=0.56)
H4 = TextStyle("F2", "Helvetica-Bold", 12.0, 17.0, paragraph_gap=4.0, char_factor=0.55)
BULLET = TextStyle("F1", "Helvetica", 11.0, 15.0, indent=18.0)
NUMBERED = TextStyle("F1", "Helvetica", 11.0, 15.0, indent=18.0)
TABLE = TextStyle("F3", "Courier", 8.7, 12.0, char_factor=0.60)
CODE = TextStyle("F3", "Courier", 9.0, 12.5, indent=12.0, paragraph_gap=2.0, char_factor=0.60)
RULE = TextStyle("F3", "Courier", 9.0, 12.5, char_factor=0.60)


@dataclass
class RenderLine:
    text: str
    style: TextStyle
    first_line: bool = True


class PDFBuilder:
    def __init__(self) -> None:
        self._objects: list[bytes] = []

    def add_object(self, payload: bytes) -> int:
        self._objects.append(payload)
        return len(self._objects)

    def build(self, page_streams: list[bytes]) -> bytes:
        font_ids = {
            "F1": self.add_object(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"),
            "F2": self.add_object(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"),
            "F3": self.add_object(b"<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>"),
            "F4": self.add_object(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>"),
        }

        content_ids: list[int] = []
        for stream in page_streams:
            payload = b"<< /Length %d >>\nstream\n%s\nendstream" % (len(stream), stream)
            content_ids.append(self.add_object(payload))

        page_ids: list[int] = []
        pages_tree_id = len(self._objects) + len(page_streams) + 1
        for content_id in content_ids:
            page_dict = (
                f"<< /Type /Page /Parent {pages_tree_id} 0 R "
                f"/MediaBox [0 0 {int(PAGE_WIDTH)} {int(PAGE_HEIGHT)}] "
                f"/Resources << /Font << "
                f"/F1 {font_ids['F1']} 0 R /F2 {font_ids['F2']} 0 R "
                f"/F3 {font_ids['F3']} 0 R /F4 {font_ids['F4']} 0 R "
                f">> >> /Contents {content_id} 0 R >>"
            ).encode("ascii")
            page_ids.append(self.add_object(page_dict))

        kids = " ".join(f"{page_id} 0 R" for page_id in page_ids)
        self.add_object(f"<< /Type /Pages /Kids [{kids}] /Count {len(page_ids)} >>".encode("ascii"))
        catalog_id = self.add_object(f"<< /Type /Catalog /Pages {pages_tree_id} 0 R >>".encode("ascii"))

        output = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
        offsets = [0]
        for index, obj in enumerate(self._objects, start=1):
            offsets.append(len(output))
            output.extend(f"{index} 0 obj\n".encode("ascii"))
            output.extend(obj)
            output.extend(b"\nendobj\n")

        xref_offset = len(output)
        output.extend(f"xref\n0 {len(self._objects) + 1}\n".encode("ascii"))
        output.extend(b"0000000000 65535 f \n")
        for offset in offsets[1:]:
            output.extend(f"{offset:010d} 00000 n \n".encode("ascii"))
        output.extend(
            (
                f"trailer\n<< /Size {len(self._objects) + 1} /Root {catalog_id} 0 R >>\n"
                f"startxref\n{xref_offset}\n%%EOF\n"
            ).encode("ascii")
        )
        return bytes(output)


def pdf_hex_string(value: str) -> str:
    encoded = value.encode("cp1252", errors="replace")
    return "<" + encoded.hex().upper() + ">"


def wrap_plain_text(text: str, style: TextStyle, available_width: float) -> list[str]:
    if not text:
        return [""]
    max_chars = max(10, int(available_width / (style.font_size * style.char_factor)))
    words = text.split(" ")
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else current + " " + word
        if len(candidate) <= max_chars:
            current = candidate
            continue
        if current:
            lines.append(current)
        if len(word) <= max_chars:
            current = word
            continue
        start = 0
        while start < len(word):
            chunk = word[start:start + max_chars]
            if len(chunk) == max_chars and start + max_chars < len(word):
                split_at = max(chunk.rfind("-"), chunk.rfind("/"), chunk.rfind("_"))
                if split_at > 10:
                    chunk = word[start:start + split_at + 1]
            lines.append(chunk)
            start += len(chunk)
        current = ""
    if current:
        lines.append(current)
    return lines or [""]


def wrap_preformatted(text: str, style: TextStyle, available_width: float) -> list[str]:
    if text == "":
        return [""]
    max_chars = max(8, int(available_width / (style.font_size * style.char_factor)))
    chunks: list[str] = []
    start = 0
    while start < len(text):
        chunks.append(text[start:start + max_chars])
        start += max_chars
    return chunks


def parse_markdown_lines(text: str) -> list[RenderLine]:
    lines = text.splitlines()
    code_block = False
    rendered: list[RenderLine] = []

    for raw_line in lines:
        line = raw_line.rstrip("\n")
        stripped = line.strip()

        if code_block:
            rendered.extend(RenderLine(chunk, CODE, first_line=index == 0) for index, chunk in enumerate([line]))
            if stripped.startswith("```"):
                code_block = False
            continue

        if stripped.startswith("```"):
            code_block = True
            rendered.append(RenderLine(line, CODE))
            continue

        if stripped == "":
            rendered.append(RenderLine("", NORMAL))
            continue

        if line.startswith("# "):
            rendered.append(RenderLine(line[2:].strip(), H1))
            continue
        if line.startswith("## "):
            rendered.append(RenderLine(line[3:].strip(), H2))
            continue
        if line.startswith("### "):
            rendered.append(RenderLine(line[4:].strip(), H3))
            continue
        if line.startswith("#### "):
            rendered.append(RenderLine(line[5:].strip(), H4))
            continue

        if re.match(r"^\s*[-*] ", line):
            rendered.append(RenderLine(line, BULLET))
            continue

        if re.match(r"^\s*\d+\.\s", line):
            rendered.append(RenderLine(line, NUMBERED))
            continue

        if line.startswith("|") or line.startswith("    "):
            rendered.append(RenderLine(line, TABLE))
            continue

        if stripped.startswith("> "):
            rendered.append(RenderLine(line, ITALIC))
            continue

        if stripped == "---":
            rendered.append(RenderLine(line, RULE))
            continue

        rendered.append(RenderLine(line, NORMAL))

    return rendered


def paginate(render_lines: Iterable[RenderLine]) -> list[list[tuple[RenderLine, str]]]:
    pages: list[list[tuple[RenderLine, str]]] = [[]]
    y = PAGE_HEIGHT - MARGIN_TOP

    for render_line in render_lines:
        style = render_line.style
        indent = style.indent
        if style in (BULLET, NUMBERED):
            prefix_match = re.match(r"^(\s*(?:[-*]|\d+\.)\s+)(.*)$", render_line.text)
            if prefix_match:
                prefix, remainder = prefix_match.groups()
                first_width = PAGE_WIDTH - (MARGIN_X + indent) - MARGIN_X
                wrapped = wrap_plain_text(remainder, style, first_width)
                for index, line_text in enumerate(wrapped):
                    visible = (prefix + line_text) if index == 0 else (" " * len(prefix) + line_text)
                    if y - style.line_height < MARGIN_BOTTOM:
                        pages.append([])
                        y = PAGE_HEIGHT - MARGIN_TOP
                    pages[-1].append((render_line, visible))
                    y -= style.line_height
                y -= style.paragraph_gap
                continue

        available_width = PAGE_WIDTH - (MARGIN_X + indent) - MARGIN_X
        wrap_fn = wrap_preformatted if style in (TABLE, CODE, RULE) else wrap_plain_text
        wrapped_lines = wrap_fn(render_line.text, style, available_width)

        for line_text in wrapped_lines:
            if y - style.line_height < MARGIN_BOTTOM:
                pages.append([])
                y = PAGE_HEIGHT - MARGIN_TOP
            pages[-1].append((render_line, line_text))
            y -= style.line_height

        y -= style.paragraph_gap

    return [page for page in pages if page]


def build_page_stream(page: list[tuple[RenderLine, str]]) -> bytes:
    commands: list[str] = []
    y = PAGE_HEIGHT - MARGIN_TOP
    for render_line, line_text in page:
        style = render_line.style
        x = MARGIN_X + style.indent
        text_hex = pdf_hex_string(line_text)
        commands.append(
            f"BT /{style.font_key} {style.font_size:.2f} Tf 1 0 0 1 {x:.2f} {y:.2f} Tm {text_hex} Tj ET"
        )
        y -= style.line_height
        y -= style.paragraph_gap
    return "\n".join(commands).encode("ascii")


def render_markdown_to_pdf(source: Path, target: Path) -> None:
    markdown_text = source.read_text(encoding="utf-8")
    render_lines = parse_markdown_lines(markdown_text)
    pages = paginate(render_lines)
    if not pages:
        pages = [[]]
    page_streams = [build_page_stream(page) for page in pages]
    pdf = PDFBuilder().build(page_streams)
    target.write_bytes(pdf)


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("usage: render_markdown_to_pdf.py <markdown-file> [<markdown-file> ...]", file=sys.stderr)
        return 1

    for raw_path in argv[1:]:
        source = Path(raw_path).resolve()
        if not source.exists():
            print(f"missing file: {source}", file=sys.stderr)
            return 1
        target = source.with_suffix(".pdf")
        render_markdown_to_pdf(source, target)
        print(str(target))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
