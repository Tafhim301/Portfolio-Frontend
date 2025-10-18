import Link from "next/link";

export default async function Hero() {
  return (
    <div>
      <div className="max-h-screen w-full relative">
        {/* Background Gradient */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 100%, #000000 40%, #0f2027 100%)",
          }}
        />

        <section className="relative flex flex-col items-center justify-center text-center py-28 px-6 text-white">
          {/* Intro */}
          <p className="text-3xl  font-bold text-gray-500 mb-2">
             Hey, I’m <span className="font-semibold text-white">Tafhim</span>
          </p>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-5xl leading-tight">
            Building <span className="text-rose-500">Modern Web</span> Experiences <br className="hidden md:block" />
            with Code & Creativity
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg md:text-xl max-w-2xl text-gray-300">
            I’m a passionate <span className="text-white font-medium">Full Stack Web Developer </span> 
             who loves crafting clean, scalable and user-focused digital products.  
            Let’s turn ideas into reality 
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center px-8 py-4 font-medium rounded-xl border border-input hover:bg-rose-500 hover:text-white transition"
            >
              View My Projects
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 font-medium rounded-xl bg-white text-black hover:bg-gray-200 transition"
            >
              Contact Me
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
