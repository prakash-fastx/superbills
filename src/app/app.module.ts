import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  IgxIconModule,
  IgxInputGroupModule,
  IgxTimePickerModule,
} from 'igniteui-angular';
import { InvoiceComponent } from './invoice/invoice.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // RouterModule.forRoot([{ path: 'bill', component: BillComponent }]),
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatSelectModule,
    IgxTimePickerModule,
    IgxInputGroupModule,
    IgxIconModule,
    MatAutocompleteModule,
  ],
  declarations: [AppComponent, InvoiceComponent],
  bootstrap: [AppComponent],
  providers: [],
})
export class AppModule {}
// platformBrowserDynamic()
//   .bootstrapModule(AppModule)
//   .catch((err) => console.error(err));
