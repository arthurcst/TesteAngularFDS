import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnuncioService } from '../../services/anuncio.service';

@Component({
  selector: 'app-anuncio-passo1',
  imports: [Header, Footer, ReactiveFormsModule],
  templateUrl: './anuncio-passo1.html',
  styleUrl: './anuncio-passo1.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnuncioPasso1 {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private anuncioService = inject(AnuncioService);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      tipoVeiculo: ['', Validators.required],
      modelo: ['', Validators.required],
      ano: ['', Validators.required],
      versao: ['', Validators.required],
      cambio: [''],
      potencia: [''],
      portas: [''],
      tipoVeiculoDetalhe: [''],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;

      // Salvar dados no serviço de anúncio
      this.anuncioService.setDadosPasso1({
        modelo: formValue.modelo,
        ano: parseInt(formValue.ano, 10),
        versao: formValue.versao,
        cambio: formValue.cambio,
        potenciaMotor: formValue.potencia,
        quantidadeDePortas: formValue.portas ? parseInt(formValue.portas, 10) : undefined,
        marca: formValue.tipoVeiculo,
      });

      this.router.navigate(['/anuncio/passo-2']);
    }
  }
}
