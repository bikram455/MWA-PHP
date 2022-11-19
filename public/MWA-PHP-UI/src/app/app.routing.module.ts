import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { GamesComponent } from './games/games.component';
import { AddGameComponent } from './add-game/add-game.component';
import { compileNgModule } from '@angular/compiler';
import { EditGameComponent } from './edit-game/edit-game.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'games', component: GamesComponent},
    {path: 'game/:gameId', component: GameComponent},
    {path: 'add-game', component: AddGameComponent},
    {path: 'edit-game/:gameId', component: EditGameComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'profile', component: ProfileComponent},
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}