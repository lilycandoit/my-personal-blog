export const metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <h1 className="mb-8 text-primary font-hand">Contact</h1>
      <p className="text-lg md:text-[1.3rem] mb-8 md:mb-12 text-gray-800 dark:text-gray-100 font-hand">
        I'm always open to a friendly chat or a thoughtful question.
      </p>

      <div className="p-6 md:p-12 border border-dashed border-border-light dark:border-border-dark rounded-xl bg-white dark:bg-surface-dark text-center">
          <p className="m-0 text-[1.1rem] text-muted-light dark:text-muted-dark mb-1 font-hand">
             Send me a note
          </p>
          <a
            href="mailto:hueduong288@gmail.com"
            className="text-lg md:text-2xl font-semibold text-primary hover:text-primary-hover border-0 font-hand break-words"
          >
             hueduong288@gmail.com
          </a>

          <p className="mt-6 text-[1.1rem] text-muted-light dark:text-muted-dark mb-1 font-hand">
             You can also find me here:
          </p>
          <a
            href="https://www.linkedin.com/in/duong-lily"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg md:text-2xl font-semibold text-primary hover:text-primary-hover border-0 font-hand"
          >
             LinkedIn
          </a>
      </div>
    </div>
  );
}
