import { Component } from '@angular/core';

import { ButtonComponent } from '../../components/ui/button/button.component';
import { CardComponent } from '../../components/ui/card/card.component';

@Component({
  selector: 'app-order-desk',
  imports: [ButtonComponent, CardComponent],
  templateUrl: './order-desk.component.html',
  styleUrl: './order-desk.component.scss',
})
export class OrderDeskComponent {
  readonly tableOrders = [
    { table: 'T01', order: '#1042', items: ['Paneer tikka', 'Butter naan', 'Sweet lime'], status: 'Preparing' },
    { table: 'T05', order: '#1043', items: ['Garden plate', 'Masala tea'], status: 'Pending' },
    { table: 'T08', order: '#1044', items: ['Biryani', 'Raita', 'Lassi'], status: 'Ready' },
  ];
}
