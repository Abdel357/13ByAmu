import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environment/environment";
import { ContactModel } from "../models/contact.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ContactService {
  url = environment.api_url + "/contact";

  constructor(private http: HttpClient) {}

  contact(contact: ContactModel): Observable<any> {
    return this.http.post(this.url, contact);
  }
}
