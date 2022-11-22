import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from '../authentication.service';
import { User, UsersService } from '../users.service';
import * as SystemUtils from '../utils/system.utils';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.css']
})
export class NavigateComponent implements OnInit {
  @ViewChild('loginForm')
  loginForm!: NgForm;
  user: User = new User('', '');
  // loggedIn: boolean = false;
  // username!: string;
  // #loggedIn!: boolean;
  get loggedIn(): boolean {return this._auth.isLoggedIn}
  // set loggedIn(loggedIn: boolean) {this._auth.isLoggedIn = loggedIn}
  get username(): string {
    if(this._auth.token) {
      return this._jwt.decodeToken(this._auth.token)['name'];
    }
    return this._auth.name
  }
  set username(name: string) {this._auth.name = name}

  constructor(private _usersService: UsersService, private _auth: AuthenticationService, private _jwt: JwtHelperService, private _router: Router) { }

  ngOnInit(): void {
  }

  
  login(login: NgForm) {
    if(login.invalid) {
      return;
    }
    this._usersService.login(login.value).subscribe(res => {
      this._auth.token = res['data']['token'];
      this.username = this._auth.name; 
      this.username = res['data']['name']; 
    }, err => {
      console.error(err);
    });
  }

  getClass(route: string): string {
    return route === this._router.url ? 'active' : 'inactive';
  }
}
