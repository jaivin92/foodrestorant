import { Component } from '@angular/core';

import { CardComponent } from '../../components/ui/card/card.component';

@Component({
  selector: 'app-table-status',
  imports: [CardComponent],
  templateUrl: './table-status.component.html',
  styleUrl: './table-status.component.scss',
})
export class TableStatusComponent {
  readonly tableSummary = [
    { status: 'Available', count: 8, detail: 'Ready to seat walk-in guests' },
    { status: 'Booked', count: 6, detail: 'Confirmed reservations for upcoming slots' },
    { status: 'Pending', count: 3, detail: 'Awaiting customer or staff confirmation' },
    { status: 'Occupied', count: 11, detail: 'Guests currently dining' },
    { status: 'Cleaning', count: 2, detail: 'Reset in progress before next seating' },
  ];

  readonly tables = [
    { name: 'T01', guests: 4, status: 'Occupied', server: 'Asha', time: '7:15 PM' },
    { name: 'T02', guests: 2, status: 'Pending', server: 'Ravi', time: '7:45 PM' },
    { name: 'T03', guests: 6, status: 'Booked', server: 'Mina', time: '8:00 PM' },
    { name: 'T04', guests: 4, status: 'Available', server: 'Open', time: 'Now' },
  ];
}
