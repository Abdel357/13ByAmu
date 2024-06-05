import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SignupService } from "src/app/services/signup.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AbstractControl } from "@angular/forms";
import { ConnectionService } from "src/app/services/connection.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  isLoggedIn!: boolean;

  signupForm: FormGroup = new FormGroup({
    firstName: new FormControl("", [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-Z\s]*$/),
    ]),
    lastName: new FormControl("", [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-Z\s-]*$/),
    ]),
    email: new FormControl("", [Validators.required, Validators.email]),

    password: new FormControl("", [
      Validators.required,
      this.passwordValidator.bind(this),
    ]),
    passwordConfirm: new FormControl("", [
      Validators.required,
      this.matchPasswordValidator.bind(this),
    ]),
    terms: new FormControl(false, Validators.requiredTrue),
  });

  constructor(
    private signupservice: SignupService,
    private router: Router,
    private toastr: ToastrService,
    private connectionService: ConnectionService
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
    if (this.signupForm.invalid) {
      if (this.signupForm.controls["firstName"].errors) {
        this.toastr.error("Prénom invalide", "Erreur");
        return;
      }

      if (this.signupForm.controls["lastName"].errors) {
        this.toastr.error("Nom de famille invalide", "Erreur");
        return;
      }
      if (this.signupForm.controls["email"].errors) {
        this.toastr.error("Adresse e-mail invalide", "Erreur");
        return;
      }

      if (this.signupForm.controls["password"].errors) {
        this.toastr.error(
          "Le mot de passe doit répondre aux exigences suivantes :<br>" +
            "1 - Au moins 10 caractères<br>" +
            "2 - Au moins 1 lettre majuscule<br>" +
            "3 - Au moins 1 lettre minuscule<br>" +
            "4 - Au moins 1 caractère spécial<br>" +
            "5 - Au moins 1 chiffre",
          "Password Error",
          { enableHtml: true }
        );
        return;
      }

      if (this.signupForm.controls["passwordConfirm"].errors) {
        this.toastr.error("Les mots de passe ne correspondent pas", "Erreur");
        return;
      }

      if (this.signupForm.controls["terms"].value !== true) {
        this.toastr.error(
          "Veuillez accepter les termes et conditions",
          "Erreur"
        );
        return;
      }
    }

    const value = this.signupForm.value;
    this.signupservice.signup(value).subscribe((res) => {
      if (res.success) {
        this.router.navigate([res.redirectUrl]);
        this.toastr.success(
          "Vérifiez votre courriel! <br>" +
            "Un lien pour confirmer votre compte vous a été envoyé<br>",
          "",
          { enableHtml: true }
        );
      } else if (!res.success) {
        this.toastr.error("L'adresse e-mail existe déjà!", "");
      }
    });
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
    const password = control.root.get("password");
    const confirmPassword = control.value;
    if (password && confirmPassword !== password.value) {
      return { passwordMismatch: true };
    }
    return null;
  }
}
