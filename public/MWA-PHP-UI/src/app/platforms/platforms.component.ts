import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
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
  get isLoggedIn(): boolean { return this._auth.isLoggedIn }
  constructor(private _platformService: PlatformsService, private _route: ActivatedRoute, private _auth: AuthenticationService) { }

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

  toggleAddPlatformVisibility(flag: boolean): void {
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
    if (this.isLoggedIn) {
      this._hideAllEdits();
      platform.editName = true;
    }
  }

  hideEditName(platform: Platform) {
    platform.editName = false;
  }

  showEditYear(platform: Platform) {
    if (this.isLoggedIn) {
      this._hideAllEdits();
      platform.editYear = true;
    }
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

  _updatePartial(platformId: string, platform: Platform): void {
    this._platformService.updatePlatformPartial(this.gameId, platformId, platform).subscribe(res => {
      this.fetchPlatforms();
    }, err => {
      console.error(err);
    });
  }

  getRowClass(index: number): string {
    return (index % 2) === 0 ? 'table-light' : 'table-secondary'
  }

  showTable(): boolean {
    return this.platforms.length > 0;
  }

  showMessage(): boolean {
    return this.platforms.length > 0;
  }
}
