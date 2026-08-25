import fs from "node:fs";
import path from "node:path";
import subsetFont from "subset-font";

const FONT_SRC = "public/fonts/ChillJinshuSong_CompactRegular.otf";
const FONT_DST = {
  woff2: "public/fonts/ChillJinshuSong_CompactRegular-subset.woff2",
  woff: "public/fonts/ChillJinshuSong_CompactRegular-subset.woff",
};

const FONT_SIGNATURES = {
  woff2: "wOF2",
  woff: "wOFF",
};

function collectChars() {
  const srcDir = "src";
  const files = [];
  function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      const s = fs.statSync(p);
      if (s.isDirectory()) {
        if (f === "node_modules" || f === ".next") continue;
        walk(p);
      } else if (p.endsWith(".tsx") || p.endsWith(".ts")) {
        files.push(p);
      }
    }
  }
  walk(srcDir);
  const set = new Set();
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const matches = content.match(/[\u4e00-\u9fff]/g);
    if (matches) matches.forEach((c) => set.add(c));
  }
  // Keep punctuation used alongside the CJK copy; ASCII is added below.
  "，。！？：；、（）【】《》·—…".split("").forEach((c) => set.add(c));
  "Han0123456789".split("").forEach((c) => set.add(c));
  for (let codePoint = 32; codePoint < 127; codePoint += 1) {
    set.add(String.fromCodePoint(codePoint));
  }
  return [...set].sort().join("");
}

const chars = collectChars();
console.log(`Collected ${chars.length} unique chars`);

const source = fs.readFileSync(FONT_SRC);
for (const [format, destination] of Object.entries(FONT_DST)) {
  const out = await subsetFont(source, chars, {
    targetFormat: format,
    preserveNameIds: [1, 2, 4, 6, 17],
  });
  if (out.subarray(0, 4).toString("ascii") !== FONT_SIGNATURES[format]) {
    throw new Error(`Invalid ${format} output generated for ${destination}`);
  }
  fs.writeFileSync(destination, out);
  console.log(
    `Subset written to ${destination} (${(fs.statSync(destination).size / 1024).toFixed(1)} KB)`,
  );
}
