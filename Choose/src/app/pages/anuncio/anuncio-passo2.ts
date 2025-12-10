import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { AnuncioService } from '../../services/anuncio.service';

@Component({
  selector: 'app-anuncio-passo2',
  imports: [Header, Footer, ReactiveFormsModule],
  templateUrl: './anuncio-passo2.html',
  styleUrl: './anuncio-passo2.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnuncioPasso2 {
  private router = inject(Router);
  private anuncioService = inject(AnuncioService);

  placa = new FormControl('');

  constructor() {}

  onVoltar() {
    this.router.navigate(['/anuncio/passo-1']);
  }

  onContinuar() {
    // Salvar placa se fornecida (mesmo que não seja usado no modelo Carro atual)
    if (this.placa.value) {
      // TODO: Implementar campo de placa no modelo se necessário
    }

    this.router.navigate(['/anuncio/passo-3']);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // TODO: Implementar upload de imagens quando o backend suportar
      console.log('Arquivos selecionados:', input.files);
    }
  }
}
