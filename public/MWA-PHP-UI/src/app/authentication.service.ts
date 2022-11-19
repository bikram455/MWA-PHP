import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  #isLoggedIn: boolean = false;
  #token!: string;
  #name!: string;
  get isLoggedIn(): boolean { 
    if(this.token) {
      return true;
    }
    return false;
  }
  // set isLoggedIn(loggedIn: boolean) { this.#isLoggedIn = loggedIn}
  get token(): string { return localStorage.getItem('token') as string}
  set token(token: string) { localStorage.setItem('token', token)}
  get name(): string { return this.#name}
  set name(name: string) { this.#name = name}

  constructor(private jwtService: JwtHelperService) { }

  removeToken(): void {
    localStorage.clear();
  }
}
