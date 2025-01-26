export enum CategoryLabels {
  iFood = 'iFood',
  Alimentacao = 'Alimentação',
  Mercado = 'Mercado',
  Transporte = 'Transporte',
  Entretenimento = 'Entretenimento',
  Saude = 'Saúde',
  Compras = 'Compras',
  Servicos = 'Serviços',
  Tecnologia = 'Tecnologia',
  Viagens = 'Viagens',
  Moradia = 'Moradia',
  Utilidades = 'Utilidades',
  Streaming = 'Streaming',
  Musica = 'Música',
  Farmacia = 'Farmácia',
  Educacao = 'Educação',
  Outros = 'Outros',
}

export interface Category {
  icon: string;
  label: CategoryLabels;
  color: string;
}

export interface Transaction {
  date: string;
  category: Category;
  name: string;
  amount: number;
}