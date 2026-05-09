import { Component } from '@angular/core';

import { CardComponent } from '../../components/ui/card/card.component';

@Component({
  selector: 'app-admin',
  imports: [CardComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  readonly metrics = [
    { label: 'Reservations', value: '42', detail: 'Today across dinner services' },
    { label: 'Open orders', value: '17', detail: 'Kitchen and pickup queue' },
    { label: 'Staff on shift', value: '9', detail: 'Front and back of house' },
  ];
}
