import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
  form = new FormGroup({
    nameValue: new FormControl('', Validators.required),
    passwordValue: new FormControl('', Validators.required),
  });

  loginError = false;
  shake = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    const { nameValue, passwordValue } = this.form.value;
  
    this.auth.login(nameValue!, passwordValue!).then((success) => {
      console.log(success);
      
      if (success) {
        this.router.navigate(['/admin']);
      } else {
        this.loginError = true;
        this.shake = true;
        setTimeout(() => (this.shake = false), 500);
      }
    });
  }
}