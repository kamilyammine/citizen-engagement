import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './header/header.component';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';
import { FeedbackDetailsComponent } from './feedback-details/feedback-details.component';
import { FeedbackService } from './feedback.service';
import { DemographicsDialogComponent } from './demographics-dialog/demographics-dialog.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { ContactUsDialogComponent } from './contact-us-dialog/contact-us-dialog.component';
import { UploadImageComponent } from './feedback-details/upload-image/upload-image.component';
import { NgxImageCompressService } from 'ngx-image-compress';

@NgModule({
  declarations: [
    HomeComponent, 
    HeaderComponent, 
    FeedbackListComponent, 
    FeedbackDetailsComponent, 
    DemographicsDialogComponent, 
    MessageDialogComponent, 
    ContactUsDialogComponent,
    UploadImageComponent
  ],
  imports: [
    HomeRoutingModule,
    SharedModule
  ],
  providers: [FeedbackService, NgxImageCompressService]
})
export class HomeModule { }
