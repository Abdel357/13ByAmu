import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ConnectionService } from "src/app/services/connection.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  isLoggedIn!: boolean;

  constructor(
    private connectionService: ConnectionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.connectionService.isUserLoggedIn$.subscribe(
      (loggedIn) => (this.isLoggedIn = loggedIn)
    );
  }

  logout() {
    this.connectionService.logout();
  }
}
