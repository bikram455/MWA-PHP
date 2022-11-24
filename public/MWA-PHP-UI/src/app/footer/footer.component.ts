import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  get date(): Date {return new Date}
  get comproLink(): string {return environment.comproLink}
  get footerText(): string {return environment.footerText}
  get footerImage(): string {return environment.footerImage}
  get miuComprotext(): string {return environment.miuCompro}
  get copyRight(): string {return String.fromCharCode(parseInt(environment.copyRight))}
  constructor() { }

  ngOnInit(): void {
  }

}
