import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Platform, PlatformsService } from '../platforms.service';

@Component({
  selector: 'app-edit-platform',
  templateUrl: './edit-platform.component.html',
  styleUrls: ['./edit-platform.component.css']
})
export class EditPlatformComponent implements OnInit {
  editForm!: FormGroup;
  @Input()
  gameId!: string;
  @Input()
  platform!: Platform;
  @Output()
  toggleView = new EventEmitter<void>;
  @Output()
  reloadPlatforms = new EventEmitter<void>;
  formError: string = environment.main;
  get platformName(): string {return environment.platformName};
  get releasedYear(): string {return environment.releasedYear};
  get editPlatformText(): string {return environment.editPlatform};
  get cancel(): string {return environment.cancel};
  get edit(): string {return environment.edit};
  constructor(private _formBuilder: FormBuilder, private _platformService: PlatformsService) { }

  ngOnInit(): void {
    this.editForm = this._formBuilder.group({
      name: [this.platform.name, Validators.required],
      year: [this.platform.year, Validators.required]
    });
  }

  editPlatform(): void {
    if(this.editForm.invalid) {
      this.formError = environment.allFieldsRequired;
      return;
    }
    this.editForm.value.year = parseInt(this.editForm.value.year);
    this._platformService.updatePlatform(this.gameId, this.platform._id, this.editForm.value).subscribe({
      next: res => {
        this.cancelEdit();
        this.reloadPlatforms.emit();
      }, error: err => {
        console.error(err);
      }
    });
  }

  cancelEdit(): void {
    this.toggleView.emit();
  }
}
