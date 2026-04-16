import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'es' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private currentLang$ = new BehaviorSubject<Lang>(this.getSavedLang());

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('es');
    this.translate.use(this.getSavedLang());
  }

  get lang$() {
    return this.currentLang$.asObservable();
  }

  get currentLang(): Lang {
    return this.currentLang$.value;
  }

  switchLang(lang: Lang): void {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    this.currentLang$.next(lang);
  }

  private getSavedLang(): Lang {
    const saved = localStorage.getItem('lang') as Lang;
    return saved === 'en' ? 'en' : 'es';
  }
}
