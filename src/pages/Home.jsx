import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="home-hero">
      <div className="hero-grid"></div>
      <div className="hero-copy">
        <div className="eyebrow"><span></span> ADVOCACIA ESTRATÉGICA</div>
        <h1>Inteligência jurídica<br /><em>para o que vem depois.</em></h1>
        <p>Estratégia, técnica e inovação para transformar desafios complexos em decisões mais seguras.</p>
        <Link className="button button-primary" to="/noticias">Explorar notícias <span>→</span></Link>
      </div>
      <div className="hero-side-card">
        <span>CSK</span>
        <small>Cardoso Sena Kruschewsky<br />Advogados</small>
      </div>
    </section>
  );
}
