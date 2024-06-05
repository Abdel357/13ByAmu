import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AfterResetService } from "src/app/services/after-reset.service";
import { Router } from "@angular/router";
import { AfterResetModel } from "../../models/afterreset.model";
import { ConnectionService } from "src/app/services/connection.service";
import { ToastrService } from "ngx-toastr";
import { AbstractControl } from "@angular/forms";

@Component({
  selector: "app-after-reset",
  templateUrl: "./after-reset.component.html",
  styleUrls: ["./after-reset.component.css"],
})
export class AfterResetComponent {
  isLoggedIn!: boolean;

  afterResetForm: FormGroup = new FormGroup({
    newPassword: new FormControl("", [
      Validators.required,
      this.passwordValidator.bind(this),
    ]),
    newPasswordConfirm: new FormControl("", [
      Validators.required,
      this.matchPasswordValidator.bind(this),
    ]),
  });

  constructor(
    private afterResetService: AfterResetService,
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

  passwordValidator(control: FormControl): { [key: string]: boolean } | null {
    const password = control.value;
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=-_*]).{10,}$/;

    if (!passwordRegex.test(password)) {
      return { passwordInvalid: true };
    }

    return null;
  }

  matchPasswordValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.root.get("newPassword");
    const confirmPassword = control.value;
    if (password && confirmPassword !== password.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  submit() {
    if (this.afterResetForm.invalid) {
      if (this.afterResetForm.controls["newPassword"].errors) {
        this.toastr.warning(
          "Le mot de passe doit répondre aux exigences suivantes :<br>" +
            "1 - Au moins 10 caractères<br>" +
            "2 - Au moins 1 lettre majuscule<br>" +
            "3 - Au moins 1 lettre minuscule<br>" +
            "4 - Au moins 1 caractère spécial<br>" +
            "5 - Au moins 1 chiffre",
          "",
          { enableHtml: true }
        );
        return;
      }

      if (this.afterResetForm.controls["newPasswordConfirm"].errors) {
        this.toastr.warning("Les mots de passe ne correspondent pas", "Erreur");
        return;
      }
    }

    const id = window.location.pathname.split("/")[2];
    const { newPassword, newPasswordConfirm } = this.afterResetForm.value;

    const afterResetModel: AfterResetModel = {
      idUser: id,
      newPass: newPassword,
      newPassConfirm: newPasswordConfirm,
    };

    this.afterResetService.reset(afterResetModel).subscribe((res) => {
      if (res.success) {
        this.router.navigate([res.redirectUrl]);
        this.toastr.success("Votre mot de passe a été changé", "");
      }
    });
  }
}
