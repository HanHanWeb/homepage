import { Reveal } from "@/components/reveal";
import { SOCIALS } from "@/lib/socials";

/**
 * 联系板块:仿卡片网格设计,整卡可点击。
 * 桌面端一行四列,移动端两列;深浅色均使用语义色(bg-card / muted-foreground)。
 */
export function Contact() {
  return (
    <section id="contact" className="scroll-mt-6 py-10">
      <Reveal delay="1.8s">
        <h2 className="text-2xl font-semibold tracking-tight">联系</h2>
      </Reveal>

      <Reveal delay="1.95s">
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SOCIALS.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border bg-card p-4 text-card-foreground transition-colors hover:bg-secondary dark:border-white/20"
            >
              <social.Icon className="size-5 shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium">{social.name}</div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground">
                  {social.handle}
                </div>
              </div>
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
