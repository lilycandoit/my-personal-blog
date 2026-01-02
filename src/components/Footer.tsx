export default function Footer() {
  return (
    <footer>
      <p style={{ fontSize: '1.1rem', color: 'var(--color-muted)', textAlign: 'center' }}>
        © {new Date().getFullYear()} — specific time, distinct place. <br/>
        <span>Quietly building in the open.</span>
      </p>
    </footer>

  );
}
