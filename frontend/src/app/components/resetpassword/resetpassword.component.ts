import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ResetpasswordService } from "src/app/services/resetpassword.service";
import { Router } from "@angular/router";
import { ConnectionService } from "src/app/services/connection.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-resetpassword",
  templateUrl: "./resetpassword.component.html",
  styleUrls: ["./resetpassword.component.css"],
})
export class ResetpasswordComponent {
  isLoggedIn!: boolean;

  resetPassForm: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
  });

  constructor(
    private resetPasswordService: ResetpasswordService,
    private router: Router,
    private connectionService: ConnectionService,
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
    if (this.resetPassForm.invalid) {
      if (this.resetPassForm.controls["email"].errors) {
        this.toastr.error("Adresse e-mail invalide", "Erreur");
      }

      return;
    }

    const value = this.resetPassForm.value;
    this.resetPasswordService.reset(value).subscribe((res) => {
      if (res.success) {
        this.router.navigate([res.redirectUrl]);
        this.toastr.success("Un mail a été envoyé à votre adresse", "");
      } else if (!res.success) {
        this.router.navigate([res.redirectUrl]);
        this.toastr.error(res.message, "");
      }
    });
  }
}
