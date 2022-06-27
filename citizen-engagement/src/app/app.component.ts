import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  lang: string;
  dir = 'rtl';

  constructor(private translate: TranslateService,
    private route: ActivatedRoute
  ) {
    this.addGAScript();

    this.route.queryParams.subscribe(queryParams => {
      if (queryParams && queryParams['lang']) {
        this.lang = queryParams['lang'];
      }
      else {
        this.lang = 'ar';
      }
      this.translate.setDefaultLang(this.lang);
      this.dir = this.lang == 'ar' ? 'rtl' : 'ltr';
    });
  }

  ngOnInit(): void {
  }

  addGAScript() {
    let gtagScript: HTMLScriptElement = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + environment.GA_TRACKING_ID;
    document.head.prepend(gtagScript);
    /** Disable automatic page view hit to fix duplicate page view count  **/
    gtag('config', environment.GA_TRACKING_ID);
  }
}
