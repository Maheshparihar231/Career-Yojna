import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './page/homepage/homepage.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { FooterComponent } from './components/footer/footer.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { SponsorsComponent } from './components/sponsors/sponsors.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthenticationComponent } from './page/authentication/authentication.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SearchComponent } from './page/search/search.component';
import { ProfileComponent } from './page/profile/profile.component';
import { ProfiledataComponent } from './components/profiledata/profiledata.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { ProfileupdateComponent } from './components/pop-up/profileupdate/profileupdate.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { WorkupdateComponent } from './components/pop-up/workupdate/workupdate.component';
import { DataComponent } from './page/data/data.component';
import {AngularFireModule} from '@angular/fire/compat'
import { environment } from './environment/environment';
import { UploadBannerComponent } from './components/pop-up/upload-banner/upload-banner.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AsyncPipe} from '@angular/common';
import {map, startWith} from 'rxjs/operators';
import {MatExpansionModule} from '@angular/material/expansion';
import { UploadJobComponent } from './components/upload-job/upload-job.component';
import { JobsTableComponent } from './components/jobs-table/jobs-table.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    NavbarComponent,
    FooterComponent,
    ReviewsComponent,
    SponsorsComponent,
    LoginComponent,
    SignupComponent,
    AuthenticationComponent,
    SearchComponent,
    ProfileComponent,
    ProfiledataComponent,
    ProfileupdateComponent,
    WorkupdateComponent,
    DataComponent,
    UploadBannerComponent,
    UploadJobComponent,
    JobsTableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
    FormsModule,
    AsyncPipe,
    ReactiveFormsModule,
    MatDividerModule,
    MatGridListModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
