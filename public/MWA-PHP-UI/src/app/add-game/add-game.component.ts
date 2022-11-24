import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { GamesService } from '../games.service';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.css']
})
export class AddGameComponent implements OnInit {
  addGameForm!: FormGroup
  @Output()
  hideModal = new EventEmitter<void>;
  @Output()
  fetchGames = new EventEmitter<void>;
  constructor(private _formBuilder: FormBuilder, private _gamesService: GamesService, private _router: Router) {
    this._initializeForm();
  }

  _initializeForm(): void {
    this.addGameForm = this._formBuilder.group({
      name: [environment.main],
      publisher: [environment.main],
    });
  }

  ngOnInit(): void {
    
  }

  addGame() {
    this._gamesService.addGame(this.addGameForm.value).subscribe(res => {
      this._router.navigate([environment.games]);
      this.closeModal();
    }, err => {
      console.error(err);
    });
  }

  closeModal() {
    this._initializeForm();
    this.fetchGames.emit();
    this.hideModal.emit();
  }
}
