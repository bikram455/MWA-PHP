import { Component, OnInit } from '@angular/core';
import { Game, GameData, GamesService } from '../games.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  games!: Game[];
  currentPage: number = 0;
  totalPages!: number;
  pages: number[] = [];
  showModal: boolean = false;
  constructor(private _gamesService: GamesService) { }

  ngOnInit(): void {
    this.fetchGames();
  }

  fetchGames() {
    this._gamesService.fetchGames(this.currentPage).subscribe(res => {
      this.games = res['data'];console.log('games are: ', res, this.games)
      this.totalPages = parseInt((res['count'] / 5).toString());
      if(res['count'] % 5 == 0) {
        --this.totalPages;
      }
      for(let i = 0; i <= this.totalPages; i++) {
        this.pages[i] = i + 1;
      }
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

  getPrevious(): void {
    --this.currentPage;
    this.fetchGames();
  }

  getNext(): void {
    ++this.currentPage;
    this.fetchGames();
  }

  getPage(pageNumber: number) {
    this.currentPage = pageNumber - 1;
    this.fetchGames();
  }

  showAddGameModal(): void {
    this.showModal = true;
  }

  hideAddGameModal(): void {
    this.showModal = false;
  }
}
