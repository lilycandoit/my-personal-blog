export default function Footer() {
  return (
    <footer>
      <p style={{ opacity: 0.6 }}>
        © {new Date().getFullYear()} — specific time, distinct place. <br/>
        <span style={{ fontSize: '0.8em' }}>Quietly building in the open.</span>
      </p>
    </footer>
  );
}
