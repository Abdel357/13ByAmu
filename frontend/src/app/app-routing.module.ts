import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { LogComponent } from "./components/log/log.component";
import { ReservationComponent } from "./components/reservation/reservation.component";
import { AccueilComponent } from "./components/accueil/accueil.component";
import { ContactComponent } from "./components/contact/contact.component";
import { SignupComponent } from "./components/signup/signup.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { ResetpasswordComponent } from "./components/resetpassword/resetpassword.component";
import { ChangepasswordComponent } from "./components/changepassword/changepassword.component";
import { AfterResetComponent } from "./components/after-reset/after-reset.component";
import { TerrainsComponent } from "./components/terrains/terrains.component";
import { MesreservationsComponent } from "./components/mesreservations/mesreservations.component";
import { PaymentComponent } from "./components/payment/payment.component";
import { TestComponent } from "./components/test/test.component";
import { EvaluationComponent } from "./components/evaluation/evaluation.component";
import { ForumComponent } from "./components/forum/forum.component";
import { PrivacyComponent } from "./components/privacy/privacy.component";

const routes: Routes = [
  { path: "", redirectTo: "accueil", pathMatch: "full" },
  { path: "accueil", component: AccueilComponent },
  { path: "accueil/:token", component: AccueilComponent },
  { path: "contact", component: ContactComponent },
  { path: "log", component: LogComponent },
  { path: "signup", component: SignupComponent },
  { path: "profile", component: ProfileComponent },
  { path: "resetPassword", component: ResetpasswordComponent },
  { path: "changePassword", component: ChangepasswordComponent },
  { path: "afterReset/:id", component: AfterResetComponent },
  { path: "terrains", component: TerrainsComponent },
  { path: "mesreservations", component: MesreservationsComponent },
  { path: "reservation/:id", component: ReservationComponent },
  {
    path: "payment/:idTerrain/:dateReservation/:startTime/:endTime",
    component: PaymentComponent,
  },
  { path: "test", component: TestComponent },
  { path: "evaluation/:idTerrain", component: EvaluationComponent },
  { path: "forum", component: ForumComponent },
  { path: "privacy", component: PrivacyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
