import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Timeline from "@/components/WhatsOn/Timeline";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />

      <section className="flex flex-col items-center px-6 pb-16 pt-10 text-center md:px-10 md:pb-24 md:pt-16">
        <h1 className="max-w-4xl font-offbit text-6xl font-bold uppercase leading-[0.95] tracking-tight md:text-8xl">
          Underground Art and Design
        </h1>
        <p className="mt-6 max-w-md text-base text-white/70 md:text-lg">
          A creative community empowering change-provoking artists and designers
        </p>
      </section>

      <Timeline />

      <Footer />
    </div>
  );
}
