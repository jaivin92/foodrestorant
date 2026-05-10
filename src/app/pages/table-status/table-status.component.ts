import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../components/ui/card/card.component';
import { FoodTableApiService } from 'src/app/core/api';
import { DataTableRequest, FoodTableModel, FoodTableTypeEnum } from 'src/app/models/bms.models';

@Component({
  selector: 'app-table-status',
  imports: [CommonModule, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table-status.component.html',
  styleUrl: './table-status.component.scss',
})
export class TableStatusComponent implements OnInit {
  public changeDetectorRef = inject(ChangeDetectorRef);
  private readonly foodTableService = inject(FoodTableApiService)
  tableSummary: any[] = []
  // [
  //   { status: 'Available', count: 8, detail: 'Ready to seat walk-in guests' },
  //   { status: 'Booked', count: 6, detail: 'Confirmed reservations for upcoming slots' },
  //   { status: 'Pending', count: 3, detail: 'Awaiting customer or staff confirmation' },
  //   { status: 'Occupied', count: 11, detail: 'Guests currently dining' },
  //   { status: 'Cleaning', count: 2, detail: 'Reset in progress before next seating' },
  // ];

  // readonly tables = [
  //   { name: 'T01', guests: 4, status: 'Occupied', server: 'Asha', time: '7:15 PM' },
  //   { name: 'T02', guests: 2, status: 'Pending', server: 'Ravi', time: '7:45 PM' },
  //   { name: 'T03', guests: 6, status: 'Booked', server: 'Mina', time: '8:00 PM' },
  //   { name: 'T04', guests: 4, status: 'Available', server: 'Open', time: 'Now' },
  // ];
  statusDetails: Record<string, string> = {
    Available: 'Ready to seat walk-in guests',
    Reserved: 'Confirmed reservations for upcoming slots',
    Occupied: 'Guests currently dining',
    Cleaning: 'Reset in progress before next seating',
  };
  datatable: DataTableRequest = new DataTableRequest()
  foodTable: FoodTableModel[] = [];
  constructor() {

  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.datatable.filterObj = { IsActive: true };
    this.foodTableService.getAll(this.datatable).subscribe(result => {
      if (result.Status) {
        this.foodTable = result.Data.Data
        this.tableSummary.push(
          { status: 'Available', 
            count: this.foodTable.filter(x => x.TableStatus === FoodTableTypeEnum.Available).length, 
            detail: 'Ready to seat walk-in guests' 
          },
          { status: 'Booked', 
            count: this.foodTable.filter(x => x.TableStatus === FoodTableTypeEnum.Reserved).length, 
            detail: 'Confirmed reservations for upcoming slots'
          },
          { status: 'Pending', 
            count: this.foodTable.filter(x => x.TableStatus === FoodTableTypeEnum.Cleaning).length,  
            detail: 'Awaiting customer or staff confirmation' 
          },
          { status: 'Occupied', 
            count: this.foodTable.filter(x => x.TableStatus === FoodTableTypeEnum.Occupied).length, 
            detail: 'Guests currently dining' 
          },
        )
        this.changeDetectorRef.detectChanges();
      }
    })
  }
}

