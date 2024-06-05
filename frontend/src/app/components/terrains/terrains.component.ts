import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environment/environment";
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-terrains",
  templateUrl: "./terrains.component.html",
  styleUrls: ["./terrains.component.css"],
})
export class TerrainsComponent implements OnInit {
  terrainsWithAverageRating: any[] = [];
  showPopup: boolean = false;
  popupContent: any[] = [];
  searchKeyword: string = "";

  url = environment.api_url + "/reservation";

  filteredTerrains: any[] = [];

  filterType: string = "";
  filterLocation: string = "";

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getReservations();
  }

  getReservations(): void {
    this.http.get<any[]>(this.url).subscribe(
      (terrainsWithAverageRating) => {
        this.terrainsWithAverageRating = terrainsWithAverageRating;
        this.filteredTerrains = this.terrainsWithAverageRating;
        console.log(terrainsWithAverageRating);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  parseNumber(value: string): number {
    return parseFloat(value);
  }

  navigateToDetails(terrainId: number) {
    this.router.navigate(["/reservation", terrainId]);
  }

  navigateToEvaluation(terrainId: number) {
    this.router.navigate(["/evaluation", terrainId]);
  }

  navigateToGoogleMaps(url: string) {
    window.open(url, "_blank");
  }
  showPopupWindow(content: any[]) {
    this.popupContent = content;
    this.showPopup = true;
  }
  closePopup() {
    this.showPopup = false;
  }

  filterTerrains() {
    this.filteredTerrains = this.terrainsWithAverageRating.filter(
      (terrain) =>
        (this.filterType === "" ||
          terrain.typeTerrain.toLowerCase() ===
            this.filterType.toLowerCase()) &&
        (this.filterLocation === "" ||
          terrain.locationTerrain.toLowerCase() ===
            this.filterLocation.toLowerCase())
    );
  }

  clearFilters() {
    this.filterType = "";
    this.filterLocation = "";
    this.filterTerrains();
  }

  filterTerrainsByName() {
    if (this.searchKeyword.trim() !== "") {
      const keyword = this.searchKeyword.toLowerCase();
      this.filteredTerrains = this.terrainsWithAverageRating.filter((terrain) =>
        terrain.nameTerrain.toLowerCase().includes(keyword)
      );
    } else {
      this.filteredTerrains = this.terrainsWithAverageRating;
    }
  }

  resetSearch() {
    this.searchKeyword = "";
    this.filterTerrainsByName();
  }

  public getFormattedRating(item: any): string {
    const averageRating = item.averageRating;

    if (averageRating === 0 && item.contents.length === 0) {
      return "-";
    } else {
      return averageRating % 1 === 0
        ? Math.floor(averageRating).toString()
        : averageRating.toString();
    }
  }
}
