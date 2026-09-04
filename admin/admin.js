const { useEffect, useMemo, useState } = React;

const KEY = 'csk_noticias_v1';
const CAT_KEY = 'csk_categorias_v1';
const DEFAULT_CATS = ['Institucional', 'Direito', 'Mercado', 'Inovação'];
const EMPTY = { id: '', title: '', category: 'Institucional', excerpt: '', content: '', image: '', published: false, createdAt: '' };

function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function slugify(value) { return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

function App() {
  const [items, setItems] = useState(() => read(KEY, []));
  const [categories, setCategories] = useState(() => read(CAT_KEY, DEFAULT_CATS));
  const [form, setForm] = useState({ ...EMPTY });
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [notice, setNotice] = useState('');

  useEffect(() => localStorage.setItem(KEY, JSON.stringify(items)), [items]);
  useEffect(() => localStorage.setItem(CAT_KEY, JSON.stringify(categories)), [categories]);

  const visible = useMemo(() => items.filter(i => (filter === 'Todos' || i.category === filter) && i.title.toLowerCase().includes(query.toLowerCase())).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)), [items, filter, query]);
  const published = items.filter(i => i.published).length;

  function flash(text) { setNotice(text); window.setTimeout(() => setNotice(''), 2600); }
  function change(name, value) { setForm(f => ({ ...f, [name]: value })); }
  function reset() { setForm({ ...EMPTY, category: categories[0] || 'Institucional' }); setEditing(false); }
  function edit(item) { setForm({ ...item }); setEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function remove(id) { if (confirm('Excluir esta notícia?')) { setItems(v => v.filter(i => i.id !== id)); flash('Notícia excluída.'); } }
  function toggle(id) { setItems(v => v.map(i => i.id === id ? { ...i, published: !i.published } : i)); }

  function image(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) return flash('Use uma imagem de até 3 MB.');
    const reader = new FileReader();
    reader.onload = () => change('image', reader.result);
    reader.readAsDataURL(file);
  }

  function save(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return flash('Título e conteúdo são obrigatórios.');
    const now = form.createdAt || new Date().toISOString();
    const item = { ...form, id: form.id || crypto.randomUUID(), slug: slugify(form.title), createdAt: now, updatedAt: new Date().toISOString() };
    setItems(v => editing ? v.map(i => i.id === item.id ? item : i) : [item, ...v]);
    reset();
    flash(item.published ? 'Notícia publicada.' : 'Rascunho salvo.');
  }

  function addCategory() {
    const name = prompt('Nome da categoria:');
    const clean = name?.trim();
    if (clean && !categories.includes(clean)) { setCategories(v => [...v, clean]); change('category', clean); }
  }

  function exportData() {
    const blob = new Blob([JSON.stringify({ items, categories }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'csk-noticias-backup.json'; a.click(); URL.revokeObjectURL(url);
  }

  function importData(e) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.onload = () => { try { const data = JSON.parse(reader.result); if (!Array.isArray(data.items)) throw Error(); setItems(data.items); if (Array.isArray(data.categories)) setCategories(data.categories); flash('Backup importado.'); } catch { flash('Arquivo de backup inválido.'); } }; reader.readAsText(file); e.target.value = '';
  }

  return <div className="shell">
    <header className="topbar">
      <a className="brand" href="../index.html"><b>CSK</b><span>ADVOGADOS</span></a>
      <div className="top-actions"><a href="../index.html">Ver site ↗</a><button onClick={exportData}>Exportar backup</button><label>Importar backup<input hidden type="file" accept="application/json" onChange={importData}/></label></div>
    </header>

    <main>
      <section className="heading"><div><small>ÁREA ADMINISTRATIVA</small><h1>Gestão de <i>notícias.</i></h1><p>Crie, edite, publique e organize o conteúdo editorial da CSK.</p></div><div className="stats"><div><strong>{published}</strong><span>publicadas</span></div><div><strong>{items.length - published}</strong><span>rascunhos</span></div><div><strong>{items.length}</strong><span>total</span></div></div></section>

      {notice && <div className="toast">{notice}</div>}

      <section className="workspace">
        <form className="card editor" onSubmit={save}>
          <div className="card-head"><div><small>{editing ? 'EDIÇÃO' : 'NOVA PUBLICAÇÃO'}</small><h2>{editing ? 'Editar notícia' : 'Nova notícia'}</h2></div><button type="button" className="ghost" onClick={reset}>Limpar</button></div>
          <label>Título<input value={form.title} onChange={e => change('title', e.target.value)} placeholder="Ex.: CSK participa de novo projeto jurídico" /></label>
          <div className="two"><label>Categoria<select value={form.category} onChange={e => change('category', e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></label><button type="button" className="addcat" onClick={addCategory}>+ categoria</button></div>
          <label>Resumo<textarea rows="3" value={form.excerpt} onChange={e => change('excerpt', e.target.value)} placeholder="Texto curto para aparecer nos cards." /></label>
          <label>Conteúdo<textarea className="content" rows="11" value={form.content} onChange={e => change('content', e.target.value)} placeholder="Escreva a notícia. Use uma linha em branco para separar parágrafos." /></label>
          <label>Foto principal<input type="file" accept="image/*" onChange={image}/></label>
          {form.image && <div className="image-preview"><img src={form.image} alt="Prévia"/><button type="button" onClick={() => change('image','')}>Remover foto</button></div>}
          <label className="check"><input type="checkbox" checked={form.published} onChange={e => change('published', e.target.checked)}/><span>Publicar imediatamente</span></label>
          <button className="primary" type="submit">{form.published ? 'Publicar notícia' : 'Salvar rascunho'} <b>→</b></button>
        </form>

        <aside>
          <div className="card info"><small>ESTRUTURA</small><h3>Editorial CSK</h3><p>As notícias podem ser classificadas por categoria e mantidas como rascunho antes da publicação.</p><ul>{categories.map(c => <li key={c}>{c}</li>)}</ul></div>
          <div className="card info"><small>ARMAZENAMENTO</small><h3>Modo demonstração</h3><p>Esta etapa usa o armazenamento do navegador. O próximo passo é conectar este mesmo painel ao Supabase para login, banco de dados e fotos persistentes.</p></div>
        </aside>
      </section>

      <section className="card publications"><div className="pub-head"><div><small>CONTEÚDO</small><h2>Publicações</h2></div><div className="tools"><input placeholder="Buscar..." value={query} onChange={e => setQuery(e.target.value)}/><select value={filter} onChange={e => setFilter(e.target.value)}><option>Todos</option>{categories.map(c => <option key={c}>{c}</option>)}</select></div></div>
        {visible.length === 0 ? <div className="empty">Nenhuma notícia encontrada.</div> : visible.map(item => <article className="row" key={item.id}><div className="thumb">{item.image ? <img src={item.image} alt=""/> : <span>CSK</span>}</div><div className="rowmain"><small>{item.category} · {new Date(item.createdAt).toLocaleDateString('pt-BR')}</small><h3>{item.title}</h3><p>{item.excerpt || 'Sem resumo cadastrado.'}</p></div><span className={'status ' + (item.published ? 'on' : '')}>{item.published ? 'Publicada' : 'Rascunho'}</span><button onClick={() => toggle(item.id)}>{item.published ? 'Despublicar' : 'Publicar'}</button><button onClick={() => edit(item)}>Editar</button><button className="danger" onClick={() => remove(item.id)}>Excluir</button></article>)}
      </section>
    </main>
    <footer>CSK | Cardoso Sena Kruschewsky Advogados <span>Painel de notícias</span></footer>
  </div>
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
