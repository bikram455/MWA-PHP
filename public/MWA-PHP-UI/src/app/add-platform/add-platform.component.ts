import { Output, Component, OnInit, EventEmitter, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Platform, PlatformsService } from '../platforms.service';

@Component({
  selector: 'app-add-platform',
  templateUrl: './add-platform.component.html',
  styleUrls: ['./add-platform.component.css']
})
export class AddPlatformComponent implements OnInit {
  platformBody: Platform = new Platform('', '', NaN);
  @Input()
  gameId!: string;
  @Output()
  reloadPlatforms =new EventEmitter<void>;
  @Output()
  hideAddPlatform = new EventEmitter<boolean>;
  @ViewChild('platForm')
  platForm!: NgForm;
  constructor(private _platformService: PlatformsService) { }

  ngOnInit(): void {
    console.log('emmitting event from child', this.gameId);
  }

  clearFields(): void {
    this.platformBody.name = '';
    this.platformBody.year = NaN;
  }

  addPlatform(dataBody: NgForm) {
    this._platformService.addPlatform(this.gameId, dataBody.value).subscribe(res => {
      this.clearFields();
      this.reloadPlatforms.emit();
    }, err => {
      console.error(err);
    });
  }

  hideAddPlatformBody(): void {
    this.hideAddPlatform.emit(false);
  }

}

