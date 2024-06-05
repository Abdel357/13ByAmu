import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environment/environment";
import { PublicationModel } from "../models/publication.model";
import { CommentModel } from "../models/comment.model";
import { Observable } from "rxjs";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ForumService {
  url_publication = environment.api_url + "/publication";
  url_comment = environment.api_url + "/comment";

  constructor(private http: HttpClient) {}

  poste(publication: PublicationModel): Observable<any> {
    const sessionData = JSON.parse(
      sessionStorage.getItem("sessionData") || "{}"
    );
    if (sessionData && sessionData.idUser) {
      publication.idUser = sessionData.idUser;
      return this.http.post(this.url_publication, publication);
    } else {
      return throwError("session error");
    }
  }

  posteComment(comment: CommentModel, idPublication: number): Observable<any> {
    const sessionData = JSON.parse(
      sessionStorage.getItem("sessionData") || "{}"
    );
    if (sessionData && sessionData.idUser) {
      comment.idUser = sessionData.idUser;
      comment.idPublication = idPublication;
      console.log(comment);
      return this.http.post(this.url_comment, comment);
    } else {
      return throwError("session error");
    }
  }
}
