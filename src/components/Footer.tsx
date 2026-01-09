export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      background: 'linear-gradient(to bottom, rgba(248, 250, 255, 0.3) 0%, rgba(160, 210, 235, 0.4) 50%, rgba(93, 156, 236, 0.3) 100%)',
      paddingTop: '3rem',
      paddingBottom: '2rem',
      marginTop: 'auto',
    }}>
      <p style={{ fontSize: '1.1rem', color: 'var(--color-muted)', textAlign: 'center' }}>
        © {new Date().getFullYear()} — specific time, distinct place. <br/>
        <span>Quietly building in the open.</span>
      </p>
    </footer>

  );
}
