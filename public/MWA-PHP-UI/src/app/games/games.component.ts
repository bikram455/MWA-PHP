import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication.service';
import { Game, GameData, GamesData, GamesService } from '../games.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  games!: Game[];
  currentPage: number = environment.zero;
  totalPages!: number;
  pages: number[] = [];
  showModal: boolean = false;
  editGamebody: Game = new Game(environment.main, environment.main, environment.main, environment.emptyArray);
  @ViewChild('nameForm')
  nameForm!: NgForm;
  @ViewChild('publisherForm')
  publisherForm!: NgForm;
  searchForm!: FormGroup;
  get loggedIn(): boolean {return this._auth.isLoggedIn}
  get addGame(): string {return environment.addGameText}
  get addNewGame(): string {return environment.addNewGame}
  get gameTitle(): string {return environment.gameTitle}
  get publisher(): string {return environment.publisher}
  constructor(private _gamesService: GamesService, private _formBuilder: FormBuilder, private _auth: AuthenticationService) { }

  ngOnInit(): void {
    this.fetchGames();
    this.searchForm = this._formBuilder.group({
      title: [environment.main, Validators.required]
    });
  }

  _paintGames(res: GamesData): void {
    this.games = res.data;
      this.totalPages = parseInt((res.count / environment.defaultCount).toString());
      if(res.count % environment.defaultCount == 0) {
        --this.totalPages;
      }
      for(let i = 0; i <= this.totalPages; i++) {
        this.pages[i] = i + 1;
      }
  }

  fetchGames() {
    this._gamesService.fetchGames(this.currentPage).subscribe({
      next: res => {
        this._paintGames(res);
      }, error: err => {
        console.error(err);
      }
    });
  }

  deleteGame(gameId: string) {
    this._gamesService.deleteGame(gameId).subscribe({
      next: res => {
        this.fetchGames();
      }, error: err => {
        console.error(err);
      }
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
    this._gamesService.updateGamePartial(gameId, game).subscribe({
      next: res => {
        this.hideEditName(game);
        this.fetchGames();
      }, error: err => {
        console.error(err);
      }
    });
  }

  editGameName(nameForm: NgForm, game: Game): void {
    if(nameForm.value.name === environment.main) {
      return;
    }
    this._updateGamePartial(game._id, nameForm.value);
  }

  editGamePublisher(publisherForm: NgForm, game: Game): void {
    if(publisherForm.value.publisher === environment.main) {
      return;
    }
    this._updateGamePartial(game._id, publisherForm.value);
  }

  _hideAll() {
    this.games.forEach(game => {
      game.editName = environment.false;
      game.editPublisher = environment.false;
    })
  }

  hideEditName(game: Game): void {
    game.editName = environment.false;
  }

  showEditName(game: Game): void {
    if(this.loggedIn) {
      this.editGamebody = game;
      this._hideAll();
      game.editName = environment.true;
    }
  }

  hideEditPublisher(game: Game) {
    game.editPublisher = environment.false;
  }

  showEditPublisher(game: Game): void {
    if(this.loggedIn){
      this.editGamebody = game;
      this._hideAll();
      game.editPublisher = environment.true;
    }
  }

  getRowClass(index: number): string {
    if(index % 2 === 0){
      return environment.tableLight;
    } else {
      return environment.tableSecondary;
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

  getModalClass() {
    if(this.showModal) {
      return environment.myModal;
    } else {
      return environment.main;
    }
  }
}
