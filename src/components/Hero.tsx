interface HeroProps {
  heroImage?: string;
}

export default function Hero({ heroImage = '/hero/hero-bg.jpg' }: HeroProps) {
  return (
    <section
      className="relative w-screen h-[90vh] m-0 -mx-[50vw] left-[50%] right-[50%] flex items-center justify-center text-white text-center fade-in-up"
      style={{
        // backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url('${heroImage}')`,
        backgroundImage: `url('${heroImage}`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="max-w-[800px] px-8">
        <h2 className="font-hand text-5xl md:text-6xl mb-4 text-white font-bold">
          Hi! I'm Duong
        </h2>

        <p className="text-xl mb-4 font-hand font-medium">
          Just an ordinary person trying to figure life out.
        </p>

        <p className="text-2xl mb-8 font-hand leading-relaxed">
          This site is my little corner to learn, share and document my journey as I grow
        </p>
      </div>
    </section>
  );
}
