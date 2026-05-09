import { Component } from '@angular/core';

import { CardComponent } from '../../components/ui/card/card.component';

@Component({
  selector: 'app-kitchen',
  imports: [CardComponent],
  templateUrl: './kitchen.component.html',
  styleUrl: './kitchen.component.scss',
})
export class KitchenComponent {
  readonly queue = [
    { order: '#1042', table: 'T01', station: 'Hot kitchen', status: 'Cooking', eta: '8 min' },
    { order: '#1045', table: 'T03', station: 'Tandoor', status: 'New', eta: '15 min' },
    { order: '#1044', table: 'T08', station: 'Pass', status: 'Ready', eta: 'Now' },
  ];
}
