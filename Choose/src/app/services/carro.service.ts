import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Carro } from '../models/carro.model';

@Injectable({
  providedIn: 'root',
})
export class CarroService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/carros';

  cadastrarCarro(carro: Carro): Observable<string> {
    return this.http
      .post<string>(`${this.apiUrl}/cadastrar`, carro, {
        responseType: 'text' as 'json',
      })
      .pipe(catchError(this.handleError));
  }

  listarCarros(): Observable<Carro[]> {
    return this.http.get<Carro[]>(`${this.apiUrl}/listar`).pipe(catchError(this.handleError));
  }

  buscarCarro(modelo: string): Observable<Carro | null> {
    return this.http.get<Carro>(`${this.apiUrl}/buscar/${encodeURIComponent(modelo)}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404 || error.status === 0 || !error.status) {
          return throwError(() => new Error('Carro não encontrado'));
        }
        return this.handleError(error);
      })
    );
  }

  compararPreco(modelo: string): Observable<string> {
    return this.http
      .get<string>(`${this.apiUrl}/comparar/${encodeURIComponent(modelo)}`, {
        responseType: 'text' as 'json',
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse | Error): Observable<never> {
    let errorMessage = 'Erro desconhecido';

    if (error instanceof HttpErrorResponse) {
      // Erro HTTP
      if (error.status === 0 || !error.status) {
        errorMessage =
          'Não foi possível conectar ao servidor. Verifique se o servidor está rodando.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso não encontrado';
      } else if (error.status >= 500) {
        errorMessage = `Erro no servidor: ${error.status}`;
      } else {
        errorMessage = `Erro ${error.status}: ${error.message || 'Erro na requisição'}`;
      }
    } else if (error instanceof Error) {
      // Erro genérico
      errorMessage = error.message;
    }

    console.error('Erro na requisição:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
