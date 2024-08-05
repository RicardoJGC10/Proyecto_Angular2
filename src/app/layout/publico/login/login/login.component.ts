// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../../auth-service.service';
import { UserService } from '../../../../user-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginObj: Login;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.loginObj = new Login();
  }
  ngOnInit(): void {
    this.checkLocalStorage();
  }

  checkLocalStorage(){
    if(localStorage.getItem('token')){
      this,this.router.navigate(['dashboard']);

    }
  }


  onLogin() {
    this.http.post('http://143.198.70.194/login/', this.loginObj).subscribe(
      (res: any) => {
        console.log('Response from server:', res);
        if (res.access) {
          this.authService.saveToken(res.access);
          if (res.user) {
            console.log(res.user.first_name);
            this.userService.setFirstName(res.user.first_name);
            this.userService.setLastName(res.user.last_name);

          } else {
            console.error('User is not present in the response');
          }
          alert('Login successful');
          this.router.navigate(['/dashboard']);
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error during login:', error);
        if (error.status === 401) {
          alert('Unauthorized');
        } else if (error.status === 400) {
          alert('No puede haber campos vacíos');
        } else {
          alert('An error occurred during login. Please try again.');
        }
      }
    );
  }

  myimage: string = "images/Logo.png";
  myimage2: string = "images/bloqueo.png";
  myimage3: string = "images/wave.png";

}

export class Login {
  username: string;
  password: string;
  constructor() {
    this.username = '';
    this.password = '';
  }
}
