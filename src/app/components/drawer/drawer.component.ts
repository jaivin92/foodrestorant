import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { NavigationService } from '../../core/navigation/navigation.service';

@Component({
  selector: 'app-drawer',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
})
export class DrawerComponent {
  readonly auth = inject(AuthService);
  readonly navigation = inject(NavigationService);
}
