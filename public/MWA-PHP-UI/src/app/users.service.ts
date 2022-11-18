import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  #baseUrl: string = 'http://localhost:3000/api/';
  constructor(private _http: HttpClient) { }

  login(user: Object): Observable<User> {
    const url = `${this.#baseUrl}user`
    return this._http.post(url, user) as Observable<User>;
  }

  register(user: Object): Observable<User> {
    const url = `${this.#baseUrl}users`
    return this._http.post(url, user) as Observable<User>;
  }
}

export class User {
  #name!: string;
  #token!: string;
  #username!: string;
  #password!: string;

  get name(): string {return this.#name}
  get token(): string {return this.#token}
  get username(): string {return this.#username}
  get password(): string {return this.#password}

  set name(name: string) {this.#name = name}
  set token(token: string) {this.#token = token}
  set username(username: string) {this.#username = username}
  set password(password: string) {this.#password = password}

  constructor(name: string, username: string) {
    this.#name = name;
    this.#username = username;
    this.#token = '';
    this.#password = '';
  }
}