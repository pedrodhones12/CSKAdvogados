import { useEffect, useMemo, useState } from 'react';
import { getCategories, getNews, makeSlug, saveCategories, saveNews } from '../services/newsStore';

const blank = { id: null, title: '', category: 'Institucional', excerpt: '', content: '', image: '', published: false, createdAt: new Date().toISOString() };

export default function Admin() {
  const [items, setItems] = useState(getNews());
  const [categories, setCategories] = useState(getCategories());
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => saveNews(items), [items]);
  useEffect(() => saveCategories(categories), [categories]);

  const published = useMemo(() => items.filter(i => i.published).length, [items]);
  const drafts = items.length - published;

  function reset() { setForm({ ...blank, category: categories[0] || 'Institucional' }); setEditing(false); setMessage(''); }

  function edit(item) { setForm(item); setEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  function remove(id) {
    if (window.confirm('Excluir esta notícia?')) setItems(items.filter(i => i.id !== id));
  }

  function toggle(id) {
    setItems(items.map(i => i.id === id ? { ...i, published: !i.published } : i));
  }

  function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2_500_000) { setMessage('A imagem deve ter até 2,5 MB nesta versão de demonstração.'); return; }
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
  }

  function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { setMessage('Preencha título e conteúdo.'); return; }
    const next = { ...form, id: form.id || crypto.randomUUID(), slug: makeSlug(form.title), createdAt: form.createdAt || new Date().toISOString() };
    setItems(current => editing ? current.map(i => i.id === next.id ? next : i) : [next, ...current]);
    setMessage(next.published ? 'Notícia publicada com sucesso.' : 'Rascunho salvo com sucesso.');
    setForm({ ...blank, category: categories[0] || 'Institucional' });
    setEditing(false);
  }

  function addCategory() {
    const name = window.prompt('Nome da nova categoria:');
    if (!name?.trim() || categories.includes(name.trim())) return;
    setCategories([...categories, name.trim()]);
  }

  return (
    <section className="admin-page section-pad">
      <div className="admin-top">
        <div>
          <div className="eyebrow"><span></span> ÁREA ADMINISTRATIVA</div>
          <h1>Gestão de <em>notícias.</em></h1>
        </div>
        <div className="admin-stats"><strong>{published}</strong><span>publicadas</span><strong>{drafts}</strong><span>rascunhos</span></div>
      </div>

      <div className="admin-layout">
        <form className="news-form" onSubmit={submit}>
          <div className="form-title-row"><h2>{editing ? 'Editar notícia' : 'Nova notícia'}</h2><button type="button" className="button button-ghost small" onClick={reset}>Limpar</button></div>
          <label><span>Título</span><input value={form.title} onChange={e => setForm({...form, title:e.target.value})} placeholder="Título da notícia" /></label>
          <label><span>Categoria</span><select value={form.category} onChange={e => setForm({...form, category:e.target.value})}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
          <label><span>Resumo</span><textarea rows="3" value={form.excerpt} onChange={e => setForm({...form, excerpt:e.target.value})} placeholder="Resumo que aparecerá no card da notícia" /></label>
          <label><span>Conteúdo</span><textarea className="content-editor" value={form.content} onChange={e => setForm({...form, content:e.target.value})} placeholder="Escreva o conteúdo da notícia. Separe parágrafos com uma linha em branco." /></label>
          <label><span>Foto principal</span><input type="file" accept="image/*" onChange={handleImage} /></label>
          {form.image && <img className="preview-image" src={form.image} alt="Pré-visualização" />}
          <label className="publish-toggle"><input type="checkbox" checked={form.published} onChange={e => setForm({...form, published:e.target.checked})} /><span>Publicar imediatamente</span></label>
          {message && <div className="form-message">{message}</div>}
          <button className="button button-primary" type="submit">{form.published ? 'Publicar notícia' : 'Salvar rascunho'} <span>→</span></button>
        </form>

        <aside className="admin-side">
          <div className="side-box"><div className="eyebrow"><span></span> CATEGORIAS</div><ul>{categories.map(c => <li key={c}>{c}</li>)}</ul><button className="text-link-button" onClick={addCategory}>+ Nova categoria</button></div>
          <div className="side-box"><div className="eyebrow"><span></span> COMO FUNCIONA</div><p>Esta primeira versão salva as notícias no navegador. Para produção, conectaremos o mesmo painel ao Supabase para login, banco e armazenamento das fotos.</p></div>
        </aside>
      </div>

      <div className="admin-list">
        <div className="list-heading"><h2>Publicações</h2><span>{items.length} registros</span></div>
        {items.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map(item => (
          <div className="admin-row" key={item.id}>
            <div className="row-thumb">{item.image ? <img src={item.image} alt=""/> : <span>CSK</span>}</div>
            <div className="row-info"><span>{item.category}</span><h3>{item.title}</h3><small>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</small></div>
            <div className={`status ${item.published ? 'published' : ''}`}>{item.published ? 'Publicada' : 'Rascunho'}</div>
            <button onClick={()=>toggle(item.id)} title="Publicar/despublicar">{item.published ? 'Despublicar' : 'Publicar'}</button>
            <button onClick={()=>edit(item)}>Editar</button>
            <button className="danger" onClick={()=>remove(item.id)}>Excluir</button>
          </div>
        ))}
      </div>
    </section>
  );
}
