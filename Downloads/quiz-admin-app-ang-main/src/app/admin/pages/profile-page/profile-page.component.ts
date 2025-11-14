import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  // profile
  login: string | null = '';
  pass: string | null = '2cbr3HPbjjLDJRVb';
  role: string | null = '';
  isVisible = false;
  // chart
  readonly value = [40, 30, 20, 10];
  activeItemIndex = NaN;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.login = this.authService.getLogin();
    this.role = this.authService.getRole();
  }
  clicked(){
    this.isVisible = !this.isVisible;

    if(this.isVisible){
      setTimeout(() => {
        this.isVisible = false;
      }
      , 4000);
    }
  }
}