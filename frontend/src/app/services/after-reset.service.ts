import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environment/environment";
import { AfterResetModel } from "../models/afterreset.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AfterResetService {
  url = environment.api_url + "/after_rp/";

  constructor(private http: HttpClient) {}

  reset(afterReset: AfterResetModel): Observable<any> {
    return this.http.post(this.url, afterReset);
  }
}
