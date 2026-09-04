import { useMemo, useState } from 'react';
import { getCategories, getNews } from '../services/newsStore';
import NewsCard from '../components/NewsCard';

export default function Noticias() {
  const [category, setCategory] = useState('Todas');
  const [query, setQuery] = useState('');
  const news = getNews().filter(n => n.published).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  const categories = ['Todas', ...getCategories()];
  const filtered = useMemo(() => news.filter(n => {
    const cat = category === 'Todas' || n.category === category;
    const q = !query || `${n.title} ${n.excerpt} ${n.category}`.toLowerCase().includes(query.toLowerCase());
    return cat && q;
  }), [news, category, query]);

  const featured = filtered[0];

  return (
    <section className="news-page section-pad">
      <div className="section-number">03</div>
      <div className="news-heading">
        <div>
          <div className="eyebrow"><span></span> ATUALIZAÇÕES CSK</div>
          <h1>Notícias e <em>insights</em><br />jurídicos.</h1>
        </div>
        <p>Conteúdo para acompanhar mudanças, oportunidades e questões jurídicas que impactam pessoas e negócios.</p>
      </div>

      <div className="news-tools">
        <div className="category-list">
          {categories.map(cat => <button key={cat} className={category === cat ? 'active' : ''} onClick={() => setCategory(cat)}>{cat}</button>)}
        </div>
        <label className="search-box"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Pesquisar" /></label>
      </div>

      {featured && <NewsCard item={featured} featured />}

      <div className="news-grid">
        {filtered.slice(1).map(item => <NewsCard key={item.id} item={item} />)}
      </div>

      {!filtered.length && <div className="empty-state">Nenhuma notícia encontrada para os filtros selecionados.</div>}
    </section>
  );
}
