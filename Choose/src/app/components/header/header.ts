import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isLoggedIn = false; // TODO: implementar autenticação

  constructor(private router: Router) {}

  onSearch(query: string) {
    if (query.trim()) {
      this.router.navigate(['/busca'], { queryParams: { q: query } });
    }
  }
}
