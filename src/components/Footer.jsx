import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <Link className="brand footer-brand" to="/">
          <span className="brand-mark">CSK</span><span className="brand-text">ADVOGADOS</span>
        </Link>
        <Link to="/noticias">Notícias ↗</Link>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Cardoso Sena Kruschewsky Advogados.</span>
        <span>Portal jurídico • React</span>
      </div>
    </footer>
  );
}
