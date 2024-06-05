import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ConnectionService } from "src/app/services/connection.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-log",
  templateUrl: "./log.component.html",
  styleUrls: ["./log.component.css"],
})
export class LogComponent implements OnInit {
  isLoggedIn!: boolean;

  connectionForm: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]),
  });

  constructor(
    private connectionService: ConnectionService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.connectionService.isUserLoggedIn$.subscribe(
      (loggedIn) => (this.isLoggedIn = loggedIn)
    );

    if (this.isLoggedIn == true) {
      this.router.navigate(["/accueil"]);
    }
  }

  submit() {
    if (this.connectionForm.invalid) {
      if (this.connectionForm.controls["email"].errors) {
        this.toastr.error("Adresse e-mail invalide", "Erreur");
      }

      return;
    }

    const value = this.connectionForm.value;
    this.connectionService.login(value).subscribe((res) => {
      if (res.success) {
        this.connectionService.setSessionData(res.sessionData);
        this.connectionService.isUserLoggedIn$.next(true);
        this.router.navigate([res.redirectUrl]);
        this.toastr.success("Connexion réussie!", "Succès");
      } else if (!res.success && res.message == "verification") {
        this.toastr.error("Veuillez d'abord vérifier votre adresse e-mail", "");
      } else if (!res.success && res.message == "invalid") {
        this.toastr.error("Email ou mot de passe incorrect", "");
      }
    });
  }
}
