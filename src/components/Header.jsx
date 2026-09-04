import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className={`nav ${open ? 'open' : ''}`}>
      <Link className="brand" to="/" onClick={close} aria-label="CSK início">
        <span className="brand-mark">CSK</span>
        <span className="brand-text">ADVOGADOS</span>
      </Link>

      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Abrir menu" aria-expanded={open}>
        <span></span><span></span>
      </button>

      <nav className="menu">
        <a href="/#escritorio" onClick={close}>O escritório</a>
        <a href="/#atuacao" onClick={close}>Atuação</a>
        <a href="/#equipe" onClick={close}>Equipe</a>
        <NavLink to="/noticias" onClick={close}>Notícias</NavLink>
        <a href="/#contato" onClick={close}>Contato</a>
      </nav>
      <a className="nav-cta" href="/#contato" onClick={close}>Fale conosco <span>↗</span></a>
    </header>
  );
}
