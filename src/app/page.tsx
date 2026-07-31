import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Timeline from "@/components/WhatsOn/Timeline";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />

      <section className="flex flex-col items-center px-9 pb-16 pt-[60px] text-center md:px-[60px] md:pt-24">
        <h1 className="max-w-[1344px] font-offbit text-[72px] font-bold uppercase leading-[0.95] tracking-tight md:text-[116px]">
          Underground Art and Design
        </h1>
        <p className="mt-9 max-w-[672px] text-[21px] text-white/70">
          A creative community empowering change-provoking artists and designers
        </p>

        {/* Divider between the hero copy and the What's On timeline below
            (brand spec: 1px vertical rule). mt-16 here and pb-16 above
            give it a 64px gap from the subtitle; Timeline's section now
            has no top padding of its own, so this same pb-16 is also the
            entire gap down to the "What's On" heading — keeping both
            gaps equal, per spec (50-80px range). */}
        <div className="mx-auto mt-16 h-16 w-px bg-white/20 md:h-24" />
      </section>

      <Timeline />

      <Footer />
    </div>
  );
}
