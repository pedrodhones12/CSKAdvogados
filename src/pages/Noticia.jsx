import { Link, useParams } from 'react-router-dom';
import { getNews } from '../services/newsStore';

export default function Noticia() {
  const { slug } = useParams();
  const item = getNews().find(n => n.slug === slug && n.published);

  if (!item) return <section className="section-pad"><h1>Notícia não encontrada.</h1><Link className="text-link" to="/noticias">Voltar para notícias →</Link></section>;

  return (
    <article className="article-page section-pad">
      <Link className="back-link" to="/noticias">← Todas as notícias</Link>
      <div className="article-head">
        <span className="news-category">{item.category}</span>
        <h1>{item.title}</h1>
        <p>{item.excerpt}</p>
        <time>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</time>
      </div>
      <div className="article-cover">
        {item.image ? <img src={item.image} alt="" /> : <div className="image-placeholder large"><span>CSK</span></div>}
      </div>
      <div className="article-content">
        {item.content.split('\n').filter(Boolean).map((paragraph, i) => <p key={i}>{paragraph}</p>)}
      </div>
    </article>
  );
}
