import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  #baseUrl: string = 'http://localhost:3000/api/users/';
  constructor(private _http: HttpClient) { }

  login(user: Object): Observable<UserData> {
    const url = `${this.#baseUrl}login`
    return this._http.post(url, user) as Observable<UserData>;
  }

  register(user: Object): Observable<User> {
    const url = `${this.#baseUrl}register`
    return this._http.post(url, user) as Observable<User>;
  }

  fetchUser(username: string): Observable<User> {
    const url = `${this.#baseUrl}${username}`;
    return this._http.get(url) as Observable<User>;
  }
}
class UserData {
  #data!: User;
  get data(): User { return this.#data}
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