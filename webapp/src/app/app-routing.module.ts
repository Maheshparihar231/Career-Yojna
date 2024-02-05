import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './page/homepage/homepage.component';
import { AuthenticationComponent } from './page/authentication/authentication.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { SearchComponent } from './page/search/search.component';
import { ProfileComponent } from './page/profile/profile.component';

const routes: Routes = [
  {path:"",pathMatch:"full",redirectTo: "home" },
  { path: "home", component: HomepageComponent },
  {
    path: "auth", component: AuthenticationComponent, children: [
      { path: "", pathMatch: "full", redirectTo: "login" },
      { path: "login", component: LoginComponent },
      { path: "signup", component: SignupComponent },
    ]
  },
  { path: "search", component: SearchComponent },
  { path: "profile", component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
