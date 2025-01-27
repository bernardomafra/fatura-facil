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
  Hospedagens = 'Hospedagens',
  Moradia = 'Moradia',
  Utilidades = 'Utilidades',
  Streaming = 'Streaming',
  Musica = 'Música',
  Farmacia = 'Farmácia',
  Educacao = 'Educação',
  Outros = 'Outros',
  Gasolina = 'Gasolina',
  Assinaturas = 'Assinaturas',
  Bares = 'Bares',
  Eventos = 'Eventos',
  Pet = 'Pet',
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