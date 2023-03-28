import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { DonationComponent } from './donation/donation.component';
import { StartComponent } from './start/start.component';


@NgModule({
  declarations: [
    HeaderComponent,
    StartComponent,
    DonationComponent,
  ],
  exports: [
    HeaderComponent,
    StartComponent,
    DonationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatDialogModule,
  ]
})
export class SharedModule { }
