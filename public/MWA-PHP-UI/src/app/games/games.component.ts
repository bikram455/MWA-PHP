import { Component, OnInit } from '@angular/core';
import { Game, GameData, GamesService } from '../games.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  games!: Game[];

  constructor(private _gamesService: GamesService) { }

  ngOnInit(): void {
    this.fetchGames();
  }

  fetchGames() {
    this._gamesService.fetchGames().subscribe(res => {
      this.games = res['data'];console.log('games are: ', res, this.games)
    }, err => {
      console.error(err);
    });
  }

  deleteGame(gameId: string) {
    this._gamesService.deleteGame(gameId).subscribe(res => {
      this.fetchGames();
    }, err => {
      console.error(err);
    });
  }
}
