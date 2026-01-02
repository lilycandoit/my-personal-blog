export const metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Contact</h1>
      <p style={{ fontSize: '1.3rem', marginBottom: '3rem' }}>
        I'm always open to a friendly chat or a thoughtful question.
      </p>

      <div style={{ padding: '3rem', border: '1px dashed var(--color-border)', borderRadius: '12px', background: 'white', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>
             Send me a note
          </p>
          <a href="mailto:hello@example.com" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>
             hello@example.com
          </a>
      </div>
    </div>
  );
}
