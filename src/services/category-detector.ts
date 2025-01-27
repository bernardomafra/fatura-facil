import { Category, CategoryLabels, Transaction } from '../types/transaction';
import { detectCategoriesWithAI } from './openai-detector';

const CategoryColors: Record<CategoryLabels, string> = {
  // Food & Groceries (Shades of Green)
  [CategoryLabels.Alimentacao]: "#22C55E",  // Bright green
  [CategoryLabels.Mercado]: "#16A34A",      // Dark green
  [CategoryLabels.iFood]: "#4ADE80",        // Light green

  // Transportation & Travel (Shades of Blue)
  [CategoryLabels.Transporte]: "#3B82F6",   // Bright blue
  [CategoryLabels.Viagens]: "#2563EB",      // Dark blue
  [CategoryLabels.Hospedagens]: "#6aa0f6",

  // Entertainment & Media (Shades of Purple)
  [CategoryLabels.Entretenimento]: "#A855F7", // Bright purple
  [CategoryLabels.Streaming]: "#9333EA",      // Medium purple
  [CategoryLabels.Musica]: "#8B5CF6",        // Light purple,
  [CategoryLabels.Assinaturas]: "#977cd5",        // Light purple

  // Health & Wellness (Shades of Pink/Red)
  [CategoryLabels.Saude]: "#EC4899",       // Pink
  [CategoryLabels.Farmacia]: "#F43F5E",    // Red

  // Shopping & Services (Shades of Orange)
  [CategoryLabels.Compras]: "#F97316",     // Bright orange
  [CategoryLabels.Servicos]: "#EA580C",    // Dark orange
  [CategoryLabels.Gasolina]: "#eaba0c",

  // Home & Utilities (Shades of Teal)
  [CategoryLabels.Moradia]: "#14B8A6",     // Bright teal
  [CategoryLabels.Utilidades]: "#0D9488",  // Dark teal
  [CategoryLabels.Pet]: "#70cbc3",

  // Education & Technology (Shades of Indigo)
  [CategoryLabels.Educacao]: "#6366F1",    // Bright indigo
  [CategoryLabels.Tecnologia]: "#4F46E5",  // Dark indigo

  // Fun, Going out & Other
  [CategoryLabels.Bares]: "#227b77",
  [CategoryLabels.Eventos]: "#52cac4",

  // Other
  [CategoryLabels.Outros]: "#64748B",      // Slate gray
} as const;


interface CategoryRule {
  keywords: string[];
  icon: string;
  label: CategoryLabels;
  color: string;
  merchantPatterns?: RegExp[];
  amountPatterns?: {
    min?: number;
    max?: number;
  }[];
}

const categoryRules: CategoryRule[] = [
  {
    label: CategoryLabels.iFood,
    icon: '🛵',
    keywords: ['ifd', 'ifood'],
    merchantPatterns: [
      /^ifd\*/i,
      /ifood/i,
    ],
    color: CategoryColors[CategoryLabels.iFood],
  },
  {
    label: CategoryLabels.Alimentacao,
    icon: '🍽️',
    keywords: ['hambur', 'restaurante', 'food', 'pizza', 'lanche', 'burger', 'cafeteria', 'padaria', 'acai', 'sorvete', 'doceria', 'confeitaria', 'bar', 'pub', 'choperia', 'delivery', 'cozinha', 'aconchego da praca', 'Jeronimo', 'madero', 'Arlindo Umbelino', 'Exoticus', 'Godo', 'Gennaro', 'Popeyes', 'Xico da Carne'],
    merchantPatterns: [
      /food/i,
      /burger/i,
      /rest(aurante)?/i,
      /bar\s+e/i,
      /delivery/i,
      /lanches/i,
      /cozinha/i,
      /jeronimo/i,
      /madero/i,
      /arlindo\s+umbelino/i,
      /exoticus/i
    ],
    color: CategoryColors[CategoryLabels.Alimentacao],
  },
  {
    label: CategoryLabels.Mercado,
    icon: '🛒',
    keywords: ['mercado', 'super', 'sup', 'hiper', 'atacado', 'atacadista', 'hortifruti', 'sacolao', 'feira', 'carrefour', 'pao de acucar', 'extra', 'dia', 'assai', 'sams', 'makro', 'comercio', 'comercio de alimentos', 'supermercado', 'bh', 'epa', 'daki', 'supernosso', 'verdemar', 'panificadora', 'pao', 'paes'],
    merchantPatterns: [
      /^sup(er)?/i,
      /^hiper/i,
      /market/i,
      /comercio/i,
      /comercio\s+de\s+alimentos/i,
      /supermercado/i,
      /bh/i,
      /epa/i,
      /daki/i,
      /supernosso/i,
      /verdemar/i,
      /panificadora/i,
      /paes/i
    ],
    color: CategoryColors[CategoryLabels.Mercado],
  },
  {
    label: CategoryLabels.Transporte,
    icon: '🚗',
    keywords: ['uber', 'taxi', '99', 'cabify', 'transporte', 'mobilidade', 'corrida', 'transfer', 'estacionamento'],
    merchantPatterns: [
      /^uber/i,
      /^99\s/i,
      /taxi/i,
      /transfer/i,
    ],
    amountPatterns: [
      { min: 10, max: 100 } // Typical ride-sharing range
    ],
    color: CategoryColors[CategoryLabels.Transporte],
  },
  {
    label: CategoryLabels.Gasolina,
    icon: '⛽️',
    keywords: ['gasolina', 'posto', 'combustivel', 'gasolina', 'Cristiano Machado'],
    merchantPatterns: [
      /^posto/i,
      /gasolina/i,
      /combustivel/i,
      /posto\s+gasolina/i,
      /posto\s+combustivel/i,
      /posto\s+gas/i,
      /posto\s+gas/i,
      /posto\s+gasolina/i,
      /posto\s+combustivel/i,
    ],
    color: CategoryColors[CategoryLabels.Gasolina],
  },
  {
    label: CategoryLabels.Streaming,
    icon: '📺',
    keywords: ['netflix', 'prime', 'disney', 'hbo', 'paramount', 'youtube', 'streaming', 'play', 'now', 'apple tv'],
    merchantPatterns: [
      /netflix/i,
      /prime\s*video/i,
      /disney\+/i,
      /hbo/i,
      /youtube/i
    ],
    amountPatterns: [
      { min: 15, max: 60 } // Typical streaming service range
    ],
    color: CategoryColors[CategoryLabels.Streaming],
  },
  {
    label: CategoryLabels.Musica,
    icon: '🎵',
    keywords: ['spotify', 'apple music', 'deezer', 'tidal', 'youtube music', 'pandora'],
    merchantPatterns: [
      /spotify/i,
      /apple\s*music/i,
      /deezer/i,
      /tidal/i
    ],
    amountPatterns: [
      { min: 8, max: 30 } // Typical music service range
    ],
    color: CategoryColors[CategoryLabels.Musica],
  },
  {
    label: CategoryLabels.Assinaturas,
    icon: '🔐',
    keywords: ['play', 'now', 'apple tv', 'bill', 'recurrence', 'subscription', 'clubewine', 'Cursor, Ai', 'clube wine', 'Contabilizei Tecnologi', 'Contorno do Corpo'],
    merchantPatterns: [
      /bill/i,
      /recurrence/i,
      /subscription/i,
      /clubewine/i,
      /cursor, ai/i,
      /contabilizei\s+tecnologi/i,
      /contorno\s+do\s+corpo/i
    ],
    amountPatterns: [
      { min: 8, max: 30 } // Typical music service range
    ],
    color: CategoryColors[CategoryLabels.Assinaturas],
  },
  {
    label: CategoryLabels.Farmacia,
    icon: '💊',
    keywords: ['farmacia', 'drogaria', 'medicamento', 'remedio', 'manipulacao', 'droga', 'raia', 'pacheco', 'nissei', 'panvel'],
    merchantPatterns: [
      /^farm(acia)?/i,
      /^drog(aria)?/i,
      /remedios/i,
      /manipul/i
    ],
    color: CategoryColors[CategoryLabels.Farmacia],
  },
  {
    label: CategoryLabels.Saude,
    icon: '🏥',
    keywords: ['hospital', 'clinica', 'medico', 'consulta', 'exame', 'laboratorio', 'dentista', 'ortodontia', 'psico', 'terapia', 'fisio'],
    merchantPatterns: [
      /hosp(ital)?/i,
      /clin(ica)?/i,
      /lab(oratorio)?/i,
      /dr\./i,
      /dra\./i
    ],
    amountPatterns: [
      { min: 100, max: 1000 } // Typical medical service range
    ],
    color: CategoryColors[CategoryLabels.Saude],
  },
  {
    label: CategoryLabels.Utilidades,
    icon: '⚡',
    keywords: ['energia', 'luz', 'agua', 'gas', 'telefone', 'internet', 'tv', 'celular', 'conta', 'fatura', 'servico'],
    merchantPatterns: [
      /energia/i,
      /telecom/i,
      /net/i,
      /vivo/i,
      /claro/i,
      /tim/i,
      /oi/i
    ],
    amountPatterns: [
      { min: 50, max: 500 } // Typical utility bill range
    ],
    color: CategoryColors[CategoryLabels.Utilidades],
  },
  {
    label: CategoryLabels.Compras,
    icon: '🛍️',
    keywords: ['shopping', 'loja', 'store', 'magazine', 'americanas', 'renner', 'riachuelo', 'marisa', 'cea', 'casas bahia', 'ponto frio', 'parcela', 'ml', 'mercadolivre', 'mp', 'mercado livre', 'mercado pago', 'estetica', 'Enxovais', 'boulevard' , 'patio savassi', 'diamond mall', 'bh shop', 'Pernambucanas'],
    merchantPatterns: [
      /shop(ping)?/i,
      /store/i,
      /loja/i,
      /magazine/i,
      /parcela/i,
      /americanas/i,
      /renner/i,
      /riachuelo/i,
      /marisa/i,
      /cea/i,
      /casas\s+bahia/i,
      /ponto\s+frio/i,
      /mercadolivre/i,
      /ml/i,
      /mp/i,
      /estetica/i,
      /enxovais/i,
      /boulevard/i,
      /patio\s+savassi/i,
      /diamond\s+mall/i,
      /bh\s+shop/i
    ],
    color: CategoryColors[CategoryLabels.Compras],
  },
  {
    label: CategoryLabels.Hospedagens,
    icon: '🏨',
    keywords: ['hotel', 'pousada', 'hostel', 'airbnb', 'booking', 'chale', 'chale hotel', 'chale hotel & spa', 'chale hotel & spa'],
    merchantPatterns: [
      /^hotel/i,
      /pousada/i,
      /hostel/i,
      /airbnb/i,
      /booking/i,
      /chale/i,
      /chale\s+hotel/i,
      /chale\s+hotel\s+&/i,
      /chale\s+hotel\s+&\s+spa/i,
      /parcela/i
    ],
    amountPatterns: [
      { min: 200 } // Typical travel expense minimum
    ],
    color: CategoryColors[CategoryLabels.Viagens],
  },
  {
    label: CategoryLabels.Viagens,
    icon: '✈️',
    keywords: ['viagem', 'passagem', 'aerea', 'voo', 'decolar', 'cvc', 'latam', 'gol', 'azul'],
    merchantPatterns: [
      /booking/i,
      /decolar/i,
      /cvc/i,
      /latam/i,
      /gol/i,
      /azul/i,
      /voo/i,
      /passagem/i,
      /aerea/i,
      /viagem/i,
      /parcela/i
    ],
    amountPatterns: [
      { min: 200 } // Typical travel expense minimum
    ],
    color: CategoryColors[CategoryLabels.Viagens],
  },
  {
    label: CategoryLabels.Bares,
    icon: '🍺',
    keywords: ['bar', 'pub', 'choperia', 'delivery', 'mercado nov', 'zig', 'mascate', 'distribuidora', 'garrafa', 'vinho', 'cerveja', 'chopp', 'Zé Delivery'],
    merchantPatterns: [
      /bar/i,
      /pub/i,
      /choperia/i,
      /delivery/i,
      /mercado\s+nov/i,
      /zig/i,
      /mascate/i,
      /espeto/i,
      /distribuidora/i,
      /garrafa/i,
      /vinho/i,
      /cerveja/i,
      /chopp/i,
      /ze\s+delivery/i
    ],
    color: CategoryColors[CategoryLabels.Bares],
  },
  {
    label: CategoryLabels.Pet,
    icon: '🐈',
    keywords: ['petz', 'vet', 'petshop', 'pet', 'cachorro', 'gato', 'cavalo', 'peixe', 'passarinho', 'coelho', 'roedor', 'reptil', 'aves', 'anfibio', 'peixe', 'passarinho', 'coelho', 'roedor', 'reptil', 'aves', 'anfibio'],
    merchantPatterns: [
      /petz/i,
      /petshop/i,
      /cachorro/i,
      /gato/i,
      /cavalo/i,
      /racao/i,
      /ração/i,
      /areia/i,
    ],
    color: CategoryColors[CategoryLabels.Pet],
  },
  {
    label: CategoryLabels.Entretenimento,
    icon: '🎥',
    keywords: ['Cinemark', 'cinema', 'filme', 'filmes', 'cinema', 'filme', 'filmes', 'cinema', 'filme', 'filmes'],
    merchantPatterns: [
      /cinemark/i,
      /cinema/i,
      /filme/i,
      /filmes/i,
    ],
    color: CategoryColors[CategoryLabels.Entretenimento],
  }
];

function calculateScore(rule: CategoryRule, transaction: { name: string; amount: number }): number {
  let score = 0;
  const normalizedName = transaction.name.toLowerCase();

  // Check keywords
  rule.keywords.forEach(keyword => {
    if (normalizedName.includes(keyword.toLowerCase())) {
      score += 2;
    }
  });

  // Check merchant patterns
  rule.merchantPatterns?.forEach(pattern => {
    if (pattern.test(normalizedName)) {
      score += 4;
    }
  });

  // // Check amount patterns
  // rule.amountPatterns?.forEach(pattern => {
  //   const { min, max } = pattern;
  //   if ((!min || transaction.amount >= min) && (!max || transaction.amount <= max)) {
  //     score += 1;
  //   }
  // });

  return score;
}

export const detectCategory = (name: string, amount: number = 0): Category => {
  let bestMatch: Category = { icon: '💳', label: CategoryLabels.Outros, color: CategoryColors[CategoryLabels.Outros] };
  let highestScore = 0;

  categoryRules.forEach(rule => {
    const score = calculateScore(rule, { name, amount });
    if (score > highestScore) {
      highestScore = score;
      bestMatch = { icon: rule.icon, label: rule.label, color: rule.color };
    }
  });

  return bestMatch;
};

export const detectCategories = (transactions: Omit<Transaction, 'category'>[]): Transaction[] => {
  return transactions.map(transaction => ({
    ...transaction,
    category: detectCategory(transaction.name, transaction.amount)
  }));
};

export const detectCategoriesWithPreference = async (
  transactions: Omit<Transaction, 'category'>[],
  useAI: boolean = false
): Promise<Transaction[]> => {
  if (useAI) {
    return detectCategoriesWithAI(transactions);
  }
  return detectCategories(transactions);
};