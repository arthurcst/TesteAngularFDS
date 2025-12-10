export interface Carro {
  modelo: string;
  marca: string;
  versao: string;
  cor: string;
  quilometragem: number;
  ano: number;
  preco: number;
  cambio: string;
  quantidadeDePortas: number;
  potenciaMotor: string;
}

export interface ComparacaoPreco {
  precoAnuncio: number;
  precoFipe: number;
  diferenca: number;
  recomendacao: string;
}
