import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PaymentService } from "src/app/services/payment.service";
import { Router } from "@angular/router";
import { ConnectionService } from "src/app/services/connection.service";
import { ToastrService } from "ngx-toastr";
import { AbstractControl, ValidationErrors } from "@angular/forms";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.css"],
})
export class PaymentComponent {
  isLoggedIn!: boolean;
  idTerrain!: number;
  dateReservation!: number;
  startTime!: number;
  endTime!: number;
  paymentForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private router: Router,
    private connectionService: ConnectionService,
    private toastr: ToastrService
  ) {}

  cardNumberValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (value && value.length !== 16) {
      return { lengthError: true };
    }
    return null;
  };

  ngOnInit() {
    this.connectionService.isUserLoggedIn$.subscribe(
      (loggedIn) => (this.isLoggedIn = loggedIn)
    );

    if (this.isLoggedIn == false) {
      this.router.navigate(["/accueil"]);
    }

    this.route.params.subscribe((params) => {
      this.idTerrain = Number(params["idTerrain"]);
      this.dateReservation = params["dateReservation"];
      this.startTime = params["startTime"];
      this.endTime = params["endTime"];

      this.paymentForm = new FormGroup({
        idTerrain: new FormControl(this.idTerrain),
        dateReservation: new FormControl(this.dateReservation),
        startTime: new FormControl(this.startTime),
        endTime: new FormControl(this.endTime),
        holderName: new FormControl("", [Validators.required]),
        cardNumber: new FormControl("", [
          Validators.required,
          this.cardNumberValidator,
        ]),
        expMonth: new FormControl("", [
          Validators.required,
          Validators.min(1),
          Validators.max(12),
        ]),
        expYear: new FormControl("", [
          Validators.required,
          Validators.min(2023),
          Validators.max(2050),
        ]),
        cvv: new FormControl("", [
          Validators.required,
          Validators.pattern(/^\d{3,4}$/),
        ]),
      });
    });
  }

  submitPayment() {
    if (this.paymentForm.invalid) {
      if (
        !this.paymentForm.controls["holderName"].value ||
        !this.paymentForm.controls["cardNumber"].value ||
        !this.paymentForm.controls["expMonth"].value ||
        !this.paymentForm.controls["expYear"].value ||
        !this.paymentForm.controls["cvv"].value
      ) {
        this.toastr.error("Veuillez remplir toutes les entrées", "");
      } else if (this.paymentForm.controls["cardNumber"].errors) {
        this.toastr.error("Le numéro de carte doit contenir 16 chiffres", "");
      } else if (this.paymentForm.controls["expMonth"].errors) {
        this.toastr.error("Le mois doit être compris entre 1 et 12", "");
      } else if (this.paymentForm.controls["expYear"].errors) {
        this.toastr.error("L'année doit être comprise entre 2023 et 2050", "");
      } else if (this.paymentForm.controls["cvv"].errors) {
        this.toastr.error("CVV doit contenir 3 ou 4 chiffres", "");
      }
      return;
    }

    const value = this.paymentForm.value;
    this.paymentService.confirmPayment(value).subscribe((res) => {
      if (res.success) {
        this.router.navigate([res.redirectUrl]);
        this.toastr.success("Paiement validé!", "Succès");
      }
    });
  }

  showPopup: boolean = false;

  showConfirmationPopup() {
    this.showPopup = true;
  }

  hideConfirmationPopup() {
    this.showPopup = false;
  }

  restrictToNumbers(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, "");
  }

  restrictToAlphabets(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = input.value.replace(/[^a-zA-Z\s]/g, "");
    input.value = sanitizedValue;
  }
}
