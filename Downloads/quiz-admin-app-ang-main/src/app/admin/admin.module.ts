import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditPageComponent } from './pages/admin-page/edit-page/edit-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule } from '@angular/forms';
import { EditIcoComponent } from './components/ui/icons/edit-ico/edit-ico.component';
import { CancelIcoComponent } from './components/ui/icons/cancel-ico/cancel-ico.component';
import { DoneIcoComponent } from './components/ui/icons/done-ico/done-ico.component';
import { SendMessagePageComponent } from './pages/send-message-page/send-message-page.component';
import { AddedImagePageComponent } from './pages/added-image-page/added-image-page.component';
import { AddedPageComponent } from './pages/added-page/added-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { QuizAllPageComponent } from './pages/quiz-all-page/quiz-all-page.component';
import { QuizSinglePageComponent } from './pages/quiz-all-page/quiz-single-page/quiz-single-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { ImageUploadComponent } from './pages/added-image-page/image-upload/image-upload.component';
import { ImageTableComponent } from './pages/added-image-page/image-table/image-table.component';

@NgModule({
  declarations: [
    EditPageComponent,
    AdminPageComponent,
    EditIcoComponent,
    CancelIcoComponent,
    DoneIcoComponent,
    SendMessagePageComponent,
    AddedImagePageComponent,
    AddedPageComponent,
    ProfilePageComponent,
    QuizAllPageComponent,
    QuizSinglePageComponent,
    UsersPageComponent,
    AddedImagePageComponent,
    ImageUploadComponent,
    ImageTableComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    FormsModule
  ],
  exports: [
    EditPageComponent,
  ],

})
export class AdminModule { }