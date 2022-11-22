import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Game, GameData, GamesData, GamesService } from '../games.service';

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
  editGamebody: Game = new Game('', '', '', []);
  @ViewChild('nameForm')
  nameForm!: NgForm;
  @ViewChild('publisherForm')
  publisherForm!: NgForm;
  searchForm!: FormGroup;
  get loggedIn(): boolean {return this._auth.isLoggedIn}
  constructor(private _gamesService: GamesService, private _formBuilder: FormBuilder, private _auth: AuthenticationService) { }

  ngOnInit(): void {
    this.fetchGames();
    this.searchForm = this._formBuilder.group({
      title: ['', Validators.required]
    });
  }

  _paintGames(res: GamesData): void {
    this.games = res['data'];
      this.totalPages = parseInt((res['count'] / 5).toString());
      if(res['count'] % 5 == 0) {
        --this.totalPages;
      }
      for(let i = 0; i <= this.totalPages; i++) {
        this.pages[i] = i + 1;
      }
  }

  fetchGames() {
    this._gamesService.fetchGames(this.currentPage).subscribe(res => {
      this._paintGames(res);
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

  _updateGamePartial(gameId: string, game: Game): void {
    this._gamesService.updateGamePartial(gameId, game).subscribe(res => {
      this.hideEditName(game);
      this.fetchGames();
    }, err => {
      console.error(err);
    });
  }

  editGameName(nameForm: NgForm, game: Game): void {
    this._updateGamePartial(game._id, nameForm.value);
  }

  editGamePublisher(publisherForm: NgForm, game: Game): void {
    this._updateGamePartial(game._id, publisherForm.value);
  }

  _hideAll() {
    this.games.forEach(game => {
      game.editName = false;
      game.editPublisher = false;
    })
  }

  hideEditName(game: Game): void {
    game.editName = false;
  }

  showEditName(game: Game): void {
    if(this.loggedIn) {
      this.editGamebody = game;
      this._hideAll();
      game.editName = true;
    }
  }

  hideEditPublisher(game: Game) {
    game.editPublisher = false;
  }

  showEditPublisher(game: Game): void {
    if(this.loggedIn){
      this.editGamebody = game;
      this._hideAll();
      game.editPublisher = true;
    }
  }

  getRowClass(index: number): string {
    if(index % 2 === 0){
      return 'table-light';
    } else {
      return 'table-secondary';
    }
  }

  search() {
    if(this.searchForm.invalid) {
      return;
    }
    this._gamesService.searchGames(this.searchForm.value.title).subscribe({
      next: (res) => {
        this._paintGames(res);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
