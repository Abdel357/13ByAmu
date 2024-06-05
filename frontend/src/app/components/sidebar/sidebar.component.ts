import { Component, Renderer2, OnInit } from "@angular/core";
import { ConnectionService } from "src/app/services/connection.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { NavigationEnd } from "@angular/router";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent {
  isProfilePage!: boolean;

  constructor(
    private connectionService: ConnectionService,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isProfilePage = event.url === "/profile";
      }
    });
  }

  logout() {
    const message = "Déconnexion réussie!";
    const type = "success";

    sessionStorage.setItem("notificationMessage", message);
    sessionStorage.setItem("notificationType", type);
    this.connectionService.logout();
  }
}
