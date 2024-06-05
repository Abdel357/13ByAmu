import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { CookieService } from "ngx-cookie-service";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ReservationComponent } from "./components/reservation/reservation.component";
import { AccueilComponent } from "./components/accueil/accueil.component";
import { ContactComponent } from "./components/contact/contact.component";

import { LogComponent } from "./components/log/log.component";
import { SignupComponent } from "./components/signup/signup.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { ResetpasswordComponent } from "./components/resetpassword/resetpassword.component";
import { ChangepasswordComponent } from "./components/changepassword/changepassword.component";
import { AfterResetComponent } from "./components/after-reset/after-reset.component";
import { TerrainsComponent } from "./components/terrains/terrains.component";
import { MesreservationsComponent } from "./components/mesreservations/mesreservations.component";
import { PaymentComponent } from "./components/payment/payment.component";
import { TestComponent } from "./components/test/test.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { EvaluationComponent } from "./components/evaluation/evaluation.component";
import { PublicationComponent } from './components/publication/publication.component';
import { ForumComponent } from './components/forum/forum.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './components/footer/footer.component';
import { PrivacyComponent } from './components/privacy/privacy.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ReservationComponent,
    AccueilComponent,
    ContactComponent,
    LogComponent,
    SignupComponent,
    ProfileComponent,
    ResetpasswordComponent,
    ChangepasswordComponent,
    AfterResetComponent,
    TerrainsComponent,
    MesreservationsComponent,
    PaymentComponent,
    TestComponent,
    SidebarComponent,
    EvaluationComponent,
    PublicationComponent,
    ForumComponent,
    FooterComponent,
    PrivacyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: "toast-bottom-right",
    }),
    NgbModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
