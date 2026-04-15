import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  sidebarCaption: boolean;
  layoutDirection: 'ltr' | 'rtl';
}

const THEME_COLORS = {
  indigo: { primary: '#4f46e5', primaryLight: '#eef2ff', primaryHover: '#4338ca' },
  blue: { primary: '#2563eb', primaryLight: '#eff6ff', primaryHover: '#1d4ed8' },
  pink: { primary: '#ec4899', primaryLight: '#fdf2f8', primaryHover: '#db2777' },
  red: { primary: '#ef4444', primaryLight: '#fef2f2', primaryHover: '#dc2626' },
  orange: { primary: '#f97316', primaryLight: '#fff7ed', primaryHover: '#ea580c' },
  green: { primary: '#10b981', primaryLight: '#ecfdf5', primaryHover: '#059669' },
  teal: { primary: '#14b8a6', primaryLight: '#f0fdfa', primaryHover: '#0d9488' },
  cyan: { primary: '#06b6d4', primaryLight: '#ecfeff', primaryHover: '#0891b2' },
};

const DEFAULT_THEME: ThemeConfig = {
  mode: 'light',
  primaryColor: 'indigo',
  sidebarCaption: true,
  layoutDirection: 'ltr',
};

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private theme$ = new BehaviorSubject<ThemeConfig>(DEFAULT_THEME);
  private url = environment.endpoint;

  static COLORS = THEME_COLORS;

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  get config$() {
    return this.theme$.asObservable();
  }

  get currentConfig(): ThemeConfig {
    return this.theme$.value;
  }

  /**
   * Carga tema del localStorage
   */
  private loadFromStorage() {
    const stored = localStorage.getItem('themePreferences');
    if (stored) {
      try {
        const config = JSON.parse(stored);
        this.applyTheme({ ...DEFAULT_THEME, ...config });
      } catch { }
    }
  }

  /**
   * Inicializa el tema desde el login (datos del usuario)
   */
  initFromLogin(themePreferences: string) {
    if (themePreferences) {
      try {
        const config = JSON.parse(themePreferences);
        this.applyTheme({ ...DEFAULT_THEME, ...config });
        localStorage.setItem('themePreferences', themePreferences);
      } catch { }
    } else {
      this.applyTheme(DEFAULT_THEME);
    }
  }

  /**
   * Aplica un cambio de tema
   */
  setTheme(partial: Partial<ThemeConfig>) {
    const newConfig = { ...this.theme$.value, ...partial };
    this.applyTheme(newConfig);
    const json = JSON.stringify(newConfig);
    localStorage.setItem('themePreferences', json);
    // Guardar en backend
    this.http.patch(`${this.url}/users/theme`, { themePreferences: json }).subscribe();
  }

  /**
   * Aplica las variables CSS al documento
   */
  private applyTheme(config: ThemeConfig) {
    this.theme$.next(config);
    const root = document.documentElement;

    // Mode
    if (config.mode === 'dark') {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
    } else {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
    }

    // Primary color
    const colors = THEME_COLORS[config.primaryColor] || THEME_COLORS.indigo;
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-light', colors.primaryLight);
    root.style.setProperty('--primary-hover', colors.primaryHover);

    // Direction
    root.dir = config.layoutDirection;
  }

  /**
   * Reset al tema por defecto
   */
  resetTheme() {
    this.setTheme(DEFAULT_THEME);
  }
}
