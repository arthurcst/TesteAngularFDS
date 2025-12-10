import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { RouterLink, ActivatedRoute } from '@angular/router';
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
  selector: 'app-busca',
  imports: [Header, Footer, RouterLink, CommonModule],
  templateUrl: './busca.html',
  styleUrl: './busca.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Busca {
  private carroService = inject(CarroService);
  private route = inject(ActivatedRoute);

  carros = signal<Carro[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  termoBusca = signal<string>('');

  veiculos = computed<VeiculoDisplay[]>(() => {
    const carrosList = this.carros();
    const termo = this.termoBusca().toLowerCase();

    return carrosList
      .filter((carro) => {
        if (!termo) return true;
        return (
          carro.modelo.toLowerCase().includes(termo) ||
          carro.marca.toLowerCase().includes(termo) ||
          carro.cor.toLowerCase().includes(termo)
        );
      })
      .map((carro, index) => ({
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
    this.route.queryParams.subscribe((params) => {
      const categoria = params['categoria'];
      const q = params['q'];

      if (q) {
        this.termoBusca.set(q);
        this.buscarCarro(q);
      } else if (categoria) {
        this.termoBusca.set(categoria);
        this.carregarCarros();
      } else {
        this.carregarCarros();
      }
    });
  }

  private carregarCarros() {
    this.loading.set(true);
    this.error.set(null);

    this.carroService
      .listarCarros()
      .pipe(
        catchError((err) => {
          console.error('Erro ao carregar carros:', err);
          this.error.set('Erro ao carregar carros.');
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

  private buscarCarro(modelo: string) {
    this.loading.set(true);
    this.error.set(null);

    this.carroService
      .buscarCarro(modelo)
      .pipe(
        catchError((err) => {
          console.error('Erro ao buscar carro:', err);
          this.error.set('Carro não encontrado.');
          this.loading.set(false);
          return of(null);
        })
      )
      .subscribe({
        next: (carro) => {
          if (carro) {
            this.carros.set([carro]);
          } else {
            this.carros.set([]);
          }
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
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
    };
    return tagMap[tag] || 'tag-disabled';
  }
}
