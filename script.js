const glow=document.getElementById("cursorGlow");
window.addEventListener("pointermove",e=>{if(glow){glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px";}});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("show");observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
const menuToggle=document.querySelector(".menu-toggle"),nav=document.querySelector(".nav");
menuToggle?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",open);});
document.querySelectorAll(".menu a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
const yearEl=document.getElementById("year");if(yearEl)yearEl.textContent=new Date().getFullYear();

// WHATSAPP
const WHATSAPP_NUMBER="557130430188";
const whatsappUrl=`https://wa.me/${WHATSAPP_NUMBER}`;
document.querySelectorAll('.hero-actions .button-primary').forEach(button=>{
  button.setAttribute('href',whatsappUrl);
  button.setAttribute('target','_blank');
  button.setAttribute('rel','noopener noreferrer');
});

// FORMULÁRIO DE CONTATO
const contactForm=document.getElementById('contactForm');
contactForm?.addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.getElementById('name')?.value.trim()||'';
  const email=document.getElementById('email')?.value.trim()||'';
  const message=document.getElementById('message')?.value.trim()||'';
  const subject=encodeURIComponent(`Contato pelo site CSK — ${name}`);
  const body=encodeURIComponent(`Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`);
  window.location.href=`mailto:contato@cskadv.com.br?subject=${subject}&body=${body}`;
});

// RODAPÉ — somente a área da marca, no estilo da referência
(() => {
  const footerBrand=document.querySelector("footer .footer-brand");
  if(!footerBrand) return;

  footerBrand.setAttribute("aria-label","CSK Advogados");
  footerBrand.innerHTML=`<img src="assets/logo-csk.jpeg" alt="CSK" class="footer-logo-image"><span class="footer-logo-divider"></span><span class="footer-logo-name">ADVOGADOS</span>`;

  footerBrand.style.display="flex";
  footerBrand.style.alignItems="center";
  footerBrand.style.gap="18px";
  footerBrand.style.width="390px";
  footerBrand.style.height="76px";
  footerBrand.style.flexShrink="0";
  footerBrand.style.color="#b7c4d8";

  const img=footerBrand.querySelector(".footer-logo-image");
  if(img){
    img.style.width="64px";
    img.style.height="64px";
    img.style.objectFit="cover";
    img.style.borderRadius="50%";
    img.style.display="block";
  }

  const divider=footerBrand.querySelector(".footer-logo-divider");
  if(divider){
    divider.style.width="1px";
    divider.style.height="48px";
    divider.style.background="#9eacc0";
    divider.style.display="block";
  }

  const name=footerBrand.querySelector(".footer-logo-name");
  if(name){
    name.style.fontSize="16px";
    name.style.letterSpacing=".32em";
    name.style.fontWeight="500";
    name.style.color="#aebbd0";
    name.style.whiteSpace="nowrap";
  }
})();

// TOPO — mesma marca visual usada no rodapé, sem alterar o restante do cabeçalho
(() => {
  const headerBrand=document.querySelector("header .brand");
  if(!headerBrand) return;

  headerBrand.setAttribute("aria-label","CSK início");
  headerBrand.innerHTML=`<img src="assets/logo-csk.jpeg" alt="CSK" class="header-logo-image"><span class="header-logo-divider"></span><span class="header-logo-name">ADVOGADOS</span>`;
  headerBrand.style.display="flex";
  headerBrand.style.alignItems="center";
  headerBrand.style.gap="12px";
  headerBrand.style.width="280px";
  headerBrand.style.height="58px";
  headerBrand.style.flexShrink="0";
  headerBrand.style.textDecoration="none";

  const img=headerBrand.querySelector(".header-logo-image");
  if(img){
    img.style.width="48px";
    img.style.height="48px";
    img.style.objectFit="cover";
    img.style.borderRadius="50%";
    img.style.display="block";
  }

  const divider=headerBrand.querySelector(".header-logo-divider");
  if(divider){
    divider.style.width="1px";
    divider.style.height="36px";
    divider.style.background="#9eacc0";
    divider.style.display="block";
  }

  const name=headerBrand.querySelector(".header-logo-name");
  if(name){
    name.style.fontSize="12px";
    name.style.letterSpacing=".25em";
    name.style.fontWeight="500";
    name.style.color="#aebbd0";
    name.style.whiteSpace="nowrap";
  }
})();

// ÁREAS DE ATUAÇÃO
const areaCards=document.querySelectorAll('.area-card');
areaCards.forEach(card=>card.addEventListener('mouseenter',()=>card.classList.add('is-hovered')));
areaCards.forEach(card=>card.addEventListener('mouseleave',()=>card.classList.remove('is-hovered')));

// NOTÍCIAS — integração com Supabase, quando configurada
(() => {
  const grid=document.querySelector('.news-grid');
  if(!grid || typeof window.supabase==='undefined') return;
})();
