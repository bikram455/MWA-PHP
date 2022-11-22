import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { RouterModule, Routes } from '@angular/router';
import { GamesComponent } from './games/games.component';
import { environment } from '../environments/environment';
import { ProfileComponent } from './profile/profile.component';
import { AddGameComponent } from './add-game/add-game.component';
import { RegisterComponent } from './register/register.component';
import { EditGameComponent } from './edit-game/edit-game.component';

const routes: Routes = [
    {path: environment.main, component: HomeComponent},
    {path: environment.game, component: GameComponent},
    {path: environment.games, component: GamesComponent},
    {path: environment.profile, component: ProfileComponent},
    {path: environment.addgame, component: AddGameComponent},
    {path: environment.register, component: RegisterComponent},
    {path: environment.editGame, component: EditGameComponent},
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}