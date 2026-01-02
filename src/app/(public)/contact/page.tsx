export const metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>Contact</h1>
      <p style={{ fontSize: '1.3rem', marginBottom: '3rem' }}>
        I'm always open to a friendly chat or a thoughtful question.
      </p>

      <div style={{ padding: '3rem', border: '1px dashed var(--color-border)', borderRadius: '12px', background: 'white', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-muted)', marginBottom: '0.25rem' }}>
             Send me a note
          </p>
          <a href="mailto:hueduong288@gmail.com" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>
             hueduong288@gmail.com
          </a>

          <p style={{ marginTop: '1.5rem', fontSize: '1.1rem', color: 'var(--color-muted)', marginBottom: '0.25rem' }}>
             You can also find me here:
          </p>
          <a href="https://www.linkedin.com/in/duong-lily" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>
             LinkedIn
          </a>
      </div>
    </div>
  );
}
