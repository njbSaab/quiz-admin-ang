import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { EditPageComponent } from './pages/admin-page/edit-page/edit-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { AddedImagePageComponent } from './pages/added-image-page/added-image-page.component';
import { AddedPageComponent } from './pages/added-page/added-page.component';
import { SendMessagePageComponent } from './pages/send-message-page/send-message-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { QuizAllPageComponent } from './pages/quiz-all-page/quiz-all-page.component';
import { QuizSinglePageComponent } from './pages/quiz-all-page/quiz-single-page/quiz-single-page.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    canActivate: [AuthGuard], // 👈 Защищаем модуль
    children: [
      { path: '', redirectTo: 'all-quizes', pathMatch: 'full' },
      { path: 'quizzes/:id', component: QuizSinglePageComponent },
      { path: 'all-quizes', component: QuizAllPageComponent },
      { path: 'edit-page', component: EditPageComponent },
      { path: 'users-page', component: UsersPageComponent },
      { path: 'added-image-page', component: AddedImagePageComponent },
      { path: 'added-page', component: AddedPageComponent },
      { path: 'send-message-page', component: SendMessagePageComponent },
      { path: 'profile-page', component: ProfilePageComponent  },
    ]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}