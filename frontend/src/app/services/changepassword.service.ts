import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environment/environment";
import { ChangePasswordModel } from "../models/changepassword.model";
import { Observable } from "rxjs";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChangepasswordService {
  url = environment.api_url + "/change_password";

  constructor(private http: HttpClient) {}

  changePassword(changepass: ChangePasswordModel): Observable<any> {
    const sessionData = JSON.parse(
      sessionStorage.getItem("sessionData") || "{}"
    );
    if (sessionData && sessionData.idUser) {
      changepass.idUser = sessionData.idUser;
      return this.http.post(this.url, changepass);
    } else {
      return throwError("Can't change password");
    }
  }
}
