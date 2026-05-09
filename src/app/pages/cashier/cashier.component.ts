import { Component } from '@angular/core';

import { ButtonComponent } from '../../components/ui/button/button.component';
import { CardComponent } from '../../components/ui/card/card.component';

@Component({
  selector: 'app-cashier',
  imports: [ButtonComponent, CardComponent],
  templateUrl: './cashier.component.html',
  styleUrl: './cashier.component.scss',
})
export class CashierComponent {
  readonly bills = [
    { table: 'T01', order: '#1042', amount: '$84.50', status: 'Open bill' },
    { table: 'T06', order: '#1039', amount: '$42.00', status: 'Payment pending' },
    { table: 'T08', order: '#1044', amount: '$67.25', status: 'Ready to settle' },
  ];
}
