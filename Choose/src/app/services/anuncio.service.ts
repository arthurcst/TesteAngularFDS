import { Injectable, signal } from '@angular/core';
import { Carro } from '../models/carro.model';

@Injectable({
  providedIn: 'root',
})
export class AnuncioService {
  private dadosAnuncio = signal<Partial<Carro>>({});

  setDadosPasso1(dados: Partial<Carro>) {
    this.dadosAnuncio.update((atual) => ({ ...atual, ...dados }));
  }

  setDadosPasso2(dados: Partial<Carro>) {
    this.dadosAnuncio.update((atual) => ({ ...atual, ...dados }));
  }

  setDadosPasso3(dados: Partial<Carro>) {
    this.dadosAnuncio.update((atual) => ({ ...atual, ...dados }));
  }

  setDadosPasso4(dados: Partial<Carro>) {
    this.dadosAnuncio.update((atual) => ({ ...atual, ...dados }));
  }

  getDadosAnuncio() {
    return this.dadosAnuncio.asReadonly();
  }

  limparDados() {
    this.dadosAnuncio.set({});
  }
}
