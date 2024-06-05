import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ContactService } from "src/app/services/contact.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

declare var $: any;

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"],
})
export class ContactComponent {
  contactForm: FormGroup = new FormGroup({
    name: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    message: new FormControl("", Validators.required),
  });
  constructor(
    private contactservice: ContactService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  submit() {
    if (this.contactForm.invalid) {
      if (this.contactForm.controls["email"].errors) {
        this.toastr.error("Adresse e-mail invalide", "Erreur");
      }

      return;
    }

    const value = this.contactForm.value;
    this.contactservice.contact(value).subscribe((res) => {
      if (res.success) {
        this.router.navigate([res.redirectUrl]);
        this.toastr.success("Votre e-mail a été envoyé!", "Succès");
      }
    });
  }
}
