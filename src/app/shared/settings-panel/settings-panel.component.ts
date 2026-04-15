import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeConfig, ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.css']
})
export class SettingsPanelComponent implements OnInit, OnDestroy {

  isOpen = false;
  config: ThemeConfig;
  drawerPosition: 'pos-right' | 'pos-left' = 'pos-right';
  private sub: Subscription;

  colorOptions = [
    { key: 'indigo', color: '#4f46e5' },
    { key: 'blue', color: '#2563eb' },
    { key: 'pink', color: '#ec4899' },
    { key: 'red', color: '#ef4444' },
    { key: 'orange', color: '#f97316' },
    { key: 'green', color: '#10b981' },
    { key: 'teal', color: '#14b8a6' },
    { key: 'cyan', color: '#06b6d4' },
  ];

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.sub = this.themeService.config$.subscribe(c => {
      this.config = c;
      this.drawerPosition = c.layoutDirection === 'rtl' ? 'pos-left' : 'pos-right';
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  setMode(mode: 'light' | 'dark') {
    this.themeService.setTheme({ mode });
  }

  setColor(key: string) {
    this.themeService.setTheme({ primaryColor: key });
  }

  toggleCaption() {
    this.themeService.setTheme({ sidebarCaption: !this.config.sidebarCaption });
  }

  setDirection(dir: 'ltr' | 'rtl') {
    this.themeService.setTheme({ layoutDirection: dir });
  }

  resetLayout() {
    this.themeService.resetTheme();
  }
}
