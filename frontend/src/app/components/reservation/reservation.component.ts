import { Component, OnInit } from "@angular/core";
import { TerrainModel } from "../../models/terrain.model";
import { ActivatedRoute } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ReservationService } from "src/app/services/reservation.service";
import { Router } from "@angular/router";
import { ConnectionService } from "src/app/services/connection.service";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environment/environment";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-reservation",
  templateUrl: "./reservation.component.html",
  styleUrls: ["./reservation.component.css"],
})
export class ReservationComponent implements OnInit {
  isLoggedIn!: boolean;
  terrainName: any[] = [];

  idTerrain!: number;
  reservationForm!: FormGroup;

  url = environment.api_url + "/terrain";

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private router: Router,
    private connectionService: ConnectionService,
    private toastr: ToastrService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.connectionService.isUserLoggedIn$.subscribe(
      (loggedIn) => (this.isLoggedIn = loggedIn)
    );

    if (this.isLoggedIn == false) {
      this.router.navigate(["/log"]);
    }

    this.route.params.subscribe((params) => {
      this.idTerrain = Number(params["id"]);

      this.reservationForm = new FormGroup({
        idTerrain: new FormControl(this.idTerrain),
        date: new FormControl("", [Validators.required]),
        startTime: new FormControl("", [Validators.required]),
        endTime: new FormControl("", [Validators.required]),
      });

      this.getTerrain();
    });
  }

  getTerrain(): void {
    const options = { params: { idTerrain: this.idTerrain } };
    this.http.get<any[]>(this.url, options).subscribe(
      (terrainName) => {
        this.terrainName = terrainName;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  submitReservation() {
    const selectedDate = this.reservationForm.get("date")?.value;
    const startTime = this.reservationForm.get("startTime")?.value;
    const currentDate = new Date();

    const selectedDateTime = new Date(selectedDate);
    const [hours, minutes] = startTime.split(":").map(Number);
    selectedDateTime.setHours(hours, minutes);

    if (currentDate > selectedDateTime) {
      this.toastr.warning(
        "La date sélectionnée ne peut pas être dans le passé",
        "Erreur"
      );
      return;
    }

    const timeDiff = selectedDateTime.getTime() - currentDate.getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    if (daysDiff > 60) {
      this.toastr.warning(
        "La date sélectionnée ne peut pas être à plus de 60 jours de la date d'aujourd'hui",
        "Erreur"
      );
      return;
    }

    if (
      !this.reservationForm.controls["date"].value ||
      !this.reservationForm.controls["startTime"].value ||
      !this.reservationForm.controls["endTime"].value
    ) {
      this.toastr.warning("Veuillez remplir toutes les entrées", "");
      return;
    }

    const start = this.convertToMinutes(
      this.reservationForm.controls["startTime"].value
    );
    const end = this.convertToMinutes(
      this.reservationForm.controls["endTime"].value
    );

    if (end <= start) {
      this.toastr.warning(
        "L'heure de début de la réservation doit venir avant l'heure de fin",
        ""
      );
      return;
    }

    const difference = end - start;

    if (difference < 30) {
      this.toastr.warning(
        "La durée de la réservation doit être de minimum 30 min",
        ""
      );
      return;
    } else if (difference > 120) {
      this.toastr.warning(
        "La durée de la réservation doit être au maximum de 2 heures",
        ""
      );
      return;
    }

    if (start < 7 * 60 || start > 22 * 60 || end < 7 * 60 || end > 22 * 60) {
      this.toastr.warning("La réservation doit être entre 7h et 22h", "");
      return;
    }

    const value = this.reservationForm.value;
    console.log(value);
    this.reservationService.reserve(value).subscribe((res) => {
      if (res.success) {
        this.router.navigate([res.redirectUrl]);
      } else if (!res.success) {
        this.toastr.warning(res.message || "", "Erreur");
      }
    });
  }
}
