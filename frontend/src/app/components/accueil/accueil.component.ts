import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-accueil",
  templateUrl: "./accueil.component.html",
  styleUrls: ["./accueil.component.css"],
})
export class AccueilComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //parallax effect
    const parallax = document.getElementById("parallax");
    window.addEventListener("scroll", () => {
      let offset = window.pageYOffset;
      if (parallax) {
        parallax.style.backgroundPositionY = offset * 0.7 + "px";
      }
    });

    // Check if token exists in the URL
    const token = this.route.snapshot.paramMap.get("token");
    if (token) {
      this.confirmEmail(token);
    }

    //logwout message :
    const message = sessionStorage.getItem("notificationMessage");
    const type = sessionStorage.getItem("notificationType");

    sessionStorage.removeItem("notificationMessage");
    sessionStorage.removeItem("notificationType");

    if (message && type) {
      if (type === "success") {
        this.toastr.success(message);
      } else if (type === "error") {
        this.toastr.error(message);
      } else if (type === "warning") {
        this.toastr.warning(message);
      } else if (type === "info") {
        this.toastr.info(message);
      }
    }
  }

  scrollToSection(targetId: string): void {
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  confirmEmail(token: string): void {
    this.http.get(`http://localhost:4000/confirm-email/${token}`).subscribe(
      (response: any) => {
        console.log("Email confirmed successfully!");

        this.toastr.success(
          response.message || "Email confirmed successfully!",
          "Success"
        );
      },
      (error: any) => {
        console.log("Error confirming email:", error);

        this.toastr.error(
          error.error ||
            "Une erreur s'est produite lors de la confirmation de l'e-mail.",
          "Error"
        );
      }
    );
  }
}
