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
  game: Game = new Game('', 'test game', 'test publisher', []);
  @ViewChild('editGameForm')
  editGameForm!: NgForm;
  constructor(private _route: ActivatedRoute, private _gameService: GamesService, private router: Router) { }

  ngOnInit(): void {
    this.#gameId = this._route.snapshot.params['gameId'];
    this.fetchGames();
  }

  fetchGames(): void {
    this._gameService.fetchGame(this.#gameId).subscribe(res => {
      this.game = res['data'];
    }, err => {
      console.error(err);
    });
  }

  editGame(gameBody: NgForm): void {
    this._gameService.updateGame(this.#gameId, gameBody.value).subscribe(res => {
      this.router.navigate([environment.gotogames]);
    }, err => {
      console.error(err);
    })
  }
}
