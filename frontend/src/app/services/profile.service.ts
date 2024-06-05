import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environment/environment";
import { ProfileModel } from "../models/profile.model";
import { Observable } from "rxjs";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  url = environment.api_url + "/edit_profile";

  constructor(private http: HttpClient) {}

  editProfile(profile: ProfileModel): Observable<any> {
    const sessionData = JSON.parse(
      sessionStorage.getItem("sessionData") || "{}"
    );
    if (sessionData && sessionData.idUser) {
      const formData = new FormData();
      formData.append("idUser", sessionData.idUser);
      formData.append("firstName", profile.firstName);
      formData.append("lastName", profile.lastName);
      formData.append("picture", profile.picture);
      formData.append("address", profile.address);
      formData.append("phoneNumber", profile.phoneNumber);
      formData.append("level", profile.level);
      formData.append("sport", profile.sport);
      formData.append("gender", profile.gender);

      return this.http.post(this.url, formData);
    } else {
      return throwError("Can't reach the server");
    }
  }

  getUserProfile(): Observable<ProfileModel> {
    const sessionData = JSON.parse(
      sessionStorage.getItem("sessionData") || "{}"
    );
    if (sessionData && sessionData.idUser) {
      const options = { params: { idUser: sessionData.idUser } };
      return this.http.get<ProfileModel>(this.url, options);
    } else {
      return throwError("Session not found");
    }
  }
}
