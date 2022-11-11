import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GamesService } from '../games.service';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.css']
})
export class AddGameComponent implements OnInit {
  addGameForm!: FormGroup
  constructor(private _formBuilder: FormBuilder, private _gamesService: GamesService, private _router: Router) {
    this.addGameForm = this._formBuilder.group({
      name: [''],
      publisher: [''],
    });
  }

  ngOnInit(): void {
    
  }

  addGame() {
    console.log(this.addGameForm.value);
    this._gamesService.addGame(this.addGameForm.value).subscribe(res => {
      this._router.navigate(['games']);
    }, err => {
      console.error(err);
    });
  }

}
