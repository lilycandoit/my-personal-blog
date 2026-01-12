export default function Footer() {
  return (
    <footer className="border-t border-border-light dark:border-border-dark bg-gradient-to-b from-blue-50/30 via-blue-100/40 to-blue-200/30 dark:from-gray-800/30 dark:via-gray-900/40 dark:to-gray-900/30 pt-12 pb-8 mt-auto">
      <p className="text-lg text-muted-light dark:text-muted-dark text-center font-hand m-0">
        © {new Date().getFullYear()} — specific time, distinct place. <br/>
        <span>Quietly building in the open.</span>
      </p>
    </footer>
  );
}
