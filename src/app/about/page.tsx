export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <article>
      <h1 style={{ marginBottom: '2rem' }}>About</h1>
      <p style={{ fontSize: '1.3rem', marginBottom: '2rem', lineHeight: '1.6' }}>
        This space exists because I believe in the power of public thinking.
        It's not about being perfect; it's about being present.
      </p>

      <h2>Why this space?</h2>
      <p>
        I wanted a place that feels like <em>me</em>. Not a social media profile, not a corporate portfolio.
        Just a quiet corner of the internet where I can write, learn, and share without the noise of algorithms.
      </p>

      <h2>What you'll find here</h2>
      <ul>
         <li>Reflections on learning to code.</li>
         <li>Thoughts on life, focus, and simplicity.</li>
         <li>Small moments that made me smile.</li>
      </ul>

      <p style={{ marginTop: '2rem' }}>
        Thanks for stopping by.
      </p>
    </article>
  );
}
