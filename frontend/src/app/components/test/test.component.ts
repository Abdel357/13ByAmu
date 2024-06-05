import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.css"],
})
export class TestComponent {
  @Input() maxRating: number = 5;
  @Input() initialRating: number = 0;
  @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();

  currentRating!: number;
  stars!: number[];

  ngOnInit() {
    this.currentRating = this.initialRating;
    this.stars = Array(this.maxRating)
      .fill(0)
      .map((_, i) => i + 1);
  }

  setRating(rating: number) {
    this.currentRating = rating;
    this.ratingChange.emit(this.currentRating);
  }

  getRating(event: MouseEvent, starIndex: number) {
    const rating = starIndex + 1;
    this.setRating(rating);
  }
}
