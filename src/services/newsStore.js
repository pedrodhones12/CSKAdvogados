const KEY = 'csk_noticias_v1';
const CATEGORY_KEY = 'csk_categorias_v1';

const initialCategories = [
  'Cível',
  'Societário',
  'Contratos',
  'Digital & Inovação',
  'Tributário',
  'Imobiliário',
  'Institucional'
];

const initialNews = [
  {
    id: crypto.randomUUID(),
    title: 'Inteligência jurídica para um mercado em transformação',
    slug: 'inteligencia-juridica-para-um-mercado-em-transformacao',
    category: 'Institucional',
    excerpt: 'Conhecimento, estratégia e inovação para acompanhar decisões que exigem uma leitura além do óbvio.',
    content: 'A CSK acompanha as transformações do ambiente jurídico e empresarial com uma abordagem estratégica, técnica e próxima. Este espaço reúne análises, novidades e conteúdos produzidos pelo escritório.',
    image: '',
    published: true,
    createdAt: '2026-09-03T12:00:00.000Z'
  },
  {
    id: crypto.randomUUID(),
    title: 'Direito Digital: desafios jurídicos da inovação',
    slug: 'direito-digital-desafios-juridicos-da-inovacao',
    category: 'Digital & Inovação',
    excerpt: 'Tecnologia cria novas oportunidades — e também novas perguntas jurídicas. Veja alguns pontos de atenção.',
    content: 'A transformação digital amplia possibilidades para empresas e pessoas, mas também exige atenção a contratos, dados, propriedade intelectual, responsabilidade e governança.',
    image: '',
    published: true,
    createdAt: '2026-09-01T12:00:00.000Z'
  }
];

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getNews() {
  const data = read(KEY, null);
  if (!data) {
    write(KEY, initialNews);
    return initialNews;
  }
  return data;
}

export function saveNews(items) {
  write(KEY, items);
}

export function getCategories() {
  const data = read(CATEGORY_KEY, null);
  if (!data) {
    write(CATEGORY_KEY, initialCategories);
    return initialCategories;
  }
  return data;
}

export function saveCategories(items) {
  write(CATEGORY_KEY, items);
}

export function makeSlug(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
