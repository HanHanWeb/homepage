/** 版权徽章：shields.io 蓝色惯例，直接左对齐放在侧栏，不套卡片容器 */
export function LicenseCard() {
  return (
    <a
      href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="本站内容采用 CC BY-NC-SA 4.0 协议"
      className="inline-flex w-fit items-center overflow-hidden rounded-[4px] text-[10px] leading-none transition-opacity hover:opacity-80"
    >
      <span className="bg-foreground/60 px-1.5 py-[3px] font-medium text-background">
        License
      </span>
      <span className="bg-[#007ec6] px-1.5 py-[3px] font-medium text-white">
        CC BY-NC-SA 4.0
      </span>
    </a>
  );
}
