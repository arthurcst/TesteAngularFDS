import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carro, ComparacaoPreco } from '../models/carro.model';

@Injectable({
  providedIn: 'root',
})
export class CarroService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/carros';

  cadastrarCarro(carro: Carro): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/cadastrar`, carro, {
      responseType: 'text' as 'json',
    });
  }

  listarCarros(): Observable<Carro[]> {
    return this.http.get<Carro[]>(`${this.apiUrl}/listar`);
  }

  buscarCarro(modelo: string): Observable<Carro> {
    return this.http.get<Carro>(`${this.apiUrl}/buscar/${encodeURIComponent(modelo)}`);
  }

  compararPreco(modelo: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/comparar/${encodeURIComponent(modelo)}`, {
      responseType: 'text' as 'json',
    });
  }
}
