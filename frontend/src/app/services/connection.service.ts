import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environment/environment";
import { ConnectionModel } from "../models/connection.model";
import { Router } from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";
import { first, tap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class ConnectionService {
  url = environment.api_url + "/login";

  isUserLoggedIn$ = new BehaviorSubject<boolean>(this.checkConnectSidCookie());

  private checkConnectSidCookie(): boolean {
    const token = localStorage.getItem("token");
    if (token) {
      return true;
    }
    return false;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  login(connection: ConnectionModel): Observable<any> {
    return this.http.post(this.url, connection, { withCredentials: true }).pipe(
      first(),
      tap((res: any) => {
        if (res.success && res.token) {
          localStorage.setItem("token", res.token);
          this.isUserLoggedIn$.next(true);
        }
      })
    );
  }

  setSessionData(sessionData: any) {
    sessionStorage.setItem("sessionData", JSON.stringify(sessionData));
  }

  urlLogOut = environment.api_url + "/logout";

  logout() {
    this.http.post(this.urlLogOut, null, { withCredentials: true }).subscribe(
      () => {
        this.router.navigate(["/accueil"]);
        this.toastr.success("Déconnexion réussie!", "Succès");
      },
      (error) => {
        console.log("Logout error:", error);
      }
    );

    localStorage.removeItem("token");
    this.setSessionData(null);
    this.isUserLoggedIn$.next(false);
  }
}
