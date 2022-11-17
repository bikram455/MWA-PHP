import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GamesComponent } from './games/games.component';
import { GameComponent } from './game/game.component';
import { NavigateComponent } from './navigate/navigate.component';
import { FooterComponent } from './footer/footer.component';
import { AddGameComponent } from './add-game/add-game.component';
import { AppRoutingModule } from './app.routing.module';
import { AddPlatformComponent } from './add-platform/add-platform.component';
import { EditGameComponent } from './edit-game/edit-game.component';
import { EditPlatformComponent } from './edit-platform/edit-platform.component';
import { PlatformsComponent } from './platforms/platforms.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GamesComponent,
    GameComponent,
    NavigateComponent,
    FooterComponent,
    AddGameComponent,
    AddPlatformComponent,
    EditGameComponent,
    EditPlatformComponent,
    PlatformsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
