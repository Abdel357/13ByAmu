import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environment/environment";
import { SignupModel } from "../models/signup.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SignupService {
  url = environment.api_url + "/register";

  constructor(private http: HttpClient) {}

  signup(signup: SignupModel): Observable<any> {
    return this.http.post(this.url, signup);
  }
}
