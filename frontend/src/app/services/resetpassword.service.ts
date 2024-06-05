import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environment/environment";
import { ResetPasswordModel } from "../models/resetpassword.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ResetpasswordService {
  url = environment.api_url + "/reset_password";

  constructor(private http: HttpClient) {}

  reset(resetPass: ResetPasswordModel): Observable<any> {
    return this.http.post(this.url, resetPass);
  }
}
