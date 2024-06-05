import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environment/environment";
import { MesreservationsModel } from "../models/mesreservations.model";
import { Observable } from "rxjs";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MesreservationService {
  url = environment.api_url + "/mesreservations";

  constructor(private http: HttpClient) {}

  getUserReservations(): Observable<MesreservationsModel> {
    const sessionData = JSON.parse(
      sessionStorage.getItem("sessionData") || "{}"
    );
    if (sessionData && sessionData.idUser) {
      const options = { params: { idUser: sessionData.idUser } };
      return this.http.get<MesreservationsModel>(this.url, options);
    } else {
      return throwError("Session not found");
    }
  }
}
