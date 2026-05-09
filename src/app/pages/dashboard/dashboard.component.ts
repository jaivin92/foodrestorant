import { Component, inject } from '@angular/core';

import { CardComponent } from '../../components/ui/card/card.component';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  readonly auth = inject(AuthService);

  readonly reservations = [
    { time: '6:30 PM', table: 'Window table', status: 'Confirmed' },
    { time: '8:00 PM', table: 'Patio lounge', status: 'Pending' },
  ];
}
