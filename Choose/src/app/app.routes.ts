import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'busca',
    loadComponent: () => import('./pages/busca/busca').then((m) => m.Busca),
  },
  {
    path: 'carro/:id',
    loadComponent: () => import('./pages/carro/carro').then((m) => m.CarroComponent),
  },
  {
    path: 'anuncio/passo-1',
    loadComponent: () => import('./pages/anuncio/anuncio-passo1').then((m) => m.AnuncioPasso1),
  },
  {
    path: 'anuncio/passo-2',
    loadComponent: () => import('./pages/anuncio/anuncio-passo2').then((m) => m.AnuncioPasso2),
  },
  {
    path: 'anuncio/passo-3',
    loadComponent: () => import('./pages/anuncio/anuncio-passo3').then((m) => m.AnuncioPasso3),
  },
  {
    path: 'anuncio/passo-4',
    loadComponent: () => import('./pages/anuncio/anuncio-passo4').then((m) => m.AnuncioPasso4),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
