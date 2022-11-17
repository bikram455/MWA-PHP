import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Platform, PlatformsService } from '../platforms.service';

@Component({
  selector: 'app-platforms',
  templateUrl: './platforms.component.html',
  styleUrls: ['./platforms.component.css']
})
export class PlatformsComponent implements OnInit {
  gameId!: string;
  addPlatformVisible: boolean = false;
  editPlatformBody!: Platform;
  @Input()
  platforms!: Platform[];
  @Input()
  editFlag!: boolean;
  @Output()
  fetchPlatformsEvent = new EventEmitter<string>;
  @Output()
  showEditEvent = new EventEmitter<Platform>;
  @ViewChild('editNameForm')
  editNameForm!: NgForm;
  @ViewChild('editYearForm')
  editYearForm!: NgForm;
  constructor(private _platformService: PlatformsService, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this.gameId = this._route.snapshot.url[1].path;
  }

  deletePlatform(platformId: string): void {
    this._platformService.deletePlatform(this.gameId, platformId).subscribe(res => {
      this.fetchPlatforms()
    }, err => {
      console.error(err);
    });
  }

  showEdit(platform: Platform): void {
    this.showEditEvent.emit(platform);
  }

  toggleAddPlatformVisibility(flag: boolean): void {console.log('toggle add platform view: ', flag)
    this.addPlatformVisible = flag;
  }

  fetchPlatforms(): void {
    this.fetchPlatformsEvent.emit();
  }

  _hideAllEdits(): void {
    this.platforms.forEach(item => {
      item.editName = false;
      item.editYear = false;
    })
  }
  showEditName(platform: Platform) {
    this._hideAllEdits();
    platform.editName = true;
  }

  hideEditName(platform: Platform) {
    platform.editName = false;
  }

  showEditYear(platform: Platform) {
    this._hideAllEdits();
    platform.editYear = true;
  }

  hideEditYear(platform: Platform) {
    platform.editYear = false;
  }

  updatePlatformName(platformBody: NgForm, platform: Platform): void {
    this._updatePartial(platform._id, platformBody.value);
  }
  
  updatePlatformReleasedYear(platformBody: NgForm, platform: Platform): void {
    this._updatePartial(platform._id, platformBody.value);
  }

  _updatePartial(platformId:string, platform: Platform): void {
    this._platformService.updatePlatformPartial(this.gameId, platformId, platform).subscribe(res => {
      this.fetchPlatforms();
    }, err => {
      console.error(err);
    });
  }
}
