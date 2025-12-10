import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { AnuncioService } from '../../services/anuncio.service';
import { CarroService } from '../../services/carro.service';
import { Carro } from '../../models/carro.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-anuncio-passo4',
  imports: [Header, Footer, ReactiveFormsModule],
  templateUrl: './anuncio-passo4.html',
  styleUrl: './anuncio-passo4.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnuncioPasso4 {
  private router = inject(Router);
  private anuncioService = inject(AnuncioService);
  private carroService = inject(CarroService);

  valor = new FormControl('', [Validators.required]);
  precoFipe = signal('R$ 999.999');
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    const dados = this.anuncioService.getDadosAnuncio();
    const modelo = dados().modelo;

    if (modelo) {
      this.carroService
        .compararPreco(modelo)
        .pipe(catchError(() => of('')))
        .subscribe({
          next: (resultado) => {
            if (resultado) {
              // Extrair preço FIPE do resultado
              const match = resultado.match(/Preço desse carro na tabela FIPE: ([\d.]+)/);
              if (match) {
                const preco = parseFloat(match[1]);
                this.precoFipe.set(
                  `R$ ${preco.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                );
              }
            }
          },
        });
    }
  }

  onVoltar() {
    this.router.navigate(['/anuncio/passo-3']);
  }

  onFinalizar() {
    if (this.valor.valid) {
      this.loading.set(true);
      this.error.set(null);

      const dados = this.anuncioService.getDadosAnuncio();
      const valorPreco = parseFloat(
        this.valor.value?.replace(/[^\d,]/g, '').replace(',', '.') || '0'
      );

      const carro: Carro = {
        modelo: dados().modelo || '',
        marca: dados().marca || '',
        versao: dados().versao || '',
        cor: dados().cor || '',
        quilometragem: dados().quilometragem || 0,
        ano: dados().ano || 0,
        preco: valorPreco,
        cambio: dados().cambio || '',
        quantidadeDePortas: dados().quantidadeDePortas || 0,
        potenciaMotor: dados().potenciaMotor || '',
      };

      this.carroService
        .cadastrarCarro(carro)
        .pipe(
          catchError((err) => {
            console.error('Erro ao cadastrar carro:', err);
            this.error.set('Erro ao cadastrar anúncio. Tente novamente.');
            this.loading.set(false);
            return of('');
          })
        )
        .subscribe({
          next: (resultado) => {
            if (resultado) {
              this.anuncioService.limparDados();
              this.router.navigate(['/']);
            }
            this.loading.set(false);
          },
          error: () => {
            this.loading.set(false);
          },
        });
    }
  }
}
