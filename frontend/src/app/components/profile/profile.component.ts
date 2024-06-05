import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ProfileService } from "src/app/services/profile.service";
import { Router } from "@angular/router";
import { ConnectionService } from "src/app/services/connection.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  isLoggedIn!: boolean;

  profileForm: FormGroup = new FormGroup({
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl("", Validators.required),
    picture: new FormControl("", Validators.required),
    address: new FormControl("", Validators.required),
    phoneNumber: new FormControl("", [
      Validators.required,
      Validators.pattern(/^0[0-9]{9}$/), // format du numéro de téléphone (10 chiffres commençant par 0)
    ]),
    level: new FormControl("", Validators.required),
    sport: new FormControl("", Validators.required),
    gender: new FormControl("", Validators.required),
    photo: new FormControl("", Validators.required),
  });

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private connectionService: ConnectionService,
    private toastr: ToastrService
  ) {}

  photoname!: string;

  ngOnInit(): void {
    this.connectionService.isUserLoggedIn$.subscribe(
      (loggedIn) => (this.isLoggedIn = loggedIn)
    );

    if (this.isLoggedIn == false) {
      this.router.navigate(["/accueil"]);
    }

    this.profileService.getUserProfile().subscribe(
      (user) => {
        console.log(user);
        this.profileForm.patchValue({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          address: user.address || "",
          phoneNumber: user.phoneNumber || "",
          level: user.level || "",
          sport: user.sport || "",
          gender: user.gender || "",
          photo: user.photo || "",
        });
      },

      (error) => {
        console.log("Error fetching user profile:", error);
      }
    );
  }

  submit() {
    /*
    if (this.profileForm.controls["phoneNumber"].errors) {
      this.toastr.warning(
        "Format du numéro de téléphone invalide : <br> " +
          "10 chiffres commençant par 0<br>",
        "",
        { enableHtml: true }
      );
      return;
    }
    */
    const value = this.profileForm.value;
    this.profileService.editProfile(value).subscribe((res) => {
      if (res.success) {
        this.router.navigate([res.redirectUrl]);
        this.toastr.success("modification réussie !", "Succès");
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    });
  }

  selectedFile: File | null = null;
  previewImage: string | null = null;

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);

      this.profileForm.patchValue({
        picture: file,
      });
    }
  }

  restrictToNumbers(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, "");
  }

  showCameraIcon: boolean = false;

  onMouseEnter() {
    this.showCameraIcon = true;
  }

  onMouseLeave() {
    this.showCameraIcon = false;
  }

  getSelectedImage(): string {
    // Check if a file is selected
    if (this.selectedFile) {
      // Create a URL for the selected file
      return URL.createObjectURL(this.selectedFile);
    } else {
      // Return a default fallback image URL or an empty string
      return "../../../assets/default-image.jpg"; // Replace with your default image URL
    }
  }
}
