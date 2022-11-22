import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  #name!: string;
  get isLoggedIn(): boolean { 
    if(this.token) {
      return true;
    }
    return false;
  }
  get token(): string { return localStorage.getItem(environment.token) as string}
  set token(token: string) { localStorage.setItem(environment.token, token)}
  get name(): string { return this.#name}
  set name(name: string) { this.#name = name}

  constructor(private jwtService: JwtHelperService) { }

  removeToken(): void {
    localStorage.clear();
  }
}
