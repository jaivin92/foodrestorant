import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { ButtonComponent } from "src/app/components/ui/button/button.component";
import { CardComponent } from "src/app/components/ui/card/card.component";
import { FoodApiService } from "src/app/core/api";
import { DataTableRequest, FoodModel } from "src/app/models";

@Component({
    selector: 'app-menu',
    imports: [ButtonComponent, CardComponent],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
    public changeDetectorRef = inject(ChangeDetectorRef);
    public foodService = inject(FoodApiService);
    foodmodel : FoodModel[]=[]
    datatable: DataTableRequest = new DataTableRequest()
    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.datatable.filterObj = { IsActive: true };
        this.foodService.getAll(this.datatable).subscribe(result =>{
            if(result.Status){
                this.foodmodel = result.Data.Data
                this.changeDetectorRef.detectChanges();
            }
        })
    }
}