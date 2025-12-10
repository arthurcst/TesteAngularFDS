import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarroService } from '../../services/carro.service';
import { Carro } from '../../models/carro.model';
import { catchError, of } from 'rxjs';

interface VeiculoDisplay {
  id: number;
  nome: string;
  preco: string;
  imagem: string;
  tags: string[];
  data: string;
  localizacao: string;
  carro?: Carro;
}

@Component({
  selector: 'app-home',
  imports: [Header, Footer, RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private carroService = inject(CarroService);

  carros = signal<Carro[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  veiculos = computed<VeiculoDisplay[]>(() => {
    const carrosList = this.carros();
    if (carrosList.length === 0) {
      // Dados mockados como fallback
      return this.getMockVeiculos();
    }

    return carrosList.map((carro, index) => ({
      id: index + 1,
      nome: `${carro.marca} ${carro.modelo} - ${carro.cor}`,
      preco: `R$ ${carro.preco.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      imagem: this.getImagemPorModelo(carro.modelo),
      tags: this.getTagsPorCarro(carro),
      data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      localizacao: 'Recife-PE',
      carro,
    }));
  });

  constructor() {
    this.carregarCarros();
  }

  private carregarCarros() {
    this.loading.set(true);
    this.error.set(null);

    this.carroService
      .listarCarros()
      .pipe(
        catchError((err) => {
          console.error('Erro ao carregar carros:', err);
          this.error.set('Erro ao carregar carros. Exibindo dados de exemplo.');
          this.loading.set(false);
          return of([]);
        })
      )
      .subscribe({
        next: (carros) => {
          this.carros.set(carros);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  private getMockVeiculos(): VeiculoDisplay[] {
    return [
      {
        id: 1,
        nome: 'Hyundai Creta - Cinza',
        preco: 'R$ 89.000,00',
        imagem: 'assets/creta.jpeg',
        tags: ['Espaçoso', 'Custo-benefício', 'Premium', 'Peruas finas'],
        data: '23, set',
        localizacao: 'Recife-PE',
      },
      {
        id: 2,
        nome: 'Volkswagen Golf - Vermelho',
        preco: 'R$ 1,99',
        imagem: 'assets/golf.jpeg',
        tags: ['Homem-golpe'],
        data: '02, abr',
        localizacao: 'Surubim-PE',
      },
      {
        id: 3,
        nome: 'Bell 505 Jet Ranger X - Preto',
        preco: 'R$ 100.000,00',
        imagem: 'assets/helicoptero.jpeg',
        tags: ['Ideal para fugir do Brasil', 'Aluguel', 'Redim-usado'],
        data: '10, out',
        localizacao: 'Rio de Janeiro-RJ',
      },
      {
        id: 4,
        nome: 'Yamaha R15 - Azul',
        preco: 'R$ 19.500,00',
        imagem: 'assets/r15.jpg',
        tags: ['Motomami'],
        data: '31, ago',
        localizacao: '...',
      },
    ];
  }

  private getImagemPorModelo(modelo: string): string {
    const modeloLower = modelo.toLowerCase();
    if (modeloLower.includes('creta')) return 'assets/creta.jpeg';
    if (modeloLower.includes('golf')) return 'assets/golf.jpeg';
    if (modeloLower.includes('helicoptero') || modeloLower.includes('bell'))
      return 'assets/helicoptero.jpeg';
    if (modeloLower.includes('r15') || modeloLower.includes('yamaha')) return 'assets/r15.jpg';
    return 'assets/creta.jpeg';
  }

  private getTagsPorCarro(carro: Carro): string[] {
    const tags: string[] = [];
    if (carro.quantidadeDePortas >= 4) tags.push('Espaçoso');
    if (carro.preco < 50000) tags.push('Custo-benefício');
    if (carro.preco > 80000) tags.push('Premium');
    if (carro.potenciaMotor) tags.push(`Potência ${carro.potenciaMotor}`);
    return tags;
  }

  getTagClass(tag: string): string {
    const tagMap: Record<string, string> = {
      Espaçoso: 'tag-teal',
      'Custo-benefício': 'tag-blue',
      Premium: 'tag-purple',
      'Peruas finas': 'tag-pink',
      'Homem-golpe': 'tag-red',
      'Ideal para fugir do Brasil': 'tag-orange',
      Aluguel: 'tag-green',
      'Redim-usado': 'tag-blue',
      Motomami: 'tag-pink',
    };
    return tagMap[tag] || 'tag-disabled';
  }
}
