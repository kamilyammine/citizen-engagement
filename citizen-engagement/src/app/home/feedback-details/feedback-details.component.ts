import { MessageDialogComponent } from './../message-dialog/message-dialog.component';
import { Location, genderOptionsEn, userOptionsEn, ageOptionsEn, genderOptionsAr, userOptionsAr, ageOptionsAr } from './../feedback.config';
import { DemographicsDialogComponent } from './../demographics-dialog/demographics-dialog.component';
import { FeedbackService } from './../feedback.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackConfig, FeedbackOption, FeedbackItemResponse, Kadaa, Project, Demographics } from './feedback-details-config.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogDataModel } from 'src/app/shared/models/dialog-data.model';
import { noEmptySpace } from 'src/app/shared/validators/customLengthValidator.validator';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { UploadImageModel } from './upload-image/upload-image.model';

@Component({
  selector: 'app-feedback-details',
  templateUrl: './feedback-details.component.html',
  styleUrls: ['./feedback-details.component.sass']
})
export class FeedbackDetailsComponent implements OnInit {
  @ViewChild('uploadImage') uploadImageElement: UploadImageComponent;
  selectedImages: UploadImageModel[] = null;
  feedbackConfig: FeedbackConfig;
  lat: string;
  long: string;
  locationAllowed = false;
  currentOptions: FeedbackOption[];
  form: FormGroup;
  lang: string = 'ar';
  isSelectedOption = false;
  description_en: string;
  description_ar: string;
  kadaas: Kadaa[];
  projects: Project[];
  filteredProjects: Project[];
  selectedKadaaKey: string;
  searchValue = '';
  imageRequired: boolean = true;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private feedbackService: FeedbackService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.fetchData();
    this.lang = this.translate.defaultLang;
    this.translate.onDefaultLangChange.subscribe(changed => {
      this.searchValue = '';
      this.lang = this.translate.defaultLang;
    });
    this.route.url.subscribe(() => {
      const type = this.route.snapshot.data.type;
      this.feedbackConfig = this.handleType(type);

      if (type === 'other') {
        this.isSelectedOption = true;
      } else {
        this.feedbackService.getKeys().subscribe(res => {
          this.handleResponse(type, res);
        })
      }
      this.initForm();
    })

  }

  initForm() {
    this.form = this.fb.group({
      comment: [null, [Validators.required, noEmptySpace()]],
      project: [null, Validators.required],
    })

  }

  addFile(event: UploadImageModel[]) {
    this.selectedImages = event;
  }

  selectKadaa(key: any) {
    this.searchValue = '';
    this.selectedKadaaKey = key;
    this.selectedKadaaKey ? this.filteredProjects = this.projects?.filter(x => x.kadaaKey == key) : this.filteredProjects = this.projects;
    this.form.controls.project.setValue(null);
    if (!this.filteredProjects || this.filteredProjects.length == 0) {
      this.form.controls.project.disable();
    } else this.form.controls.project.enable();
  }

  openMessageDialog(navigateBack = false, code = null) {
    let dialogRef;
    if (code) {
      dialogRef = this.dialog.open(MessageDialogComponent, { data: code, width: "80%", maxWidth: '500px' });
    } else {
      dialogRef = this.dialog.open(MessageDialogComponent, { width: "80%", maxWidth: '650px', });
    }
    dialogRef.afterClosed().subscribe(() => {
      navigateBack ? this.navigateBack() : null;
    })
  }

  openDemographics(item?: Demographics) {
    let genderOptions = [];
    let userOptions = [];
    let ageOptions = [];
    if (this.lang === 'en') {
      genderOptions = genderOptionsEn;
      userOptions = userOptionsEn;
      ageOptions = ageOptionsEn;
    } else {
      genderOptions = genderOptionsAr;
      userOptions = userOptionsAr;
      ageOptions = ageOptionsAr;
    }

    const dialogRef = this.dialog.open(DemographicsDialogComponent, {
      disableClose: true,
      width: "80%",
      maxWidth: '650px',
      data: new DialogDataModel<Demographics>(
        item,
        {
          genderOptions: genderOptions,
          ageOptions: ageOptions,
          userOptions: userOptions,
        },
        this.lang,
        this.feedbackConfig.type
      ),
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const fd = new FormData();
        if (this.feedbackConfig.type === 'other') {
          fd.append('categoryItemKey', 'OTH-O');
        } else {
          const keysArr = []
          this.currentOptions.forEach(x => x.selected ? keysArr.push(x.key) : null);
          const keys = keysArr.join(",");
          fd.append('categoryItemKey', keys);
        }
        result.ageRange ? fd.append('ageRange', result.ageRange) : null;
        result.gender ? fd.append('gender', result.gender) : null;
        result.userType ? fd.append('userType', result.userType) : null;
        result.firstName ? fd.append('firstName', result.firstName) : null;
        result.lastName ? fd.append('lastName', result.lastName) : null;
        result.address ? fd.append('address', result.address) : null;
        result.email ? fd.append('email', result.email) : null;
        result.phone ? fd.append('phone', result.phone) : null;
        if (result.userType === 'other') {
          fd.append('userTypeOther ', result.other);
        }
        fd.append('projectId', "" + this.form.getRawValue().project);
        fd.append('comment', this.form.getRawValue().comment);
        if (this.selectedImages) {
          this.selectedImages.forEach(im => {
            if (im.file.size / 1024 / 1024 < 10) {
              fd.append('fileList', im.file);
              if(im.data){
                fd.append('imageLatLongData', im.data.value);
              }
            }
          });
        }
        if (this.locationAllowed) {
          fd.append('latitude', this.lat)
          fd.append('longitude', this.long)
        }
        this.feedbackService.sendFeedback(fd).subscribe(() => {
          this.openMessageDialog(true);
        }, err => {

          if (err?.code === "photo_not_in_proximity" || err?.code === "photo_not_geotagged") {
            this.openMessageDialog(false, err.code);
            this.uploadImageElement.clearImages();
          } else {
            this.openMessageDialog(false, "unexpected_error");
            this.uploadImageElement.clearImages();
          }
        })
      }
    });
  }
  fetchData() {
    this.feedbackService.getKadaas().subscribe(res => {
      this.kadaas = res.body;
    })
    this.feedbackService.getProjects().subscribe(res => {
      this.projects = res.body.content;
      this.filteredProjects = res.body.content;
    })
    navigator.geolocation.getCurrentPosition(res => {
      this.locationAllowed = true;
      this.long = "" + res.coords.longitude
      this.lat = "" + res.coords.latitude
      const location: Location = { latitude: +this.lat, longitude: +this.long }
      this.feedbackService.getProjects(location).subscribe(res => {
        let closestProject = res.body[0];
        this.selectKadaa(closestProject.kadaaKey);
        this.form.controls['project'].patchValue(closestProject.id)
      })

    }, () => {
      this.locationAllowed = false;
    });
  }

  handleType(type: string): FeedbackConfig {
    let feedbackConfig: FeedbackConfig;
    feedbackConfig = {
      type: type,
      title: `feedback_details.${type}_title`,
      icon: `assets/images/${type}-options/${type}.svg`,
    }
    return feedbackConfig
  }

  handleResponse(type: string, res: any) {
    let data: any;

    switch (type) {
      case 'environment':
        data = res.body.ET;
        break;
      case 'traffic':
        data = res.body.TA;
        break;
      case 'society':
        data = res.body.ST;
        break;
      case 'health':
        data = res.body.PHS;
        break;
    }
    //temp condition until we remove from backend
    let dataWihtoutOther = data.filter((x: FeedbackItemResponse) => x.nameEnUs !== 'Other');

    this.currentOptions = [];
    dataWihtoutOther.forEach((x: FeedbackItemResponse) => {
      let optionToPush: FeedbackOption = {
        title: x.nameArLb,
        title_en: x.nameEnUs,
        icon: `assets/images/${type}-options/${x.key}.svg`,
        selected: false,
        selectedClass: `${type}_selected`,
        descriptionArLb: x.descriptionArLb,
        descriptionEnUs: x.descriptionEnUs,
        photoRequired: x.photoRequired,
        key: x.key
      }
      this.currentOptions.push(optionToPush);
    })
  }

  selectOption(index: number) {
    this.form.get('comment').reset();
    // this.selectedKadaaKey = null;
    if (this.currentOptions[index].selected) {
      this.currentOptions[index].selected = false;
      this.form.markAsPristine();
      this.description_en = null;
      this.description_ar = null;
      this.isSelectedOption = false;
    } else {
      this.unSelectAll();
      this.description_en = this.currentOptions[index].descriptionEnUs;
      this.description_ar = this.currentOptions[index].descriptionArLb
      this.currentOptions[index].selected = !this.currentOptions[index].selected
      this.form.markAsDirty();
      this.isSelectedOption = true;
      this.imageRequired = this.currentOptions[index].photoRequired;
    }
  }

  setDefaultPic(index: number) {
    if (this.currentOptions && this.currentOptions.length > 0) {
      if (this.feedbackConfig.type == 'traffic') {
        this.currentOptions[index].icon = `assets/images/${this.feedbackConfig.type}-options/${this.feedbackConfig.type}2.svg`
      } else this.currentOptions[index].icon = `assets/images/${this.feedbackConfig.type}-options/${this.feedbackConfig.type}.svg`
    }
  }

  unSelectAll() {
    if (this.feedbackConfig.type !== 'other') {
      this.currentOptions.forEach(item => item.selected = false);
    }
    this.form.markAsPristine();
  }

  navigateBack() {
    this.router.navigate(['../../main'], { relativeTo: this.route, queryParamsHandling: "merge" })
  }

  handleInput(event: KeyboardEvent): void {
    event.stopPropagation();
  }

  // Unsued methods

  // private _filter(name: string): Project[] {
  //   const filterValue = name.toLowerCase();
  //   if (this.lang == 'ar') {
  //     return this.filteredProjects.filter(option => option.descriptionArLb.toLowerCase().includes(filterValue));
  //   }
  //   return this.filteredProjects.filter(option => option.descriptionEnUs.toLowerCase().includes(filterValue));
  // }

  // displayProjectName(project: Project): string {
  //   if (this.lang == 'ar') {
  //     return project && project.descriptionArLb ? project.descriptionArLb : '';
  //   }
  //   return project && project.descriptionEnUs ? project.descriptionEnUs : '';
  // }

  // Inside initForm
  // this.autocompleteProjects = this.form.controls.project.valueChanges.pipe(
  //   startWith(''),
  //   map(value => typeof value === 'string' ? value : value?.name),
  //   map(name => name ? this._filter(name) : this.filteredProjects?.slice())
  // );
  // this.form.controls.project.valueChanges.subscribe(v => {
  //   v?.id ? this.validProject = true : this.validProject = false;
  // })


}
