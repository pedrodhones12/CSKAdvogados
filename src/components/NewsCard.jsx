import { Link } from 'react-router-dom';

export default function NewsCard({ item, featured = false }) {
  return (
    <article className={`news-card ${featured ? 'featured' : ''}`}>
      <div className="news-image">
        {item.image ? <img src={item.image} alt="" /> : <div className="image-placeholder"><span>CSK</span></div>}
      </div>
      <div className="news-card-body">
        <span className="news-category">{item.category}</span>
        <h2>{item.title}</h2>
        <p>{item.excerpt}</p>
        <div className="news-meta">
          <time>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</time>
          <Link to={`/noticias/${item.slug}`}>Ler notícia <span>→</span></Link>
        </div>
      </div>
    </article>
  );
}
