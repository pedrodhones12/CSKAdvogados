const team = [
  {
    name: 'Dr. Jefferson Sena',
    role: 'Direito Imobiliário e Condominial',
    image: '/assets/equipe-jefferson.jpg',
    areas: ['Direito Imobiliário', 'Direito Condominial', 'Assessoria Empresarial'],
    text: 'Atua com foco em regularização de imóveis, redução de custos tributários relacionados ao ITBI e assessoria jurídica empresarial. Sua atuação busca proporcionar segurança jurídica e soluções eficientes para questões patrimoniais e empresariais.'
  },
  {
    name: 'Dr. Matheus Cardoso',
    role: 'Planejamento Patrimonial, Tributário e Sucessório',
    image: '/assets/equipe-matheus.jpg',
    areas: ['Planejamento Patrimonial', 'Direito Tributário', 'Direito Sucessório'],
    text: 'Especialista em Planejamento Patrimonial, Tributário e Sucessório, áreas fundamentais para a organização e preservação do patrimônio. É Vice-Presidente da Comissão de Direito Tributário da OAB/BA – Subseção de Ilhéus e Diretor Jurídico da Associação Comercial e Industrial de Ilhéus/BA.'
  },
  {
    name: 'Dra. Júlia Kruschewsky',
    role: 'Direito Empresarial e Trabalhista',
    image: '/assets/equipe-julia.jpg',
    areas: ['Direito Empresarial', 'Direito Trabalhista', 'Mediação e Inovação'],
    text: 'Atua nas áreas de Direito Empresarial e Trabalhista, contribuindo para a estruturação e proteção jurídica das empresas. É Diretora de Inovação da Associação Comercial e Industrial de Ilhéus/BA e mediadora credenciada pelo CNJ, com visão voltada à prevenção de conflitos, negociação e inovação.'
  }
];

export default function Equipe() {
  return (
    <div className="team-page">
      <section className="team-hero">
        <div className="team-hero-grid" />
        <div className="team-hero-copy">
          <div className="eyebrow"><span></span> NOSSA EQUIPE</div>
          <h1>Direito, estratégia<br /><em>e visão de futuro.</em></h1>
          <p>Uma equipe jurídica preparada para transformar desafios em estratégias, unindo técnica, experiência e uma atuação próxima de pessoas e empresas.</p>
        </div>
        <div className="team-hero-mark" aria-hidden="true">
          <span>CSK</span>
          <small>Cardoso Sena Kruschewsky<br />Advogados</small>
        </div>
      </section>

      <section className="section-pad team-intro">
        <span className="section-number">01 / 03</span>
        <div className="team-intro-grid">
          <div>
            <div className="eyebrow"><span></span> ESTRATÉGIA E PROXIMIDADE</div>
            <h2>Mais do que resolver problemas, <em>antecipamos caminhos.</em></h2>
          </div>
          <div className="team-intro-copy">
            <p>Na CSK | Cardoso Sena Kruschewsky Advogados, acreditamos que a advocacia vai além da resolução de problemas. Nosso propósito é atuar de forma estratégica, preventiva e próxima dos nossos clientes, contribuindo para decisões mais seguras e para o crescimento sustentável de pessoas e empresas.</p>
            <p>Nossa equipe reúne profissionais com diferentes especialidades e experiências, permitindo uma atuação integrada em áreas essenciais para a proteção, organização e desenvolvimento dos negócios.</p>
          </div>
        </div>
      </section>

      <section className="team-members section-pad">
        <span className="section-number">02 / 03</span>
        <div className="team-section-heading">
          <div>
            <div className="eyebrow"><span></span> PROFISSIONAIS</div>
            <h2>Conheça quem<br /><em>está à frente.</em></h2>
          </div>
          <p>Experiência multidisciplinar para oferecer segurança jurídica, visão estratégica e respostas sob medida.</p>
        </div>

        <div className="team-list">
          {team.map((member, index) => (
            <article className="team-card" key={member.name}>
              <div className="team-card-image">
                <img src={member.image} alt={member.name} loading={index === 0 ? 'eager' : 'lazy'} />
                <div className="team-card-index">0{index + 1}</div>
              </div>
              <div className="team-card-body">
                <div className="team-card-topline">
                  <span className="team-card-role">{member.role}</span>
                  <span className="team-card-arrow">↗</span>
                </div>
                <h3>{member.name}</h3>
                <div className="team-tags">
                  {member.areas.map(area => <span key={area}>{area}</span>)}
                </div>
                <p>{member.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="team-closing section-pad">
        <span className="section-number">03 / 03</span>
        <div className="team-closing-inner">
          <div className="eyebrow"><span></span> VISÃO DE FUTURO</div>
          <h2>Conhecimento jurídico<br /><em>que se transforma em estratégia.</em></h2>
          <p>Uma atuação integrada para proteger decisões, estruturar negócios e construir soluções jurídicas preparadas para o que vem depois.</p>
          <a className="button button-primary" href="/#contato">Fale conosco <span>↗</span></a>
        </div>
      </section>
    </div>
  );
}
