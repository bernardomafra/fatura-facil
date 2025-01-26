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

  // Entertainment & Media (Shades of Purple)
  [CategoryLabels.Entretenimento]: "#A855F7", // Bright purple
  [CategoryLabels.Streaming]: "#9333EA",      // Medium purple
  [CategoryLabels.Musica]: "#8B5CF6",        // Light purple

  // Health & Wellness (Shades of Pink/Red)
  [CategoryLabels.Saude]: "#EC4899",       // Pink
  [CategoryLabels.Farmacia]: "#F43F5E",    // Red

  // Shopping & Services (Shades of Orange)
  [CategoryLabels.Compras]: "#F97316",     // Bright orange
  [CategoryLabels.Servicos]: "#EA580C",    // Dark orange

  // Home & Utilities (Shades of Teal)
  [CategoryLabels.Moradia]: "#14B8A6",     // Bright teal
  [CategoryLabels.Utilidades]: "#0D9488",  // Dark teal

  // Education & Technology (Shades of Indigo)
  [CategoryLabels.Educacao]: "#6366F1",    // Bright indigo
  [CategoryLabels.Tecnologia]: "#4F46E5",  // Dark indigo

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
    keywords: ['hambur', 'restaurante', 'food', 'pizza', 'lanche', 'burger', 'cafeteria', 'padaria', 'acai', 'sorveteria', 'doceria', 'confeitaria', 'bar', 'pub', 'choperia', 'delivery'],
    merchantPatterns: [
      /food/i,
      /burger/i,
      /rest(aurante)?/i,
      /bar\s+e/i,
      /delivery/i,
      /lanches/i,
    ],
    color: CategoryColors[CategoryLabels.Alimentacao],
  },
  {
    label: CategoryLabels.Mercado,
    icon: '🛒',
    keywords: ['mercado', 'super', 'hiper', 'atacado', 'atacadista', 'hortifruti', 'sacolao', 'feira', 'carrefour', 'pao de acucar', 'extra', 'dia', 'assai', 'sams', 'makro'],
    merchantPatterns: [
      /^sup(er)?/i,
      /^merc(ado)?/i,
      /^hiper/i,
      /market/i,
    ],
    color: CategoryColors[CategoryLabels.Mercado],
  },
  {
    label: CategoryLabels.Transporte,
    icon: '🚗',
    keywords: ['uber', 'taxi', '99', 'cabify', 'transporte', 'mobilidade', 'corrida', 'transfer', 'estacionamento', 'posto', 'combustivel', 'gasolina'],
    merchantPatterns: [
      /^uber/i,
      /^99\s/i,
      /taxi/i,
      /transfer/i,
      /^posto/i,
    ],
    amountPatterns: [
      { min: 10, max: 100 } // Typical ride-sharing range
    ],
    color: CategoryColors[CategoryLabels.Transporte],
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
    keywords: ['shopping', 'loja', 'store', 'magazine', 'americanas', 'renner', 'riachuelo', 'marisa', 'cea', 'casas bahia', 'ponto frio'],
    merchantPatterns: [
      /shop(ping)?/i,
      /store/i,
      /loja/i,
      /magazine/i
    ],
    color: CategoryColors[CategoryLabels.Compras],
  },
  {
    label: CategoryLabels.Viagens,
    icon: '✈️',
    keywords: ['viagem', 'passagem', 'aerea', 'voo', 'hotel', 'pousada', 'hostel', 'airbnb', 'booking', 'decolar', 'cvc', 'latam', 'gol', 'azul'],
    merchantPatterns: [
      /^hotel/i,
      /pousada/i,
      /hostel/i,
      /airbnb/i,
      /booking/i
    ],
    amountPatterns: [
      { min: 200 } // Typical travel expense minimum
    ],
    color: CategoryColors[CategoryLabels.Viagens],
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
      score += 3;
    }
  });

  // Check amount patterns
  rule.amountPatterns?.forEach(pattern => {
    const { min, max } = pattern;
    if ((!min || transaction.amount >= min) && (!max || transaction.amount <= max)) {
      score += 1;
    }
  });

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