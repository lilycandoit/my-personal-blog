export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <article className="max-w-3xl mx-auto px-8 py-8">
      <h1 className="mb-8 text-primary font-hand">About</h1>

      <p className="text-lg md:text-[1.3rem] mb-8 leading-relaxed text-gray-800 dark:text-muted-dark font-hand">
        I'm Duong — someone curious about tech and the world around me.
        I'm still learning, still figuring things out, and letting that process unfold.
      </p>

      <h2 className="mb-8 text-primary font-hand">
        Why this space?
      </h2>

      <p className="mb-4 text-base md:text-lg content prose font-hand">
        This space exists because I love writing. It helps me clear my mind and slow down.
        It's not about being perfect, it's about being <em>me</em> and noticing how I grow over time.
      </p>

      <p className="mb-4 text-base md:text-lg content prose font-hand">
        I'm not really a social media person, but I still enjoy writing and sharing.
        This space is my quiet corner to do that.
      </p>

      <p className="mb-4 text-base md:text-lg content prose font-hand">
        Not a fancy website, but it's made by me, and for me.
      </p>

      <h2 className="mb-8 text-primary font-hand">
        What you'll find here
      </h2>

      <ul className="list-disc pl-6 mb-4 space-y-2 text-base md:text-lg content prose font-hand">
        <li>Thoughts on life, growth, simplicity, and vulnerability.</li>
        <li>Notes from my coding journey & English learning journey.</li>
        <li>Small moments that matter to me.</li>
      </ul>

      <p className="mt-8 text-base md:text-lg text-gray-800 dark:text-muted-dark font-hand">
        Thanks for stopping by!
      </p>
    </article>
  );
}
