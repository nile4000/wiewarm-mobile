import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { DialogDirective } from 'src/app/shared/layout/dialog/dialog.directive';
import { BadItem } from 'src/app/shared/interfaces/bad-item.interface';
import { Signal } from '@angular/core';

@Component({
  selector: 'app-sort-dialog',
  templateUrl: './sort-dialog.html',
  styleUrl: './sort-dialog.scss',
  imports: [CommonModule, DialogDirective],
})
export class SortDialogComponent {
  @ViewChild('dialog') private dialog?: ElementRef<HTMLDialogElement>;

  @Input({ required: true }) sortField!: Signal<keyof BadItem>;
  @Input({ required: true }) setSort!: (field: keyof BadItem) => void;

  open() {
    this.dialog?.nativeElement.showModal();
  }

  close() {
    this.dialog?.nativeElement.close();
  }
}
