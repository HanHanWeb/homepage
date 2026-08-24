import { Reveal } from "@/components/reveal";
import Text3DFlip from "@/registry/magicui/text-3d-flip";

const ITEMS = [
  {
    title: "开发运维",
    options: ["开发", "运维"],
  },
  {
    title: "科技数码",
    options: ["科技", "数码"],
  },
  {
    title: "创意设计",
    options: ["平面设计", "UI/UX", "产品设计", "PowerPoint", "版式设计"],
  },
  {
    title: "影像创作",
    options: ["摄影", "航拍", "视频剪辑"],
  },
];

export function Services() {
  return (
    <section id="services" className="scroll-mt-6 py-10">
      <Reveal delay="1.65s">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-serif-sc text-2xl font-semibold tracking-tight">专注领域</h2>
          <span className="text-sm font-normal tracking-widest text-muted-foreground/40">
            #FOCUS
          </span>
        </div>
      </Reveal>

      <div className="mt-6 space-y-3">
        {ITEMS.map((item, i) => (
          <Reveal key={item.title} delay={`${1.8 + i * 0.08}s`}>
            <div
              className="relative overflow-hidden rounded-xl border p-5 sm:p-6"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, var(--border) 0 1px, transparent 1px 10px)",
              }}
            >
              <div className="absolute inset-0 bg-card/60 backdrop-blur-[0.5px]" aria-hidden />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between [perspective:800px]">
                <Text3DFlip
                  as="h3"
                  className="shrink-0 cursor-pointer bg-transparent"
                  textClassName="bg-card text-foreground text-2xl font-bold tracking-tight sm:text-3xl"
                  flipTextClassName="bg-card text-foreground text-2xl font-bold tracking-tight sm:text-3xl"
                  rotateDirection="top"
                  staggerDuration={0.03}
                  staggerFrom="first"
                  transition={{ type: "spring", damping: 25, stiffness: 160 }}
                >
                  {item.title}
                </Text3DFlip>
                <div className="flex flex-wrap gap-2 sm:max-w-[60%] sm:justify-end">
                  {item.options.map((opt) => (
                    <span
                      key={opt}
                      className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium"
                    >
                      <span className="size-1.5 shrink-0 rounded-full bg-foreground/70" aria-hidden />
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
