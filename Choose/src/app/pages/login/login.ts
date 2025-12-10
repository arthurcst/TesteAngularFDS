import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [Header, Footer, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.error.set(null);

      // Como não há endpoint de login específico, vamos verificar se o usuário existe
      // listando todos e verificando email/senha
      this.usuarioService
        .listarUsuarios()
        .pipe(
          catchError((err) => {
            console.error('Erro ao fazer login:', err);
            this.error.set('Erro ao conectar com o servidor.');
            this.loading.set(false);
            return of([]);
          })
        )
        .subscribe({
          next: (usuarios) => {
            const { email, senha } = this.loginForm.value;
            const usuario = usuarios.find((u) => u.email === email && u.senha === senha);

            if (usuario) {
              // TODO: Implementar serviço de autenticação com tokens
              localStorage.setItem('usuario', JSON.stringify(usuario));
              this.router.navigate(['/']);
            } else {
              this.error.set('Email ou senha incorretos.');
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
