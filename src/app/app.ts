import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DrawerComponent } from './components/drawer/drawer.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './core/auth/auth.service';
import { LayoutService } from './core/layout/layout.service';

@Component({
  selector: 'app-root',
  imports: [DrawerComponent, FooterComponent, HeaderComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly auth = inject(AuthService);
  readonly layout = inject(LayoutService);
}
