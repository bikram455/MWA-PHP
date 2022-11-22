import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  constructor(private _formBuilder: FormBuilder, private _platformService: PlatformsService) { }

  ngOnInit(): void {
    this.editForm = this._formBuilder.group({
      name: this.platform.name,
      year: this.platform.year
    });
  }

  editPlatform(): void {
    this._platformService.updatePlatform(this.gameId, this.platform._id, this.editForm.value).subscribe(res => {
      this.cancelEdit();
      this.reloadPlatforms.emit();
    }, err => {
      console.error(err);
    });
  }

  cancelEdit(): void {
    this.toggleView.emit();
  }
}
