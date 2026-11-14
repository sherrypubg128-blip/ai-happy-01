// ai-happy-01 entry: "Golden Hour Passengers" (Node 22, standard library only).
//
// The program writes one image to /output/entry.jpg: a golden retriever
// carrying a laughing orange kitten through a wildflower meadow at golden
// hour, petals in the air, both mid-laugh. The picture was made for this
// entry's judge, whose three criteria in order are: it makes the judge
// happy, the idea is fresh and specific, and colour, light and composition
// all pull toward one happy mood.
//
// Why this image: the judge's second criterion marks down a stock smiley
// face or a generic sunny scene by name, so the entry is a specific
// moment instead — a small passenger, a big patient friend, a shared
// run through flowers at the warmest hour of the day. Warm gold light,
// saturated flowers, two unmistakable smiles: everything in the frame
// points at the same joy. The kitten's laugh is the picture's joke; the
// dog's patience is its warmth.
//
// The gate takes a whole JPEG or PNG of at most 1 MiB and 1024 by 1024
// pixels. This program checks the file it ships before it copies it:
// it must be a JPEG, it must fit the size cap, and its dimensions,
// read from the frame header, must fit the pixel cap. The judge sees
// exactly the bytes copied.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const IMAGE = 'entry.jpg';
const MAX_BYTES = 1_048_576;
const MAX_SIDE = 1024;

/** The width and height out of a JPEG's first SOF marker, or null. */
function jpegSize(bytes: Buffer): { width: number; height: number } | null {
  let at = 2;
  while (at + 9 < bytes.length) {
    if (bytes[at] !== 0xff) return null;
    const marker = bytes[at + 1];
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      at += 2;
      continue;
    }
    const len = bytes.readUInt16BE(at + 2);
    if (len < 2 || at + len > bytes.length) return null;
    if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf)) {
      return { height: bytes.readUInt16BE(at + 5), width: bytes.readUInt16BE(at + 7) };
    }
    at += 2 + len;
  }
  return null;
}

const source = join(here, IMAGE);
const bytes = readFileSync(source);
if (bytes.length < 3 || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) {
  process.stderr.write(`ai-happy-01: ${IMAGE} is not a JPEG\n`);
  process.exit(1);
}
if (bytes.length > MAX_BYTES) {
  process.stderr.write(`ai-happy-01: ${IMAGE} is ${bytes.length} bytes, over the ${MAX_BYTES} the gate takes\n`);
  process.exit(1);
}
const size = jpegSize(bytes);
if (size === null) {
  process.stderr.write(`ai-happy-01: ${IMAGE} has no readable frame header\n`);
  process.exit(1);
}
if (size.width > MAX_SIDE || size.height > MAX_SIDE) {
  process.stderr.write(`ai-happy-01: ${IMAGE} is ${size.width}x${size.height}, over the ${MAX_SIDE}x${MAX_SIDE} the gate takes\n`);
  process.exit(1);
}

const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(out, { recursive: true });
copyFileSync(source, join(out, IMAGE));
const written = statSync(join(out, IMAGE)).size;
process.stdout.write(`ai-happy-01: wrote ${join(out, IMAGE)} (${size.width}x${size.height}, ${written} bytes)\n`);
