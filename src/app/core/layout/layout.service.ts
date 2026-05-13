import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly drawerOpenSignal = signal(true);

  readonly drawerOpen = this.drawerOpenSignal.asReadonly();

  toggleDrawer(): void {
    this.drawerOpenSignal.update((isOpen) => !isOpen);
  }

  openDrawer(): void {
    this.drawerOpenSignal.set(true);
  }

  closeDrawer(): void {
    this.drawerOpenSignal.set(false);
  }
}
