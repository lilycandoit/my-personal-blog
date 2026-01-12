interface HeroProps {
  heroImage?: string;
}

export default function Hero({ heroImage = '/hero/hero-bg.jpg' }: HeroProps) {
  return (
    <section
      className="relative w-screen h-[50vh] md:h-[90vh] m-0 -mx-[50vw] left-[50%] right-[50%]
             text-white bg-cover bg-[center_bottom] bg-no-repeat fade-in"
      style={{ backgroundImage: `url('${heroImage}')` }}
    >
      <div className="absolute top-16 right-8 md:top-10 md:right-10 max-w-[520px] text-right">
        <h2 className="font-hand text-2xl md:text-4xl mb-4 font-bold fade-in-up text-white">
          Hi! I'm Duong
        </h2>

        <p className="text-xl mb-4 font-hand font-medium fade-in-up-delay">
          Just an ordinary person trying to figure life out.
        </p>
      </div>
    </section>
  );
}
