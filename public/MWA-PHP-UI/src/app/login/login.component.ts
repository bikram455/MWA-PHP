import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
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
  user: User = new User('', '');
  get username(): string {
    if (this._auth.token) {
      return this._jwt.decodeToken(this._auth.token)['name'];
    }
    return this._auth.name
  }
  set username(name: string) { this._auth.name = name }
  get loggedIn(): boolean { return this._auth.isLoggedIn }


  constructor(private _usersService: UsersService, private _auth: AuthenticationService, private _jwt: JwtHelperService) { }

  ngOnInit(): void {
  }

  _resetForm(): void {
    this.user.name = '';
    this.user.password = '';
  }

  login(login: NgForm) {
    if (login.invalid) {
      return;
    }
    this._usersService.login(login.value).subscribe({
      next: (res) => {
        this._auth.token = res['data']['token'];
        this.username = this._auth.name;
        this._resetForm();
      }, 
      error: (err) => {
        console.error(err);
      }
    });
  }

  logOut(): void {
    this._auth.removeToken();
  }
}
