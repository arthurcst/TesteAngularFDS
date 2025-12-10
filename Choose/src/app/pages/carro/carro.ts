import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarroService } from '../../services/carro.service';
import { Carro as CarroModel } from '../../models/carro.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-carro',
  imports: [Header, Footer, CommonModule],
  templateUrl: './carro.html',
  styleUrl: './carro.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarroComponent {
  private carroService = inject(CarroService);
  private route = inject(ActivatedRoute);

  carro = signal<CarroModel | null>(null);
  comparacaoPreco = signal<string>('');
  loading = signal(false);
  error = signal<string | null>(null);

  veiculo = computed(() => {
    const c = this.carro();
    if (!c) {
      return {
        nome: 'Carregando...',
        imagem: 'assets/creta.jpeg',
        tags: [],
        descricao: '',
        preco: 'R$ 0,00',
        data: '',
        localizacao: '',
        telefone: '',
        precoMedio: 'R$ 0,00',
        precoFipe: 'R$ 0,00',
      };
    }

    return {
      nome: `${c.marca} ${c.modelo} - ${c.cor}`,
      imagem: this.getImagemPorModelo(c.modelo),
      tags: this.getTagsPorCarro(c),
      descricao: `Ano ${c.ano}, ${c.versao}, ${c.cambio}, ${c.quantidadeDePortas} portas${
        c.potenciaMotor ? `, ${c.potenciaMotor} de potência` : ''
      }. Quilometragem: ${c.quilometragem.toLocaleString('pt-BR')} km.`,
      preco: `R$ ${c.preco.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      localizacao: 'Recife-PE',
      telefone: '(99) 94002-8922',
      precoMedio: `R$ ${c.preco.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      precoFipe: this.comparacaoPreco() || 'R$ 0,00',
    };
  });

  imagens = computed(() => {
    const c = this.carro();
    if (!c) return ['assets/creta.jpeg'];

    const imagemPrincipal = this.getImagemPorModelo(c.modelo);
    return [imagemPrincipal, imagemPrincipal, imagemPrincipal, imagemPrincipal, imagemPrincipal];
  });

  constructor() {
    this.route.params.subscribe((params) => {
      const modelo = params['id'];
      if (modelo) {
        this.carregarCarro(modelo);
        this.compararPreco(modelo);
      }
    });
  }

  private carregarCarro(modelo: string) {
    this.loading.set(true);
    this.error.set(null);

    this.carroService
      .buscarCarro(modelo)
      .pipe(
        catchError((err) => {
          console.error('Erro ao carregar carro:', err);
          this.error.set('Erro ao carregar informações do carro.');
          this.loading.set(false);
          return of(null);
        })
      )
      .subscribe({
        next: (carro) => {
          if (carro) {
            this.carro.set(carro);
          } else {
            this.error.set('Carro não encontrado.');
          }
          this.loading.set(false);
        },
        error: (err: Error) => {
          this.error.set(err?.message || 'Erro ao carregar informações do carro.');
          this.loading.set(false);
        },
      });
  }

  private compararPreco(modelo: string) {
    this.carroService
      .compararPreco(modelo)
      .pipe(
        catchError((err: Error) => {
          console.error('Erro ao comparar preço:', err);
          return of('');
        })
      )
      .subscribe({
        next: (resultado) => {
          this.comparacaoPreco.set(resultado);
        },
        error: (err: Error) => {
          console.error('Erro ao comparar preço:', err);
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

  private getTagsPorCarro(carro: CarroModel): string[] {
    const tags: string[] = [];
    if (carro.quantidadeDePortas >= 4) tags.push('Espaçoso');
    if (carro.preco < 50000) tags.push('Custo-benefício');
    if (carro.preco > 80000) tags.push('Premium');
    return tags;
  }

  getTagClass(tag: string): string {
    const tagMap: Record<string, string> = {
      Espaçoso: 'tag-teal',
      Premium: 'tag-purple',
      'Custo-benefício': 'tag-blue',
    };
    return tagMap[tag] || 'tag-disabled';
  }
}
