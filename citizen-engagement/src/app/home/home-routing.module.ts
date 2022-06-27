import { FeedbackService } from './feedback.service';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { FeedbackDetailsComponent } from './feedback-details/feedback-details.component';
import { FeedbackPathType } from './feedback.config';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      {path: '', redirectTo: 'main', pathMatch: 'full'},
      {path: 'main', component: FeedbackListComponent },
      // {path: 'feedback/:type', component: FeedbackDetailsComponent},
      {path: 'feedback', children: [
       { path: FeedbackPathType.ENVIRONMENT, component: FeedbackDetailsComponent, data: {type: FeedbackPathType.ENVIRONMENT} },
       { path: FeedbackPathType.HEALTH, component: FeedbackDetailsComponent, data: {type: FeedbackPathType.HEALTH} },
       { path: FeedbackPathType.TRAFFIC, component: FeedbackDetailsComponent, data: {type: FeedbackPathType.TRAFFIC} },
       { path: FeedbackPathType.SOCIETY, component: FeedbackDetailsComponent, data: {type: FeedbackPathType.SOCIETY} },
       { path: FeedbackPathType.OTHER, component: FeedbackDetailsComponent, data: {type: FeedbackPathType.OTHER} },

      ]},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [FeedbackService]
})
export class HomeRoutingModule { }
