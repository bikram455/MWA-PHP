import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Game, GamesService } from '../games.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-game',
  templateUrl: './edit-game.component.html',
  styleUrls: ['./edit-game.component.css']
})
export class EditGameComponent implements OnInit {
  #gameId!: string;
  game: Game = new Game(environment.main, environment.main, environment.main, []);
  @ViewChild(environment.editGameForm)
  editGameForm!: NgForm;
  get gameTitle(): string {return environment.gameTitle}
  get publisher(): string {return environment.publisher}
  get cancel(): string {return environment.cancel}
  get editGameText(): string {return environment.editGameText}
  formError: string = environment.main;
  constructor(private _route: ActivatedRoute, private _gameService: GamesService, private router: Router) { }

  ngOnInit(): void {
    this.#gameId = this._route.snapshot.params[environment.gameId];
    this.fetchGames();
  }

  fetchGames(): void {
    this._gameService.fetchGame(this.#gameId).subscribe({
      next: res => {
        this.game = res.data;
      }, error: err => {
        console.error(err);
      }
    });
  }

  editGame(gameBody: NgForm): void {
    if(gameBody.value.name === environment.main || gameBody.value.publisher === environment.main) {
      this.formError = environment.allFieldsRequired;
      return;
    }
    this._gameService.updateGame(this.#gameId, gameBody.value).subscribe({
      next: res => {
        this.router.navigate([environment.gotogames]);
      }, error: err => {
        console.error(err);
      }
    });
  }

  cancelEdit(): void {
    this.router.navigate([environment.gotogames]);
  }
}
