import { Routes } from '@angular/router';
import { ListComponent } from './list.component';
import { DetailComponent } from './detail.component';

export const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'badi/:badidText', component: DetailComponent },
];
