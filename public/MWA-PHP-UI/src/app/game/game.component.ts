import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
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
  addPlatformVisible: boolean = false;
  editPlatformFlag: boolean = false;
  editPlatform!: Platform;
  editGameNameFlag: boolean = false;
  editGamePublisherFlag: boolean = false;
  get gameTitle(): string {return environment.gameTitle}
  get publisher(): string {return environment.publisher}
  constructor(private _gamesService: GamesService, private _route: ActivatedRoute, private _platformService: PlatformsService) { }

  ngOnInit(): void {
    this.#gameId = this._route.snapshot.params[environment.gameId];
    this.fetchGame();  
  }
  
  fetchGame() {
    this._gamesService.fetchGame(this.#gameId).subscribe({
      next: res => {
        this.game = res.data;
        this.editGamebody= new Game(environment.main, this.game.name, this.game.publisher, environment.emptyArray);
        this._setEditNameAndYear();
      }, error: err => {
        console.error(err);
      }
    });
  }

  _setEditNameAndYear(): void {
    this.game.platforms.forEach(item => {
      item.updatedName = item.name;
      item.updatedYear = item.year;
    });
  }
  
  fetchPlatforms() {
    this._platformService.fetchPlatforms(this.#gameId).subscribe({
      next: res => {
        this.game.platforms = res.data;
        this._setEditNameAndYear();
        this.toggleAddPlatformVisibility(false);
      }, error: err => {
        console.error(err);
      }
    });
  }

  toggleAddPlatformVisibility(flag: boolean): void {
    this.addPlatformVisible = flag;
  }

  showEdit(platform: Platform): void {
    this.editPlatformFlag = true;
    this.editPlatform = platform;
  }

  hideEdit(): void {
    this.editPlatformFlag = environment.false;
  }


  editGameName(game: NgForm): void {
    this._gamesService.updateGamePartial(this.#gameId, game.value).subscribe({
      next: res => {
        this.fetchGame();
      }, error: err => {
        console.error(err);
      }
    });
  }


  editGamePublisher(game: NgForm): void {
    this._gamesService.updateGamePartial(this.#gameId, game.value).subscribe({
      next: res => {
        this.fetchGame();
      }, error: err => {
        console.error(err);
      }
    });
  }
}
