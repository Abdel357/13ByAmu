import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { EvaluationService } from "src/app/services/evaluation.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { ConnectionService } from "src/app/services/connection.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-evaluation",
  templateUrl: "./evaluation.component.html",
  styleUrls: ["./evaluation.component.css"],
})
export class EvaluationComponent implements OnInit {
  evaluationForm: FormGroup;
  isLoggedIn!: boolean;

  constructor(
    private evaluationService: EvaluationService,
    private router: Router,
    private route: ActivatedRoute,
    private connectionService: ConnectionService,
    private toastr: ToastrService
  ) {
    this.evaluationForm = new FormGroup({
      stars: new FormControl("", Validators.required),
      message: new FormControl("", Validators.required),
      idTerrain: new FormControl("", Validators.required),
    });
  }

  ngOnInit() {
    this.connectionService.isUserLoggedIn$.subscribe(
      (loggedIn) => (this.isLoggedIn = loggedIn)
    );

    if (this.isLoggedIn == false) {
      this.router.navigate(["/log"]);
    }

    this.route.paramMap.subscribe((params) => {
      const idTerrain = params.get("idTerrain");
      this.evaluationForm.patchValue({ idTerrain });
    });
  }

  submit() {
    if (this.evaluationForm.controls["stars"].errors) {
      this.toastr.warning("Veuillez choisir entre 1 et 5 étoiles", "");
      return;
    }

    if (this.evaluationForm.controls["message"].errors) {
      this.toastr.warning("Veuillez ajouter un commentaire", "");
      return;
    }
    const value = this.evaluationForm.value;
    console.log(value);
    this.evaluationService.evaluate(value).subscribe((res) => {
      if (res.success) {
        this.router.navigate([res.redirectUrl]);
        this.toastr.success("Merci d'avoir partagé votre évaluation", "Succès");
      }
    });
  }
}
