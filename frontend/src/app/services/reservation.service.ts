import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environment/environment";
import { ReservationModel } from "../models/reservation.model";
import { Router } from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ReservationService {
  url = environment.api_url + "/reserver/:idTerrain";

  constructor(private http: HttpClient, private router: Router) {}

  reserve(reservation: ReservationModel): Observable<any> {
    return this.http.post(this.url, reservation, { withCredentials: true });
  }
}
