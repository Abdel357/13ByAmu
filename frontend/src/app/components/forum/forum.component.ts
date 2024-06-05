import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ForumService } from "src/app/services/forum.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environment/environment";
import { HttpClient } from "@angular/common/http";
import { ConnectionService } from "src/app/services/connection.service";

@Component({
  selector: "app-forum",
  templateUrl: "./forum.component.html",
  styleUrls: ["./forum.component.css"],
})
export class ForumComponent implements OnInit {
  url_publication = environment.api_url + "/publication";
  url_comment = environment.api_url + "/comment";
  url_user = environment.api_url + "/users";

  isLoggedIn!: boolean;

  publications: any[] = [];
  filteredPublications: any[] = [];
  comments: any[] = [];
  users: any[] = [];

  publicationForm: FormGroup = new FormGroup({
    title: new FormControl("", [Validators.required, Validators.minLength(5)]),
    publication: new FormControl("", [
      Validators.required,
      Validators.minLength(10),
    ]),
  });

  commentForm: FormGroup = new FormGroup({
    comment: new FormControl("", [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  constructor(
    private forumservice: ForumService,
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient,
    private connectionService: ConnectionService
  ) {}

  ngOnInit(): void {
    this.connectionService.isUserLoggedIn$.subscribe(
      (loggedIn) => (this.isLoggedIn = loggedIn)
    );

    if (this.isLoggedIn === false) {
      this.router.navigate(["/log"]);
    }

    this.getPublications();
    this.getComments();
    this.getUsers();
    this.filteredPublications = this.publications;
  }

  getPublications(): void {
    this.http.get<any[]>(this.url_publication).subscribe(
      (publicationsWithUserInfo) => {
        this.publications = publicationsWithUserInfo;
        this.filteredPublications = this.publications;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getComments() {
    this.http.get<any[]>(this.url_comment).subscribe(
      (comments) => {
        this.comments = comments;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getUsers() {
    this.http.get<any[]>(this.url_user).subscribe(
      (users) => {
        this.users = users;
        console.log(this.users);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  submit() {
    const value = this.publicationForm.value;
    if (this.publicationForm.valid) {
      this.forumservice.poste(value).subscribe((res) => {
        if (res.success) {
          this.router.navigate([res.redirectUrl]);
          this.toastr.success("Publication ajoutée avec succès", "Succès");
        }
        setTimeout(() => {
          location.reload();
        }, 1000);
      });
    } else {
      if (this.publicationForm.controls["title"].errors) {
        this.toastr.warning("Le titre doit contenir au moins 5 caractères", "");
      }
      if (this.publicationForm.controls["publication"].errors) {
        this.toastr.warning(
          "La publication doit contenir au moins 10 caractères",
          ""
        );
      }
    }
  }

  submitComment(idPublication: number) {
    const value = this.commentForm.value;

    if (this.commentForm.valid) {
      this.forumservice.posteComment(value, idPublication).subscribe((res) => {
        if (res.success) {
          this.router.navigate([res.redirectUrl]);
          this.toastr.success("Commentaire ajouté avec succès", "Succès");
        }
        setTimeout(() => {
          location.reload();
        }, 1000);
      });
    } else {
      this.toastr.warning(
        "Le commentaire doit contenir au moins 5 caractères",
        ""
      );
    }
  }

  showForm = false;
  title = "";
  publication = "";

  cancelForm(): void {
    this.title = "";
    this.publication = "";
    this.showForm = false;
  }

  selectedPublication: any = null;
  openPopup(publication: any): void {
    this.selectedPublication = publication;
  }

  closePopup(): void {
    this.selectedPublication = null;
  }
  filterByDate(event: any): void {}

  filterByType(event: any): void {
    const selectedValue = event.target.value;
    if (selectedValue === "") {
      this.filteredPublications = this.publications;
    } else if (selectedValue === "my") {
      const sessionData = JSON.parse(
        sessionStorage.getItem("sessionData") || "{}"
      );
      this.filteredPublications = this.publications.filter(
        (publication) => publication.idUser === sessionData.idUser
      );
    }
  }

  hasMatchingComments(): boolean {
    return this.comments.some(
      (comment) =>
        comment.idPublication === this.selectedPublication.idPublication
    );
  }

  getTimeElapsedString(datePublication: string): string {
    const now = new Date();
    const publicationDate = new Date(datePublication);
    const diff = Math.abs(now.getTime() - publicationDate.getTime()) / 1000;

    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / 86400);
    const months = Math.floor(diff / 2592000);
    const years = Math.floor(diff / 31536000);

    if (years > 0) {
      return `Il y a ${years} an${years > 1 ? "s" : ""}`;
    } else if (months > 0) {
      return `Il y a ${months} mois`;
    } else if (days > 0) {
      return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;
    } else {
      return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
  }

  getTimeElapsed(datePublication: string): string {
    return this.getTimeElapsedString(datePublication);
  }

  getUserById(idUser: number): any {
    return this.users.find((user) => user.idUser === idUser);
  }
}
