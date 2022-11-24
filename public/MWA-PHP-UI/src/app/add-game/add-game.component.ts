import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  get gameTitle(): string {return environment.gameTitle}
  get publisher(): string {return environment.publisher}
  formError: string = environment.main;
  get addGameText(): string {return environment.addGameText}
  get cancel(): string {return environment.cancel};
  constructor(private _formBuilder: FormBuilder, private _gamesService: GamesService, private _router: Router) {
    this._initializeForm();
  }

  _initializeForm(): void {
    this.addGameForm = this._formBuilder.group({
      name: [environment.main, Validators.required],
      publisher: [environment.main, Validators.required],
    });
    this.formError = environment.main;
  }

  ngOnInit(): void {
    
  }

  addGame() {
    if(this.addGameForm.invalid) {
      this.formError = environment.allFieldsRequired;
      return;
    }
    this._gamesService.addGame(this.addGameForm.value).subscribe({
      next: res => {
        this._router.navigate([environment.games]);
        this.closeModal();
      }, error: err => {
        console.error(err);
      }
    });
  }

  closeModal() {
    this._initializeForm();
    this.fetchGames.emit();
    this.hideModal.emit();
  }
}
