import { Component, OnInit } from "@angular/core";
import { ConnectionService } from "src/app/services/connection.service";
import { Router } from "@angular/router";
import { environment } from "src/environment/environment";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-mesreservations",
  templateUrl: "./mesreservations.component.html",
  styleUrls: ["./mesreservations.component.css"],
})
export class MesreservationsComponent implements OnInit {
  isLoggedIn!: boolean;
  url = environment.api_url + "/mesreservations";
  url_cancel = environment.api_url + "/cancel";
  reservations: any[] = [];

  constructor(
    private connectionService: ConnectionService,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.connectionService.isUserLoggedIn$.subscribe(
      (loggedIn) => (this.isLoggedIn = loggedIn)
    );

    if (this.isLoggedIn == false) {
      this.router.navigate(["/accueil"]);
    }
    this.getReservations();
  }

  getReservations(): void {
    const sessionData = JSON.parse(
      sessionStorage.getItem("sessionData") || "{}"
    );
    if (sessionData && sessionData.idUser) {
      const options = { params: { idUser: sessionData.idUser } };
      this.http.get<any[]>(this.url, options).subscribe(
        (reservationContents) => {
          this.reservations = reservationContents;
          console.log(reservationContents);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  cancelReservation(idReservation: string) {
    const payload = {
      idReservation: idReservation,
    };

    this.http
      .post<{ success: boolean; redirectUrl: string }>(this.url_cancel, payload)
      .subscribe((res) => {
        if (res.success) {
          this.router.navigate([res.redirectUrl]);
          this.toastr.success("Réservation annulée avec succès", "Succès");

          setTimeout(() => {
            location.reload();
          }, 1000);
        }
      });
  }

  isReservationExpired(dateReservation: string, startTime: string): boolean {
    const reservationDateTime = new Date(dateReservation + " " + startTime);
    const currentDateTime = new Date();

    return currentDateTime > reservationDateTime;
  }

  selectedFilter: string = "all";

  filteredReservations() {
    if (this.selectedFilter === "valide") {
      return this.reservations.filter(
        (reservation) =>
          reservation[0].isCanceled === 0 &&
          !this.isReservationExpired(
            reservation[0].dateReservation,
            reservation[0].startTime
          )
      );
    } else if (this.selectedFilter === "annule") {
      return this.reservations.filter(
        (reservation) =>
          reservation[0].isCanceled === 1 &&
          !this.isReservationExpired(
            reservation[0].dateReservation,
            reservation[0].startTime
          )
      );
    } else if (this.selectedFilter === "passe") {
      return this.reservations.filter((reservation) =>
        this.isReservationExpired(
          reservation[0].dateReservation,
          reservation[0].startTime
        )
      );
    }
    return this.reservations;
  }
}
