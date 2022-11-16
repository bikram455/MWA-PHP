import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Platform } from './platforms.service';
@Injectable({
  providedIn: 'root'
})
export class GamesService {
  #baseUrl: string = 'http://localhost:3000/api/'
  constructor(private _http: HttpClient) { }

  fetchGames(page: number): Observable<GamesData> {
    const url = `${this.#baseUrl}games?offset=${page * 5}`;
    return this._http.get(url) as Observable<GamesData>;
  }

  fetchGame(gameId: string): Observable<GameData> {
    const url = `${this.#baseUrl}games/${gameId}`;
    return this._http.get(url) as Observable<GameData>;
  }

  addGame(game: Game): Observable<any> {
    const url = `${this.#baseUrl}games`;
    return this._http.post(url, game) as  Observable<any>;
  }

  deleteGame(gameId: string): Observable<any> {
    const url = `${this.#baseUrl}games/${gameId}`;
    return this._http.delete(url) as Observable<any>;
  }

  updateGame(gameId: string, game: Game): Observable<any> {
    const url = `${this.#baseUrl}games/${gameId}`;
    return this._http.put(url, game) as  Observable<any>;
  }

  updateGamePartial(gameId:string, game: any): Observable<any> {
    const url = `${this.#baseUrl}games/${gameId}`;
    return this._http.patch(url, game) as  Observable<any>;
  }
}

export class GamesData {
  #data!: Game[];
  #count!: number;
  set data(games: Game[]) {this.#data = games}
  set count(count: number) { this.#count = count}
  get data(): Game[] {return this.#data}
  get count(): number { return this.#count}
  constructor(games: Game[], count: number) {
    this.#data = games;
    this.#count = count;
  }
}

export class GameData {
  #data!: Game;

  get data(): Game { return this.#data}
  set data(game: Game) { this.#data = game}
  constructor(game: Game) {
    this.#data = game;
  }
}

export class Game {
  #_id!: string;
  #name!: string;
  #publisher!: string;
  #platforms!: Platform[];

  get _id(): string {return this.#_id}
  get name(): string {return this.#name}
  get publisher(): string {return this.#publisher}
  get platforms(): Platform[] {return this.#platforms}

  set _id(id: string) {this.#_id = id}
  set name(name: string) {this.#name = name}
  set publisher(publisher: string) {this.#publisher = publisher}
  set platforms(platforms: Platform[]) {this.#platforms = platforms}

  constructor(id: string, name: string, publisher: string, platforms: Platform[]) {
    this.#_id = id;
    this.#name = name;
    this.#publisher = publisher
    this.#platforms = platforms;
  }
}
