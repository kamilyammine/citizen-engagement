import { ContactUsDialogComponent } from './../contact-us-dialog/contact-us-dialog.component';
import { Observable } from 'rxjs';
import { Location } from './../feedback.config';
import { languageOptions } from './../header/header.model';
import { FeedbackService } from './../feedback.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.sass']
})
export class FeedbackListComponent implements OnInit {
  languageOptions = languageOptions;
  isEnglish = false;
  projects: any;
  selectedProjectId: number;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    // navigator.geolocation.getCurrentPosition(res => {
    //   let currentLocation: Location = {
    //     longitude: res.coords.longitude,
    //     latitude: res.coords.latitude
    //   }
    //   this.feedbackService.getProjects(currentLocation).subscribe(res => {
    //     this.projects = res.body;
    //     this.selectedProjectId = this.projects[0].id;
    //   })
    // }, () => {
    //   this.feedbackService.getProjects().subscribe(res => {
    //     this.projects = res.body.content;
    //     this.selectedProjectId = this.projects[0].id;
    //   })
    // })

    this.route.queryParams.subscribe(queryParams => {
      if (queryParams && queryParams['lang']) {
        if( queryParams['lang'] == 'en'){
          this.isEnglish = true
        }
        else {
          this.isEnglish = false
        }
      } 
    });
  }

  navigate(destination: string){
    this.router.navigate([`feedback/${destination}`], {relativeTo: this.route.parent, queryParamsHandling: "merge"});
    
  }

  selectProject(id: any){
    this.selectedProjectId = id;
  }

  openLegalTerms(name) {
    window.open(`assets/docs/${name}.pdf`, "_blank");
  }

  openContactUs() {
    this.dialog.open(ContactUsDialogComponent);
  }


}
