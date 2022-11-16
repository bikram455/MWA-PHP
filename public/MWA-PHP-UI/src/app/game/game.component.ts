import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Game, GamesService } from '../games.service';
import { Platform, PlatformsService } from '../platforms.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game!: Game;
  editGamebody!: Game;
  #gameId!: string;
  addGameVisible: boolean = false;
  editFlag: boolean = false;
  editPlatform!: Platform;
  editGameNameFlag: boolean = false;
  editGamePublisherFlag: boolean = false;
  constructor(private _gamesService: GamesService, private _route: ActivatedRoute, private _platformService: PlatformsService) { }

  ngOnInit(): void {
    this.#gameId = this._route.snapshot.url[1].path;
    this.fetchGame();  
  }
  
  fetchGame() {
    this._gamesService.fetchGame(this.#gameId).subscribe(res => {
      this.game = res['data'];
      this.editGamebody= new Game('', this.game.name, this.game.publisher, [])
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

  showEdit(platform: Platform): void {
    this.editFlag = true;
    this.editPlatform = platform;
  }

  hideEdit(): void {
    this.editFlag = false;
  }

  showEditName(): void {
    this.editGameNameFlag = true;
  }

  hideEditName(): void {
    this.editGameNameFlag = false;
  }

  editGameName(game: NgForm): void {
    console.log(game.value)
    this._gamesService.updateGamePartial(this.#gameId, game.value).subscribe(res => {
      this.hideEditName();
      this.fetchGame();
    }, err => {
      console.error(err);
    });
  }

  showEditPublisher(): void {
    this.editGamePublisherFlag = true;
  }

  hideEditPublisher(): void {
    this.editGamePublisherFlag = false;
  }

  editGamePublisher(game: NgForm): void {
    console.log(game.value)
    this._gamesService.updateGamePartial(this.#gameId, game.value).subscribe(res => {
      this.hideEditPublisher();
      this.fetchGame();
    }, err => {
      console.error(err);
    });
  }
}
