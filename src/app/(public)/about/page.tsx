export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <article>
      <h1 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>About</h1>

      <p style={{ fontSize: '1.3rem', marginBottom: '2rem', lineHeight: '1.6' }}>
        I’m Duong — someone curious about tech and the world around me.
        I’m still learning, still figuring things out, and letting that process unfold.
      </p>

      <h2 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>
        Why this space?
      </h2>

      <p>
        This space exists because I love writing. It helps me clear my mind and slow down.
        It’s not about being perfect, it’s about being <em>me</em> and noticing how I grow over time.
      </p>

      <p>
        I’m not really a social media person, but I still enjoy writing and sharing.
        This space is my quiet corner to do that.
      </p>

      <p>
        Not a fancy website, but it’s made by me, and for me.
      </p>

      <h2 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>
        What you’ll find here
      </h2>

      <ul>
        <li>Thoughts on life, growth, simplicity, and vulnerability.</li>
        <li>Notes from my coding journey.</li>
        <li>Small moments that matter to me.</li>
      </ul>

      <p style={{ marginTop: '2rem' }}>
        Thanks for stopping by!
      </p>
    </article>
  );
}
