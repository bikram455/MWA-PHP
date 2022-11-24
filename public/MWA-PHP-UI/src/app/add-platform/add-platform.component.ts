import { Output, Component, OnInit, EventEmitter, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Platform, PlatformsService } from '../platforms.service';

@Component({
  selector: 'app-add-platform',
  templateUrl: './add-platform.component.html',
  styleUrls: ['./add-platform.component.css']
})
export class AddPlatformComponent implements OnInit {
  platformBody: Platform = new Platform(environment.main, environment.main, NaN);
  @Input()
  gameId!: string;
  @Output()
  reloadPlatforms =new EventEmitter<void>;
  @Output()
  hideAddPlatform = new EventEmitter<boolean>;
  @ViewChild(environment.platform)
  platForm!: NgForm;
  get platformName(): string {return environment.platformName};
  get releasedYear(): string {return environment.releasedYear};
  get addPlatformText(): string {return environment.addPlatform};
  get cancel(): string {return environment.cancel};
  get addNewPlatform(): string {return environment.addNewPlatform};
  constructor(private _platformService: PlatformsService) { }

  ngOnInit(): void {
  }

  clearFields(): void {
    this.platformBody.name = environment.main;
    this.platformBody.year = NaN;
  }

  addPlatform(dataBody: NgForm) {
    this._platformService.addPlatform(this.gameId, dataBody.value).subscribe({
      next: res => {
        this.clearFields();
        this.hideAddPlatformBody();
        this.reloadPlatforms.emit();
      }, error: err => {
        console.error(err);
      }
    });
  }

  hideAddPlatformBody(): void {
    this.hideAddPlatform.emit(false);
  }

}

