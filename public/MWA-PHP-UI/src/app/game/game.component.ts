import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game, GamesService } from '../games.service';
import { PlatformsService } from '../platforms.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game!: Game;
  #gameId!: string;
  addGameVisible: boolean = false;
  constructor(private _gamesService: GamesService, private _route: ActivatedRoute, private _platformService: PlatformsService) { }

  ngOnInit(): void {
    this.#gameId = this._route.snapshot.url[1].path;
    this.fetchGame();  
  }
  
  fetchGame() {
    this._gamesService.fetchGame(this.#gameId).subscribe(res => {
      this.game = res['data'];
    }, err => {
      console.error(err);
    });
  }
  
  fetchPlatforms() {
    this._platformService.fetchPlatforms(this.#gameId).subscribe(res => {
      this.game.platforms = res['data'];
      this.toggleAddPlatformVisibility(false);
    }, err => {
      console.error(err);
    });
  }

  deletePlatform(platformId: string): void {
    this._platformService.deletePlatform(this.#gameId, platformId).subscribe(res => {
      this.fetchPlatforms();
    }, err => {
      console.error(err);
    });
  }

  toggleAddPlatformVisibility(flag: boolean): void {
    this.addGameVisible = flag;
  }
}
