import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlatformsService {
  constructor(private _http: HttpClient) { }

  deletePlatform(gameId: string, platformId: string): Observable<any> {
    const url = `${environment.baseUrl}${environment.gotogames}/${gameId}${environment.gotoPlatforms}/${platformId}`;
    return this._http.delete(url) as Observable<any>;
  }

  fetchPlatforms(gameId: string): Observable<PlatformData> {
    const url = `${environment.baseUrl}${environment.gotogames}/${gameId}${environment.gotoPlatforms}`;
    return this._http.get(url) as Observable<PlatformData>;
  } 

  addPlatform(gameId: string, platform: Platform): Observable<any> {
    const url = `${environment.baseUrl}${environment.gotogames}/${gameId}${environment.gotoPlatforms}`;
    const body = {
      name: platform.name,
      year: platform.year
    };
    return this._http.post(url, body) as Observable<any>;
  }
  
  updatePlatform(gameId: string, platformId: string, platform: Platform): Observable<any> {
    const url = `${environment.baseUrl}${environment.gotogames}/${gameId}${environment.gotoPlatforms}/${platformId}`;
    return this._http.put(url, platform) as Observable<any>;
  }

  updatePlatformPartial(gameId: string, platformId: string, platform: Platform): Observable<any> {
    const url = `${environment.baseUrl}${environment.gotogames}/${gameId}${environment.gotoPlatforms}/${platformId}`;
    return this._http.patch(url, platform) as Observable<any>;
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
  #updatedName!: string;
  #updatedYear!: number;
  #editName!: boolean;
  #editYear!: boolean;

  get _id(): string {return this.#_id}
  get name(): string {return this.#name}
  get year(): number {return this.#year}
  get updatedName(): string {return this.#updatedName}
  get updatedYear(): number {return this.#updatedYear}
  get editName(): boolean {return this.#editName}
  get editYear(): boolean {return this.#editYear}

  set _id(id: string) {this.#_id = id}
  set name(name: string) {this.#name = name}
  set year(year: number) {this.#year = year}
  set updatedName(name: string) {this.#updatedName = name}
  set updatedYear(year: number) {this.#updatedYear = year}
  set editName(editName: boolean) {this.#editName = editName}
  set editYear(editYear: boolean) {this.#editYear = editYear}

  constructor(id: string, name: string, year: number) {
    this.#_id = id;
    this.#name = name;
    this.#year = year;
    this.#editName = false;
    this.#editYear = false;
    this.#updatedName = name;
    this.#updatedYear = year;
  }
}