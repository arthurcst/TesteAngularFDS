import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/usuarios';

  cadastrarUsuario(usuario: Usuario): Observable<string> {
    return this.http
      .post<string>(`${this.apiUrl}/cadastrar`, usuario, {
        responseType: 'text' as 'json',
      })
      .pipe(catchError(this.handleError));
  }

  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/listar`).pipe(catchError(this.handleError));
  }

  deletarUsuario(nick: string, usuario: Usuario): Observable<string> {
    return this.http
      .delete<string>(`${this.apiUrl}/deletar/${encodeURIComponent(nick)}`, {
        body: usuario,
        responseType: 'text' as 'json',
      })
      .pipe(catchError(this.handleError));
  }

  editarUsuario(nick: string, usuario: Usuario): Observable<string> {
    return this.http
      .put<string>(`${this.apiUrl}/editar/${encodeURIComponent(nick)}`, usuario, {
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
