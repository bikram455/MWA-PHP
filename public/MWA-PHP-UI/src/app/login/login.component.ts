import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication.service';
import { User, UsersService } from '../users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm')
  loginForm!: NgForm;
  user: User = new User(environment.main, environment.main);
  get username(): string {
    return this._auth.name
  }
  formError: string = environment.main;
  set username(name: string) { this._auth.name = name }
  get loggedIn(): boolean { return this._auth.isLoggedIn }
  get welcome(): string {return environment.welcome}
  get logOutText(): string {return environment.logOut}
  get logInText(): string {return environment.logIn}

  constructor(private _usersService: UsersService, private _auth: AuthenticationService, private _jwt: JwtHelperService, private _router: Router) { }

  ngOnInit(): void {
  }

  _resetForm(): void {
    this.user.name = environment.main;
    this.user.password = environment.main;
    this.formError = environment.main;
  }

  login(login: NgForm) {
    if (login.invalid) {
      this.formError = environment.allFieldsRequired;
      return;
    }
    this._usersService.login(login.value).subscribe({
      next: (res) => {
        this._auth.token = res.data.token;
        this.username = this._auth.name;
        this._resetForm();
      }, 
      error: (err) => {
        console.error(err);
      }
    });
  }

  logOut(): void {
    this._router.navigate([environment.main]);
    this._auth.removeToken();
  }
}
