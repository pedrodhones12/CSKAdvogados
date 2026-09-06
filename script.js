const glow=document.getElementById("cursorGlow");
window.addEventListener("pointermove",e=>{if(glow){glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px";}});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("show");observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
const menuToggle=document.querySelector(".menu-toggle"),nav=document.querySelector(".nav");
menuToggle?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",open);});
document.querySelectorAll(".menu a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
document.getElementById("year")?.textContent=new Date().getFullYear();
const form=document.getElementById("contactForm"),status=document.getElementById("formStatus");
form?.addEventListener("submit",e=>{e.preventDefault();const data=new FormData(form);const name=data.get("name");if(status)status.textContent=`Obrigado, ${name}. Esta demonstração está pronta para conectar ao e-mail ou a um serviço de formulários.`;form.reset();});
document.querySelectorAll(".area-card").forEach(card=>card.addEventListener("mousemove",e=>{const rect=card.getBoundingClientRect();const x=(e.clientX-rect.left)/rect.width-.5;card.style.transform=`translateX(${x*8}px)`;}));
document.querySelectorAll(".area-card").forEach(card=>card.addEventListener("mouseleave",()=>card.style.transform=""));

/* =========================================================
   CSK — NOTÍCIAS DINÂMICAS NA PÁGINA INICIAL
   Notícias publicadas + marcadas para exibição na página inicial.
   Cada clique abre a página individual da notícia.
   ========================================================= */
(() => {
  const grid=document.getElementById("newsGrid");
  const featured=document.querySelector(".news-featured");
  if(!grid || !featured) return;

  const SUPABASE_URL="https://elrldxaapgfbygurzdzb.supabase.co";
  const SUPABASE_KEY="sb_publishable_cLOSGNA_YltxIaezf9JokA_FYcIttmn";
  const load=()=>{
    if(typeof supabase==="undefined") return;
    const db=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
    db.from("noticias").select("*").eq("publicada",true).eq("exibir_inicio",true).order("created_at",{ascending:false}).then(({data,error})=>{
      if(error){console.error("CSK notícias:",error);return;}
      const news=data||[];
      if(!news.length){featured.style.display="none";grid.innerHTML="<div style=\"grid-column:1/-1;padding:35px;color:#687386\">Nenhuma notícia publicada no momento.</div>";return;}
      const esc=v=>String(v??"").replace(/[&<>\"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
      const fmt=v=>v?new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(v)).replace(".","").toUpperCase():"";
      const url=v=>v&&/^https?:\/\//i.test(v)?v:"";
      const link=id=>`noticia.html?id=${encodeURIComponent(id)}`;
      const first=news.find(n=>n.destaque)||news[0];
      const im=url(first.imagem_url);
      featured.hidden=false;
      featured.style.display="grid";
      featured.dataset.category=first.categoria||"";
      featured.dataset.title=first.titulo||"";
      featured.innerHTML=`<div class="news-featured-image">${im?`<img src="${esc(im)}" alt="${esc(first.titulo)}" style="width:100%;height:100%;object-fit:cover">`:`<div class="news-image-placeholder"><span>CSK</span><small>NOTÍCIA CSK</small></div>`}</div><div class="news-featured-content"><div class="news-meta"><span>${esc(fmt(first.created_at))}</span><span>•</span><span>${esc(first.categoria||"")}</span></div><h3>${esc(first.titulo)}</h3><p>${esc(first.resumo||"")}</p><a class="news-read" href="${link(first.id)}">Ler notícia <span>↗</span></a></div>`;
      const cards=news.filter(n=>n.id!==first.id);
      grid.innerHTML=cards.map(n=>{const ci=url(n.imagem_url);return `<article class="news-card reveal"><div class="news-card-image">${ci?`<img src="${esc(ci)}" alt="${esc(n.titulo)}" style="width:100%;height:100%;object-fit:cover">`:`<div class="news-image-placeholder compact"><span>CSK</span></div>`}</div><div class="news-card-body"><div class="news-meta"><span>${esc(fmt(n.created_at))}</span><span>${esc(n.categoria||"")}</span></div><h3>${esc(n.titulo)}</h3><p>${esc(n.resumo||"")}</p><a class="news-read" href="${link(n.id)}">Ler notícia <span>↗</span></a></div></article>`}).join("")||"<div style=\"grid-column:1/-1;padding:20px\"></div>";
      document.querySelectorAll(".news-filter").forEach(btn=>btn.addEventListener("click",()=>{
        const cat=btn.dataset.category||"Todas";
        grid.querySelectorAll(".news-card").forEach(card=>{card.hidden=cat!=="Todas"&&(card.querySelector(".news-meta span:last-child")?.textContent!==cat)});
        const fcat=featured.dataset.category||""; featured.hidden=cat!=="Todas"&&fcat!==cat;
      }));
      document.getElementById("newsSearch")?.addEventListener("input",e=>{
        const term=e.target.value.toLowerCase().trim();
        grid.querySelectorAll(".news-card").forEach(card=>{card.hidden=!!term&&!card.textContent.toLowerCase().includes(term)});
        featured.hidden=!!term&&!featured.textContent.toLowerCase().includes(term);
      });
      document.querySelectorAll(".reveal").forEach(el=>{try{observer.observe(el)}catch(_){el.classList.add("show")}});
    });
  };
  if(typeof supabase==="undefined"){
    const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";s.onload=load;document.head.appendChild(s);
  }else load();
})();