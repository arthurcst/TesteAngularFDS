import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AnuncioService } from '../../services/anuncio.service';

@Component({
  selector: 'app-anuncio-passo3',
  imports: [Header, Footer, ReactiveFormsModule],
  templateUrl: './anuncio-passo3.html',
  styleUrl: './anuncio-passo3.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnuncioPasso3 {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private anuncioService = inject(AnuncioService);

  form: FormGroup;
  tagsSelecionadas: string[] = [];

  tagsDisponiveis = ['Airbag', 'Alarme', 'Som'];

  constructor() {
    this.form = this.fb.group({
      quilometragem: [''],
      cor: [''],
      informacoesAdicionais: [''],
      descricao: [''],
    });
  }

  toggleTag(tag: string) {
    const index = this.tagsSelecionadas.indexOf(tag);
    if (index > -1) {
      this.tagsSelecionadas.splice(index, 1);
    } else {
      this.tagsSelecionadas.push(tag);
    }
  }

  isTagSelecionada(tag: string): boolean {
    return this.tagsSelecionadas.includes(tag);
  }

  onVoltar() {
    this.router.navigate(['/anuncio/passo-2']);
  }

  onContinuar() {
    const formValue = this.form.value;

    // Converter quilometragem de string para número
    const quilometragem = formValue.quilometragem
      ? parseInt(formValue.quilometragem.replace(/[^\d]/g, ''), 10)
      : undefined;

    // Salvar dados no serviço de anúncio
    this.anuncioService.setDadosPasso3({
      quilometragem,
      cor: formValue.cor,
    });

    this.router.navigate(['/anuncio/passo-4']);
  }
}
