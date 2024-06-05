import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environment/environment";
import { EvaluationModel } from "../models/evaluation.model";
import { Observable } from "rxjs";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EvaluationService {
  url = environment.api_url + "/reservation/evaluation/:idTerrain";

  constructor(private http: HttpClient) {}

  evaluate(evaluate: EvaluationModel): Observable<any> {
    const sessionData = JSON.parse(
      sessionStorage.getItem("sessionData") || "{}"
    );
    if (sessionData && sessionData.idUser) {
      evaluate.idUser = sessionData.idUser;
      console.log(evaluate);
      return this.http.post(this.url, evaluate);
    } else {
      return throwError("Session not found");
    }
  }
}
