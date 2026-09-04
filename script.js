const glow=document.getElementById("cursorGlow");
window.addEventListener("pointermove",e=>{if(glow){glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px";}});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("show");observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
const menuToggle=document.querySelector(".menu-toggle"),nav=document.querySelector(".nav");
menuToggle?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",open);});
document.querySelectorAll(".menu a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
const year=document.getElementById("year"); if(year) year.textContent=new Date().getFullYear();
const form=document.getElementById("contactForm"),status=document.getElementById("formStatus");
form?.addEventListener("submit",e=>{e.preventDefault();const data=new FormData(form);const name=data.get("name");if(status)status.textContent=`Obrigado, ${name}. Esta demonstração está pronta para conectar ao e-mail ou a um serviço de formulários.`;form.reset();});
document.querySelectorAll(".area-card").forEach(card=>card.addEventListener("mousemove",e=>{const rect=card.getBoundingClientRect();const x=(e.clientX-rect.left)/rect.width-.5;card.style.transform=`translateX(${x*8}px)`;}));
document.querySelectorAll(".area-card").forEach(card=>card.addEventListener("mouseleave",()=>card.style.transform=""));

/* =========================================================
   CSK — NOTÍCIAS DINÂMICAS
   Publica somente registros marcados como published no Supabase.
   ========================================================= */
(async function loadPublicNews(){
  const section=document.getElementById("noticias");
  const grid=document.getElementById("newsGrid");
  const featured=document.querySelector(".news-featured");
  const empty=document.getElementById("newsEmpty");
  if(!section||!grid||!featured)return;

  const SUPABASE_URL="https://elrldxaapgfbygurzdzb.supabase.co";
  const SUPABASE_KEY="sb_publishable_cLOSGNA_YltxIaezf9JokA_FYcIttmn";

  function escapeHtml(value=""){return String(value).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c]));}
  function formatDate(value){return new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(value)).replace(" de "," ").toUpperCase();}
  function getImage(url,compact=false){return url?`<img src="${escapeHtml(url)}" alt="" loading="lazy">`:`<div class="news-image-placeholder${compact?" compact":""}"><span>CSK</span>${compact?"":"<small>IMAGEM DA NOTÍCIA</small>"}</div>`;}
  function card(item,idx){return `<article class="news-card reveal" data-category="${escapeHtml(item.category)}" data-title="${escapeHtml(item.title)}" data-content="${escapeHtml(item.content||"")}"><div class="news-card-image">${getImage(item.image_url,true)}</div><div class="news-card-body"><div class="news-meta"><span>${formatDate(item.published_at||item.created_at)}</span><span>${escapeHtml(item.category)}</span></div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.excerpt||"")}</p><button class="news-read" type="button" data-news-id="${item.id}">Ler notícia <span>→</span></button></div></article>`;}
  function feature(item){featured.dataset.category=item.category;featured.dataset.title=item.title;featured.innerHTML=`<div class="news-featured-image">${getImage(item.image_url,false)}</div><div class="news-featured-content"><div class="news-meta"><span>${formatDate(item.published_at||item.created_at)}</span><span>•</span><span>${escapeHtml(item.category)}</span></div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.excerpt||"")}</p><button class="news-read" type="button" data-news-id="${item.id}">Ler notícia <span>↗</span></button></div>`;}
  function renderModal(item){
    let modal=document.getElementById("newsModal");
    if(!modal){modal=document.createElement("div");modal.id="newsModal";modal.innerHTML=`<div class="news-modal-backdrop"></div><article class="news-modal"><button class="news-modal-close" aria-label="Fechar">×</button><div class="news-modal-meta"></div><h2></h2><div class="news-modal-content"></div></article>`;document.body.appendChild(modal);modal.querySelector(".news-modal-backdrop").onclick=()=>modal.remove();modal.querySelector(".news-modal-close").onclick=()=>modal.remove();}
    modal.querySelector(".news-modal-meta").textContent=`${formatDate(item.published_at||item.created_at)} · ${item.category}`;
    modal.querySelector("h2").textContent=item.title;
    modal.querySelector(".news-modal-content").innerHTML=escapeHtml(item.content||"").split(/\n+/).filter(Boolean).map(p=>`<p>${p}</p>`).join("");
  }

  try{
    const res=await fetch(`${SUPABASE_URL}/rest/v1/news?select=id,title,slug,excerpt,content,image_url,published_at,created_at,category:news_categories(name)&published=eq.true&order=published_at.desc.nullslast,created_at.desc`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});
    if(!res.ok)throw new Error("Falha ao consultar notícias");
    const rows=await res.json();
    const items=rows.map(r=>({...r,category:r.category?.name||"Sem categoria"}));
    if(!items.length)return;
    const categories=["Todas",...new Set(items.map(i=>i.category))];
    const filterWrap=document.querySelector(".news-filters");
    if(filterWrap)filterWrap.innerHTML=categories.map(c=>`<button class="news-filter${c==="Todas"?" active":""}" data-category="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join("");
    feature(items[0]);
    grid.innerHTML=items.slice(1).map(card).join("");
    if(empty)empty.hidden=true;

    const state={category:"Todas",query:""};
    function applyFilters(){
      const filtered=items.filter(i=>(state.category==="Todas"||i.category===state.category)&&`${i.title} ${i.excerpt||""} ${i.category}`.toLowerCase().includes(state.query.toLowerCase()));
      if(!filtered.length){featured.hidden=true;grid.innerHTML="";if(empty)empty.hidden=false;return;}
      featured.hidden=false;feature(filtered[0]);grid.innerHTML=filtered.slice(1).map(card).join("");if(empty)empty.hidden=true;
      document.querySelectorAll(".news-card.reveal").forEach(el=>observer.observe(el));
    }
    filterWrap?.addEventListener("click",e=>{const btn=e.target.closest(".news-filter");if(!btn)return;state.category=btn.dataset.category;filterWrap.querySelectorAll(".news-filter").forEach(b=>b.classList.toggle("active",b===btn));applyFilters();});
    document.getElementById("newsSearch")?.addEventListener("input",e=>{state.query=e.target.value.trim();applyFilters();});
    section.addEventListener("click",async e=>{const btn=e.target.closest(".news-read");if(!btn)return;const item=items.find(i=>i.id===btn.dataset.newsId);if(item)renderModal(item);});
    document.querySelectorAll(".news-card.reveal").forEach(el=>observer.observe(el));
  }catch(error){console.warn("CSK notícias: usando conteúdo estático de fallback.",error);}
})();
