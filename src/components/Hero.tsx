import Link from 'next/link';
// import { Github, Linkedin, Mail } from 'lucide-react';

interface HeroProps {
  heroImage?: string;
}

export default function Hero({ heroImage = '/hero/hero-bg.jpg' }: HeroProps) {
  return (
    <section className="hero-fullwidth" style={{
      position: 'relative',
      width: '100vw',
      height: '85vh',
      minHeight: '500px',
      margin: 0,
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url('${heroImage}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center bottom',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center',
    }}>
      <div style={{
        maxWidth: '800px',
        padding: '2rem',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-body)',
          fontSize: '4rem',
          marginBottom: '1rem',
          color: 'white',
          fontWeight: 700,
          textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)',
        }}>
          Hi! This is Lily
        </h1>

        <p style={{
          fontSize: '1.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--font-ui)',
          fontWeight: 500,
          textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)',
        }}>
          Just an ordinary person trying to figure life out.
        </p>

        <p style={{
          fontSize: '1.2rem',
          marginBottom: '2rem',
          fontFamily: 'var(--font-ui)',
          lineHeight: '1.6',
          textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)',
        }}>
          This site is my little corner to learn, share and document my journey as I grow
        </p>

        {/* Social Links */}
        {/* <div style={{
          display: 'flex',
          gap: '1.5rem',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'white',
              border: 'none',
              transition: 'transform 0.2s ease',
            }}
            className="social-link"
          >
            <Linkedin size={32} />
          </a>
          <a
            href="mailto:your-email@example.com"
            style={{
              color: 'white',
              border: 'none',
              transition: 'transform 0.2s ease',
            }}
            className="social-link"
          >
            <Mail size={32} />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'white',
              border: 'none',
              transition: 'transform 0.2s ease',
            }}
            className="social-link"
          >
            <Github size={32} />
          </a>
        </div> */}
      </div>
    </section>
  );
}
