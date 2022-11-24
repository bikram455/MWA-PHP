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
  get name(): string { 
    if(this.checkTokenValid()) {
      return this._jwt.decodeToken(this.token).name;
    } else {
      this.removeToken();
      return environment.main;
    }
  }
  set name(name: string) { this.#name = name}

  constructor(private _jwt: JwtHelperService) { }

  checkTokenValid(): boolean {
      const currentTime = Math.floor((new Date).getTime() / environment.thousand);
      const tokenExpiry = this._jwt.decodeToken(this.token)[environment.exp];
      const tokenExpired = currentTime >= tokenExpiry;
      if(tokenExpired) {
        this.removeToken();
        return false;
      }
      return true;
  }

  removeToken(): void {
    localStorage.clear();
  }
}
