import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ChangepasswordService } from "src/app/services/changepassword.service";
import { Router } from "@angular/router";
import { ConnectionService } from "src/app/services/connection.service";
import { ToastrService } from "ngx-toastr";
import { AbstractControl } from "@angular/forms";

@Component({
  selector: "app-changepassword",
  templateUrl: "./changepassword.component.html",
  styleUrls: ["./changepassword.component.css"],
})
export class ChangepasswordComponent implements OnInit {
  isLoggedIn!: boolean;

  changePassForm: FormGroup = new FormGroup({
    oldpassword: new FormControl("", Validators.required),
    newpassword: new FormControl("", [
      Validators.required,
      this.passwordValidator.bind(this),
    ]),
    confirmnewpass: new FormControl("", [
      Validators.required,
      this.matchPasswordValidator.bind(this),
    ]),
  });

  constructor(
    private changePassService: ChangepasswordService,
    private router: Router,
    private connectionService: ConnectionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.connectionService.isUserLoggedIn$.subscribe(
      (loggedIn) => (this.isLoggedIn = loggedIn)
    );

    if (this.isLoggedIn == false) {
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
    const password = control.root.get("newpassword");
    const confirmPassword = control.value;
    if (password && confirmPassword !== password.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  submit() {
    if (this.changePassForm.invalid) {
      if (this.changePassForm.controls["newpassword"].errors) {
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

      if (this.changePassForm.controls["confirmnewpass"].errors) {
        this.toastr.error("Les mots de passe ne correspondent pas", "Erreur");
        return;
      }
    }
    const value = this.changePassForm.value;
    console.log(value);
    this.changePassService.changePassword(value).subscribe((res) => {
      if (res.success) {
        this.router.navigate([res.redirectUrl]);
        this.toastr.success("Mot de passe changé avex succès!", "");
      } else if (!res.success) {
        this.toastr.error("Ancien mot de passe est faux!", "");
      }
    });
  }
}
