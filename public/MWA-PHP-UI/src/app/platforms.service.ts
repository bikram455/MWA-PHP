import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PlatformsService {
  #baseUrl: string = 'http://localhost:3000/api/'
  constructor(private _http: HttpClient) { }

  deletePlatform(gameId: string, platformId: string): Observable<any> {
    const url = `${this.#baseUrl}/games/${gameId}/platforms/${platformId}`;
    return this._http.delete(url) as Observable<any>;
  }

  fetchPlatforms(gameId: string): Observable<PlatformData> {
    const url = `${this.#baseUrl}/games/${gameId}/platforms`;
    return this._http.get(url) as Observable<PlatformData>;
  } 

  addPlatform(gameId: string, platform: Platform): Observable<any> {
    const url = `${this.#baseUrl}/games/${gameId}/platforms`;
    const body = {
      name: platform.name,
      year: platform.year
    };
    return this._http.post(url, body) as Observable<any>;
  }

}

export class PlatformData {
  #data!: Platform[];
  get data(): Platform[] {return this.#data}
  set data(platforms: Platform[]) {this.#data = platforms}
} 

export class Platform {
  #_id!: string;
  #name!: string;
  #year!: number;

  get _id(): string {return this.#_id}
  get name(): string {return this.#name}
  get year(): number {return this.#year}

  set _id(id: string) {this.#_id = id}
  set name(name: string) {this.#name = name}
  set year(year: number) {this.#year = year}

  constructor(id: string, name: string, year: number) {
    this.#_id = id;
    this.#name = name;
    this.#year = year;
  }
}