import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/usuarios';

  cadastrarUsuario(usuario: Usuario): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/cadastrar`, usuario, {
      responseType: 'text' as 'json',
    });
  }

  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/listar`);
  }

  deletarUsuario(nick: string, usuario: Usuario): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/deletar/${encodeURIComponent(nick)}`, {
      body: usuario,
      responseType: 'text' as 'json',
    });
  }

  editarUsuario(nick: string, usuario: Usuario): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/editar/${encodeURIComponent(nick)}`, usuario, {
      responseType: 'text' as 'json',
    });
  }
}
