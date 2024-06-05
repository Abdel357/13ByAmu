import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environment/environment";
import { PaymentModel } from "../models/payment.model";
import { Observable } from "rxjs";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  url = environment.api_url + "/payment";

  constructor(private http: HttpClient) {}

  confirmPayment(payment: PaymentModel): Observable<any> {
    const sessionData = JSON.parse(
      sessionStorage.getItem("sessionData") || "{}"
    );
    if (sessionData && sessionData.idUser) {
      payment.idUser = sessionData.idUser;
      return this.http.post(this.url, payment);
    } else {
      return throwError("User not authenticated");
    }
  }
}
