/** 版权声明卡：许可证徽章沿用 shields.io 的蓝色惯例 */
export function LicenseCard() {
  return (
    <section className="rounded-xl border bg-card px-4 py-3">
      <p className="font-mono text-[11px] tracking-wide text-muted-foreground">
        © 2023–2026 HAN
      </p>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="inline-flex items-center overflow-hidden rounded-[4px] text-[10px] leading-none">
          <span className="bg-foreground/60 px-1.5 py-[3px] font-medium text-background">
            License
          </span>
          <span className="bg-[#007ec6] px-1.5 py-[3px] font-medium text-white">
            CC BY-NC-SA 4.0
          </span>
        </span>
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="查看 CC BY-NC-SA 4.0 协议全文"
          className="text-xs text-muted-foreground transition-colors hover:text-[#00bc7d]"
        >
          ↗
        </a>
      </div>
      <p className="mt-1.5 text-[11px] text-muted-foreground">
        转载请署名 · 禁止商用 · 相同方式共享
      </p>
    </section>
  );
}
