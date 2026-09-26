"use client";

import { ImageDown, Loader2 } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";
import { useTheme } from "next-themes";

import { estimateReadingMinutes, type Post } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

/** 海报画布尺寸：1080×1440（3:4），适配聊天与社交平台分享 */
const W = 1080;
const H = 1440;
const PAD = 88;
const ACCENT = "#00bc7d";
/** 正文字距：折行测量与逐字符绘制共用同一值 */
const BODY_TRACKING = 2;

/** globals.css 主题变量的 sRGB 等值：离屏 canvas 无法读 CSS 变量，按色板直接取色 */
const PALETTES = {
  light: {
    bg: "#ffffff",
    fg: "#0a0a0a",
    muted: "#737373",
    border: "#e5e5e5",
    glowOuter: 0.1,
    glowInner: 0.16,
    quoteCtx: 0.16,
  },
  dark: {
    bg: "#121212",
    fg: "#fafafa",
    muted: "#a3a3a3",
    border: "rgba(255, 255, 255, 0.1)",
    glowOuter: 0.2,
    glowInner: 0.3,
    quoteCtx: 0.22,
  },
} as const;

/** CJK 字符与全角标点：折行时逐字可断，避免「，」这类标点黏在英文词尾被甩到行首 */
const CJK =
  "\\u3000-\\u303f\\u3400-\\u4dbf\\u4e00-\\u9fff\\uf900-\\ufaff\\uff00-\\uffef\\u2018-\\u201d\\u2026\\u2014";
const TOKEN_RE = new RegExp(`[${CJK}]|[^\\s${CJK}]+`, "g");

/** 按词/字混排折行：CJK 逐字断行，连续拉丁字符整词不断，超长词（长链接等）硬切；
 * overflow=clip 时超出部分直接丢弃（供正文渐隐排版用），ellipsis 时末行补省略号；
 * tracking 为绘制时逐字符追加的字距，测量与绘制须同值 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
  overflow: "ellipsis" | "clip" = "ellipsis",
  tracking = 0,
): string[] {
  const width = (s: string) =>
    ctx.measureText(s).width + tracking * Math.max(0, [...s].length - 1);
  const lines: string[] = [];
  let line = "";
  let pendingSpace = false;

  const append = (token: string) => {
    const gap = pendingSpace && line ? " " : "";
    if (width(line + gap + token) <= maxWidth) {
      line += gap + token;
      pendingSpace = false;
      return;
    }
    if (line) lines.push(line);
    line = token;
    pendingSpace = false;
  };

  for (const raw of text.match(TOKEN_RE) ?? []) {
    if (/^\s+$/.test(raw)) {
      if (line) pendingSpace = true;
      continue;
    }
    let rest = raw;
    while (width(rest) > maxWidth && rest.length > 1) {
      let n = rest.length;
      while (n > 1 && width(rest.slice(0, n)) > maxWidth) n--;
      append(rest.slice(0, n));
      if (line) {
        lines.push(line);
        line = "";
      }
      rest = rest.slice(n);
    }
    append(rest);
  }
  if (line) lines.push(line);

  if (lines.length > maxLines) {
    lines.length = maxLines;
    if (overflow === "ellipsis") {
      let last = lines[maxLines - 1];
      while (last && width(`${last}…`) > maxWidth) last = last.slice(0, -1);
      lines[maxLines - 1] = `${last}…`;
    }
  }
  return lines;
}

/** 逐字符绘制带字距的文本（canvas 无 letter-spacing），align=right 时 x 为右边界 */
function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
  align: "left" | "right",
) {
  const chars = [...text];
  const widths = chars.map((ch) => ctx.measureText(ch).width);
  const total =
    widths.reduce((a, b) => a + b, 0) + tracking * Math.max(0, chars.length - 1);
  let cx = align === "right" ? x - total : x;
  ctx.textAlign = "left";
  chars.forEach((ch, i) => {
    ctx.fillText(ch, cx, y);
    cx += widths[i] + tracking;
  });
}

function pathRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** lucide 风格线性小图标（24 viewBox 坐标），通过 drawIcon 缩放上屏 */
function iconCalendar(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") ctx.roundRect(3, 4, 18, 18, 3);
  else ctx.rect(3, 4, 18, 18);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(8, 2);
  ctx.lineTo(8, 6);
  ctx.moveTo(16, 2);
  ctx.lineTo(16, 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(3, 10);
  ctx.lineTo(21, 10);
  ctx.stroke();
}

function iconClock(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.arc(12, 12, 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(12, 6);
  ctx.lineTo(12, 12);
  ctx.lineTo(16, 14);
  ctx.stroke();
}

function drawIcon(
  ctx: CanvasRenderingContext2D,
  draw: (ctx: CanvasRenderingContext2D) => void,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 24, size / 24);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  draw(ctx);
  ctx.restore();
}

/** JetBrains Mono 的实际 family 名由 next/font 哈希生成，从 CSS 变量读回 */
function monoFamily(): string {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-jetbrains-mono")
    .trim();
  return v || '"MiSans", sans-serif';
}

/** 加载图片，超时或失败返回 null（调用方走降级绘制） */
function loadImage(src: string, timeout = 2500): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => resolve(null), timeout);
    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    img.src = src;
  });
}

/** 文章纯文本：按空行分段流入（整行图片跳过，行内标记剥除），供海报正文与节选定位 */
function articlePlainText(post: Post): string {
  const blocks = (post.content ?? "").split(/\n{2,}/);
  const parts: string[] = [];
  for (const raw of blocks) {
    const s = raw.trim();
    if (!s || /^(-{3,}|\*{3,})$/.test(s)) continue;
    if (/^!\[[^\]]*\]\([^)]+\)$/.test(s)) continue;
    parts.push(
      s
        .replace(/^##\s+/, "")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[#>*`~]/g, "")
        .trim(),
    );
  }
  return parts.join("\n");
}

/** 海报正文：取文章正文开头 */
function posterBody(post: Post): string {
  return articlePlainText(post).slice(0, 600);
}

/** 选区节选文本规整：块间换行转为分段标记，压缩段内空白并限长 */
function normQuote(raw: string): string {
  return raw
    .replace(/\r/g, "")
    .split(/\n+/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .slice(0, 400);
}

/** 节选 + 前后文：在全文流中定位选区，前文向左截取并对齐词边界（不超过 beforeMax，
 * 保证选区起点落在可视行数内），返回拼接文本与选区高亮区间（UTF-16 下标） */
function quoteWithContext(
  flow: string,
  sel: string,
  beforeMax: number,
): { text: string; hiStart: number; hiEnd: number } {
  const hiStart = flow.indexOf(sel);
  const hiEnd = hiStart + sel.length;
  let bStart = Math.max(0, hiStart - beforeMax);
  if (bStart > 0) {
    const sp = flow.lastIndexOf(" ", hiStart - 1);
    if (sp > bStart) bStart = sp + 1;
  }
  const aEnd = Math.min(flow.length, hiEnd + 800);
  return {
    text: `${flow.slice(bStart, hiStart)}${sel}${flow.slice(hiEnd, aEnd)}`,
    hiStart: hiStart - bStart,
    hiEnd: hiEnd - bStart,
  };
}

/** 折行并记录每行在源文本中的起始下标（源文本须先把连续空白折叠为单空格），
 * 供节选海报逐字区分选区与前后文；超出 maxLines 的部分直接丢弃 */
function wrapWithOffsets(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
  tracking: number,
): { text: string; start: number }[] {
  const width = (s: string) =>
    ctx.measureText(s).width + tracking * Math.max(0, [...s].length - 1);
  const lines: { text: string; start: number }[] = [];
  let line = "";
  let lineStart = 0;
  let pendingSpace = false;

  const append = (piece: string, pieceStart: number) => {
    const gap = pendingSpace && line ? " " : "";
    if (width(line + gap + piece) <= maxWidth) {
      if (!line) lineStart = pieceStart;
      line += gap + piece;
      pendingSpace = false;
      return;
    }
    if (line) lines.push({ text: line, start: lineStart });
    line = piece;
    lineStart = pieceStart;
    pendingSpace = false;
  };

  for (const m of text.matchAll(TOKEN_RE)) {
    const token = m[0];
    if (/^\s+$/.test(token)) {
      if (line) pendingSpace = true;
      continue;
    }
    let rest = token;
    let restStart = m.index ?? 0;
    while (width(rest) > maxWidth && rest.length > 1) {
      let n = rest.length;
      while (n > 1 && width(rest.slice(0, n)) > maxWidth) n--;
      append(rest.slice(0, n), restStart);
      if (line) {
        lines.push({ text: line, start: lineStart });
        line = "";
      }
      rest = rest.slice(n);
      restStart += n;
    }
    append(rest, restStart);
  }
  if (line) lines.push({ text: line, start: lineStart });

  if (lines.length > maxLines) lines.length = maxLines;
  return lines;
}

/** 绘制分享海报并导出 PNG data URL；传入 quote 时以节选为正文；
 * 字体/头像/二维码任一加载失败均降级绘制，不阻塞出图 */
async function renderPoster(
  post: Post,
  dark: boolean,
  quote?: string,
): Promise<string> {
  const c = PALETTES[dark ? "dark" : "light"];
  const mono = monoFamily();
  const serif = '"Noto Serif SC", "Songti SC", "SimSun", serif';
  const sans = '"MiSans", sans-serif';

  // 字体就绪后再绘制（子集加载失败时 3 秒后放行，退化为系统字体）
  await Promise.race([
    Promise.all([
      document.fonts.load(`600 62px ${serif}`, post.title),
      document.fonts.load(`400 34px ${sans}`, post.title),
      document.fonts.load(`500 36px ${mono}`, post.title),
    ]).catch(() => undefined),
    new Promise((r) => setTimeout(r, 3000)),
  ]);

  const link = `${location.origin}/blog/${post.slug}`;
  const [avatar, qr] = await Promise.all([
    loadImage("/icon.png"),
    import("qrcode")
      .then((m) =>
        m.default.toDataURL(link, {
          margin: 0,
          width: 320,
          errorCorrectionLevel: "M",
          // 二维码固定深色置于白卡上，暗色海报下也保证可扫
          color: { dark: "#0a0a0aff", light: "#00000000" },
        }),
      )
      .then((url) => loadImage(url))
      .catch(() => null),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas 2d 不可用");
  ctx.textBaseline = "middle";

  // 背景 + 底部弥散光晕（对应站点 .bottom-glow 的双层径向渐变）
  ctx.fillStyle = c.bg;
  ctx.fillRect(0, 0, W, H);
  const glow = (cy: number, r: number, alpha: number) => {
    const g = ctx.createRadialGradient(W / 2, cy, 0, W / 2, cy, r);
    g.addColorStop(0, `rgba(0, 188, 125, ${alpha})`);
    g.addColorStop(1, "rgba(0, 188, 125, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  };
  glow(H + 180, 820, c.glowOuter);
  glow(H + 60, 460, c.glowInner);

  const inner = W - PAD * 2;

  // 标题：与文章页标题同用思源宋体
  ctx.font = `600 62px ${serif}`;
  const titleLines = wrapText(ctx, post.title, inner, 4);
  const titleTop = 236;
  const titleLH = 88;
  const metaCenter = titleTop + titleLines.length * titleLH + 57;
  const barTop = metaCenter + 59;

  // 正文块：从绿色短杠下方铺到页脚上方，行数按剩余空间取
  const bodyLH = 58;
  const bodyTop = barTop + 63;
  const bodyBottomLimit = H - PAD - 172 - 40 - 44 - 56;
  ctx.font = `400 34px ${sans}`;
  const maxBodyLines = Math.max(
    1,
    Math.floor((bodyBottomLimit - bodyTop) / bodyLH),
  );

  // 短节选（≤120 字）在全文流中定位后补足前后文：选区实色、前后文淡化；
  // 定位失败或选区过长时退化为纯节选/全文开头，超出行数时尾部渐隐示意未完
  let quoteCtx: { text: string; hiStart: number; hiEnd: number } | null = null;
  if (quote) {
    const sel = quote.replace(/\s+/g, " ").trim();
    const flow = articlePlainText(post).replace(/\s+/g, " ").trim();
    // 34px 下每行约 24 字：前文窗口压缩到「可排字数 - 选区长度」内，选区起点必可视
    const beforeMax = Math.max(0, Math.min(120, maxBodyLines * 24 - sel.length - 2));
    if (sel.length >= 2 && sel.length <= 120 && flow.includes(sel)) {
      quoteCtx = quoteWithContext(flow, sel, beforeMax);
    }
  }
  const quoteLines = quoteCtx
    ? wrapWithOffsets(ctx, quoteCtx.text, inner, maxBodyLines, BODY_TRACKING)
    : null;
  const bodyLines: string[] = quoteLines
    ? quoteLines.map((l) => l.text)
    : wrapText(
        ctx,
        quote?.trim() ? quote : posterBody(post),
        inner,
        maxBodyLines,
        "clip",
        BODY_TRACKING,
      );

  // 品牌行：头像 + BLOG（同博客导航），右侧分类 tag（同侧栏 #TOC 角标的样式）
  const brandCy = 128;
  const avSize = 64;
  if (avatar) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(PAD + avSize / 2, brandCy, avSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatar, PAD, brandCy - avSize / 2, avSize, avSize);
    ctx.restore();
  } else {
    ctx.fillStyle = ACCENT;
    ctx.beginPath();
    ctx.arc(PAD + avSize / 2, brandCy, avSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `500 30px ${mono}`;
    ctx.fillText("H", PAD + avSize / 2, brandCy + 2);
  }
  ctx.fillStyle = c.fg;
  ctx.font = `500 36px ${mono}`;
  drawTracked(ctx, "BLOG", PAD + avSize + 24, brandCy, 8, "left");
  ctx.fillStyle = c.muted;
  ctx.font = `400 24px ${mono}`;
  drawTracked(ctx, `#${post.category}`, W - PAD, brandCy, 2, "right");

  ctx.fillStyle = c.fg;
  ctx.font = `600 62px ${serif}`;
  titleLines.forEach((line, i) =>
    ctx.fillText(line, PAD, titleTop + titleLH / 2 + i * titleLH),
  );

  // 元信息：日历/时钟线性小图标 + 文本（同页头元信息样式）
  ctx.fillStyle = c.muted;
  ctx.font = `400 26px ${sans}`;
  const iconSize = 26;
  let mx = PAD;
  drawIcon(ctx, iconCalendar, mx, metaCenter - iconSize / 2, iconSize, c.muted);
  mx += iconSize + 12;
  const dateText = post.createdAt.slice(0, 10);
  ctx.fillText(dateText, mx, metaCenter);
  mx += ctx.measureText(dateText).width;
  if (post.wordCount > 0) {
    const minutes = `约 ${estimateReadingMinutes(post.wordCount)} 分钟`;
    mx += 30;
    ctx.fillText("·", mx, metaCenter);
    mx += ctx.measureText("·").width + 30;
    drawIcon(ctx, iconClock, mx, metaCenter - iconSize / 2, iconSize, c.muted);
    mx += iconSize + 12;
    ctx.fillText(minutes, mx, metaCenter);
  }

  // 绿色短杠分隔（同站内 #00bc7d 点缀）
  ctx.fillStyle = ACCENT;
  pathRoundRect(ctx, PAD, barTop, 56, 7, 3.5);
  ctx.fill();

  // 正文绘制在独立画布后整体合成，特殊透明度/模糊不会擦伤背景与光晕
  if (bodyLines.length > 0) {
    const off = document.createElement("canvas");
    off.width = W;
    off.height = H;
    const octx = off.getContext("2d");
    if (octx) {
      octx.textBaseline = "middle";
      octx.font = `400 34px ${sans}`;
      octx.fillStyle = c.fg;
      // 选区所在的首行；找不到（理论上不会发生）时退化为普通渐隐分支
      const hiLineStart =
        quoteLines && quoteCtx
          ? quoteLines.findIndex(
              (l) =>
                l.start + l.text.length > quoteCtx.hiStart &&
                l.start < quoteCtx.hiEnd,
            )
          : -1;
      if (quoteLines && quoteCtx && hiLineStart >= 0) {
        const qc = quoteCtx;
        // 前后文按「离选区行的行距」做上下渐隐+模糊包络
        const hiLineEnd = quoteLines.reduce(
          (acc, l, i) =>
            l.start + l.text.length > qc.hiStart && l.start < qc.hiEnd ? i : acc,
          hiLineStart,
        );
        // 节选 + 前后文：逐字绘制，选区实色，前后文随远离选区渐隐并叠加模糊
        quoteLines.forEach(({ text: line, start }, li) => {
          const y = bodyTop + bodyLH / 2 + li * bodyLH;
          const dist =
            li < hiLineStart
              ? hiLineStart - li
              : li > hiLineEnd
                ? li - hiLineEnd
                : 0;
          const k = Math.min(1, dist / 2.5);
          const eased = k * k * (3 - 2 * k);
          const ctxAlpha = c.quoteCtx * (1 - eased);
          const ctxBlur = eased * 5;
          let cx = PAD;
          let u = start;
          for (const ch of line) {
            const w = octx.measureText(ch).width;
            if (ch !== " ") {
              if (u >= qc.hiStart && u < qc.hiEnd) {
                octx.globalAlpha = 0.9;
                octx.filter = "none";
              } else {
                octx.globalAlpha = ctxAlpha;
                octx.filter = `blur(${ctxBlur.toFixed(2)}px)`;
              }
              octx.fillText(ch, cx, y);
            }
            cx += w + BODY_TRACKING;
            u += ch.length;
          }
        });
      } else {
        // 全文/纯节选：超出可排空间（被截断）时尾部沿 smoothstep 渐隐并叠加模糊
        const truncated = bodyLines.length >= maxBodyLines;
        const n = bodyLines.length;
        bodyLines.forEach((line, i) => {
          const t = n <= 1 ? 0 : i / (n - 1);
          const k = truncated && t > 0.5 ? (t - 0.5) / 0.5 : 0;
          const eased = k * k * (3 - 2 * k);
          octx.globalAlpha = 0.9 * (1 - eased);
          octx.filter = `blur(${(eased * 5).toFixed(2)}px)`;
          drawTracked(octx, line, PAD, bodyTop + bodyLH / 2 + i * bodyLH, BODY_TRACKING, "left");
        });
      }
      octx.filter = "none";
      octx.globalAlpha = 1;
      ctx.drawImage(off, 0, 0);
    }
  }

  // 页脚：左侧链接与署名，右侧白底二维码卡
  const dividerY = H - PAD - 172 - 40 - 44;
  const qrSize = 172;
  const qrX = W - PAD - qrSize;
  const qrY = dividerY + 44;
  ctx.fillStyle = "#ffffff";
  pathRoundRect(ctx, qrX, qrY, qrSize, qrSize, 24);
  ctx.fill();
  ctx.strokeStyle = "#e5e5e5";
  ctx.stroke();
  if (qr) ctx.drawImage(qr, qrX + 18, qrY + 18, qrSize - 36, qrSize - 36);
  ctx.fillStyle = c.muted;
  ctx.font = `400 22px ${sans}`;
  ctx.textAlign = "center";
  ctx.fillText("扫码阅读全文", qrX + qrSize / 2, qrY + qrSize + 30);

  // 左侧两行贴「扫码阅读全文」角标行：署名行与角标同行底对齐，链接行在其上
  const taglineCy = qrY + qrSize + 30;
  ctx.textAlign = "left";
  ctx.fillStyle = c.fg;
  ctx.font = `500 27px ${mono}`;
  // 展示仅域名，二维码仍指向文章完整地址
  ctx.fillText(location.host, PAD, taglineCy - 39);
  ctx.fillStyle = c.muted;
  ctx.font = `400 22px ${sans}`;
  ctx.fillText("Han — Student · Developer · Designer", PAD, taglineCy);

  return canvas.toDataURL("image/png");
}

/** 海报预览弹窗：图片预览 + 下载（下载按钮用主题 primary 色，同站内按钮体系） */
function PosterDialog({
  open,
  onOpenChange,
  dataUrl,
  fileName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataUrl: string | null;
  fileName: string;
}) {
  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = fileName;
    a.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle className="sr-only">分享海报预览</DialogTitle>
        {dataUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dataUrl}
              alt="文章分享海报"
              className="w-full rounded-xl border"
            />
            <Button size="lg" onClick={download} className="w-full">
              <ImageDown className="size-4" strokeWidth={1.5} />
              下载图片
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              移动端可长按图片保存至相册
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** 页脚「生成分享图」按钮：以文章正文开头为海报正文 */
export function SharePosterButton({ post }: { post: Post }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const generate = async () => {
    if (busy) return;
    setBusy(true);
    try {
      setDataUrl(await renderPoster(post, resolvedTheme === "dark"));
      setOpen(true);
    } catch (err) {
      console.error("生成分享图失败", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={generate}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-sm text-muted-foreground transition-colors hover:border-[#00bc7d]/50 hover:text-[#00bc7d] disabled:pointer-events-none disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
        ) : (
          <ImageDown className="size-4" strokeWidth={1.5} />
        )}
        {busy ? "生成中…" : "生成分享图"}
      </button>
      <PosterDialog
        open={open}
        onOpenChange={setOpen}
        dataUrl={dataUrl}
        fileName={`${post.slug}-share.png`}
      />
    </>
  );
}

/** 选区节选分享：正文内划选（桌面划选 / 移动端长按）后，选区上方浮现生成入口，
 * 以所选文字为海报正文 */
export function SelectionPoster({
  post,
  container,
}: {
  post: Post;
  container: RefObject<HTMLElement | null>;
}) {
  const [anchor, setAnchor] = useState<{
    x: number;
    y: number;
    below: boolean;
  } | null>(null);
  const [quote, setQuote] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const update = () => {
      const sel = window.getSelection();
      const root = container.current;
      if (!sel || sel.isCollapsed || sel.rangeCount === 0 || !root) {
        setAnchor(null);
        return;
      }
      if (!root.contains(sel.anchorNode) || !root.contains(sel.focusNode)) {
        setAnchor(null);
        return;
      }
      const text = normQuote(sel.toString());
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (text.length < 2 || (!rect.width && !rect.height)) {
        setAnchor(null);
        return;
      }
      // 默认悬浮在选区上方；顶部空间不足（导航条区域）时改到下方
      const below = rect.top < 96;
      setQuote(text);
      setAnchor({
        x: Math.min(
          Math.max(rect.left + rect.width / 2, 100),
          window.innerWidth - 100,
        ),
        y: below ? rect.bottom + 10 : rect.top - 10,
        below,
      });
    };
    const hide = () => setAnchor(null);
    document.addEventListener("mouseup", update);
    document.addEventListener("touchend", update, { passive: true });
    document.addEventListener("selectionchange", hide);
    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("resize", hide);
    return () => {
      document.removeEventListener("mouseup", update);
      document.removeEventListener("touchend", update);
      document.removeEventListener("selectionchange", hide);
      window.removeEventListener("scroll", hide);
      window.removeEventListener("resize", hide);
    };
  }, [container]);

  const generate = async () => {
    if (busy || !quote) return;
    setBusy(true);
    setAnchor(null);
    // 清除选区高亮，避免弹窗下方残留蓝色选区
    window.getSelection()?.removeAllRanges();
    try {
      setDataUrl(await renderPoster(post, resolvedTheme === "dark", quote));
      setOpen(true);
    } catch (err) {
      console.error("生成分享图失败", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {anchor && !open && (
        <button
          type="button"
          data-selection-share
          onPointerDown={(e) => e.preventDefault()}
          onClick={generate}
          style={{
            left: anchor.x,
            top: anchor.y,
            transform: anchor.below
              ? "translate(-50%, 0)"
              : "translate(-50%, -100%)",
          }}
          className="animate-blur-in fixed z-50 flex items-center gap-1.5 rounded-full border bg-card px-3.5 py-2 text-xs text-muted-foreground shadow-lg transition-colors hover:border-[#00bc7d]/50 hover:text-[#00bc7d]"
        >
          {busy ? (
            <Loader2 className="size-3.5 animate-spin" strokeWidth={1.5} />
          ) : (
            <ImageDown className="size-3.5" strokeWidth={1.5} />
          )}
          生成分享图
        </button>
      )}
      <PosterDialog
        open={open}
        onOpenChange={setOpen}
        dataUrl={dataUrl}
        fileName={`${post.slug}-quote.png`}
      />
    </>
  );
}
