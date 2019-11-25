import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ng6-toastr-notifications';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RouterModule } from '@angular/router';
import { ChartComponent } from './chart/chart.component';
import { SearchComponent } from './search/search.component';
import { ChartService } from './chart.service';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ChartsModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    RouterModule.forRoot([
     {path: 'chart', component: ChartComponent},
     {path: '', component: SearchComponent},
     {path: 'search', component: SearchComponent}
    ])
  ],
  providers: [ChartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
