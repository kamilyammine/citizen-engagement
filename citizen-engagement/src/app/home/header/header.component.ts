import { FeedbackService } from './../feedback.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Language, languageOptions } from './header.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  projectName: string;
  languageOptions = languageOptions;
  selectedLanguage: Language = this.languageOptions[0]
  innerWidth: number;
  type: string;
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private feedbackService: FeedbackService) { }

  navigateButton = false;
  ngOnInit(): void {
    this.route.url.subscribe(() => {
      const data = this.route.snapshot.data;
      this.type = data?.type
      data?.type ? this.navigateButton = true : this.navigateButton = false
    })

    this.route.queryParams.subscribe(queryParams => {
      if (queryParams && queryParams['lang']) {
        const index = this.languageOptions.findIndex(x => x.key == queryParams['lang']);
        if(index >= 0){
          this.selectedLanguage = this.languageOptions[index]
        }
        else {
          this.router.navigate([], {queryParams: {lang: 'ar'}})
          // window.location.reload();
        }
      }
      // this.dir = this.lang == 'ar' ? 'rtl' : 'ltr';
    });

    // this.route.params.subscribe(res => {
    //   if(+res.ref >= 0){
    //     const id = res.ref;
    //     this.feedbackService.getProjectById(id).subscribe(res => {
    //       if(res){
    //         this.projectName = res.body.name;
    //       }
    //     })
    //   }
    // })
    
  }

  navigateToHome() {
    this.router.navigate(['../../main'], { relativeTo: this.route, queryParamsHandling: "merge" })
  }

  select(pText :string)
  {
    this.selectedLanguage = this.languageOptions.find(x => x.key == pText);
    this.router.navigate([], {queryParams: {lang: this.selectedLanguage.key}} )

    // this.selected = pText;
  }

  @HostListener('window:resize', ['$event'])
  isMobile() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth >= 768) {
      return false;
    }
    return true;
  }


}
