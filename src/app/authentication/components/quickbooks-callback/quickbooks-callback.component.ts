import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Pagina que recibe el redirect del backend despues del OAuth con QuickBooks.
 * Lee ?status=success|error|denied y ?mode=connect|signin desde el query string,
 * muestra resultado al usuario y lo redirige al lugar correcto.
 */
@Component({
  selector: 'app-quickbooks-callback',
  templateUrl: './quickbooks-callback.component.html',
  styleUrls: ['./quickbooks-callback.component.css'],
})
export class QuickbooksCallbackComponent implements OnInit {
  public status: 'success' | 'error' | 'denied' | 'loading' = 'loading';
  public mode: string = '';
  public countdown: number = 3;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.status = (params.get('status') as any) || 'error';
    this.mode = params.get('mode') || '';

    if (this.status === 'success') {
      this.startCountdownAndRedirect();
    }
  }

  private startCountdownAndRedirect(): void {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(interval);
        this.goToQuickbooksPage();
      }
    }, 1000);
  }

  goToQuickbooksPage(): void {
    // Si tiene sesion → va a la pagina de QB en configuracion
    // Si no tiene sesion (sign-in flow) → va al login (por ahora, hasta que B.3 emita JWT)
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/gestiones/configuration/quickbooks']);
    } else {
      this.router.navigate(['/authentication/login']);
    }
  }

  retry(): void {
    this.router.navigate(['/gestiones/configuration/quickbooks']);
  }
}
