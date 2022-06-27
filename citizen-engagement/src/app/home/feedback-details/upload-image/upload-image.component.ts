import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { UploadImageData, UploadImageModel } from './upload-image.model';
declare var EXIF: any;

@Component({
    selector: 'app-upload-image',
    templateUrl: './upload-image.component.html',
    styleUrls: ['./upload-image.component.sass']
})

export class UploadImageComponent implements OnInit {
    @Input() lang: string = 'ar';
    @Input() imageRequired: boolean = true;
    @Output() fileSelected: EventEmitter<UploadImageModel[]> = new EventEmitter<UploadImageModel[]>();
    @ViewChildren('uploadedImg') uploadedImgElements: QueryList<ElementRef>;
    imagesUrls: any[] = [];
    selectedImages: UploadImageModel[] = null;
    imageExtensions = ['.jpg', '.jpeg', '.gif', '.png', '.bmp', '.tit'];

    constructor(
        private imageCompressService: NgxImageCompressService
    ) { }

    ngOnInit(): void {

    }

    onFileSelected(event) {
        this.imagesUrls = [];
        let images = <FileList>event.target.files;
        this.selectedImages = [];
        let totalSize = 0;
        if (images.length > 5) {
            images = null;
            alert("A maximum of 5 images are accepted");
            return;
        }
        Array.from(images).forEach((file, index) => {
            if (file.size / 1024 / 1024 > 10) {
                if (this.lang === 'ar') {
                    alert('لا يمكن أن يكون حجم الملف أكبر من ١٠ ميغا بايت');
                } else {
                    alert('File size cannot be greater than 10MB');
                }
                return;
            } else {
                totalSize += file.size / 1024 / 1024
                if (totalSize > 20) {
                    this.lang === 'ar' ? alert('لا يمكن أن يتجاوز مجموع الملفات الإجمالية ٢٠ ميغا بايت') : alert('The sum of the total files cannot exceed 20MBs');
                    this.imagesUrls = [];
                    return;
                } else {
                    let mimeType = file.type;
                    let url = null;
                    if (mimeType.match(/video\/*/)) {
                        url = 'video';
                    }
                    let filename = file.name;
                    let fileExt = ".";
                    fileExt += filename.split('.').pop();
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (eve: any) => {
                        if (url == 'video' && totalSize < 20) {
                            this.selectedImages.push({ file: file });
                            this.imagesUrls.push(url)
                        }
                        else if (totalSize < 20) {
                            this.imagesUrls.push(reader.result);

                            setTimeout(() => {
                                this.getData(index, file.name);
                            }, 1000);

                            if (this.imageExtensions.includes(fileExt) && file.size / 1024 / 1024 > 1) {
                                this.compressFile(eve.target.result, filename, file.type);
                            }
                            else {
                                this.selectedImages.push({ file: file });
                            }
                        }
                    }
                }
            }
        });
        this.fileSelected.emit(this.selectedImages);
    }

    private compressFile(image, fileName, fileType) {
        var orientation = -1;
        this.imageCompressService.compressFile(image, orientation, 50, 50).then(
            result => {
                const imageBlob = this.dataURItoBlob(result.split(',')[1], fileType);
                let file = new File([imageBlob], fileName, { type: fileType });
                this.selectedImages.push({ file: file });
                this.fileSelected.emit(this.selectedImages);
            });

    }

    getData(index, filename) {
        let allMetaData: any;
        let el = this.uploadedImgElements.toArray();
        EXIF.getData(el[index].nativeElement, () => {
            allMetaData = EXIF.getAllTags(el[index].nativeElement);
        });
        let ind = this.selectedImages.findIndex(f => f.file.name === filename);
        if (ind > -1
            && allMetaData
            && allMetaData.GPSLatitudeRef
            && allMetaData.GPSLongitudeRef
            && allMetaData.GPSLatitude
            && allMetaData.GPSLongitude) {
            this.selectedImages[ind].data = new UploadImageData(filename, allMetaData.GPSLatitudeRef, allMetaData.GPSLatitude, allMetaData.GPSLongitudeRef, allMetaData.GPSLongitude);
        }
        
        this.fileSelected.emit(this.selectedImages);

        //GPSLatitude and GPSLongitude should be sent
    }

    dataURItoBlob(dataURI, fileType) {
        const byteString = window.atob(dataURI);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([int8Array], { type: fileType });
        return blob;
    }

    public clearImages() {
        this.selectedImages = null;
        this.imagesUrls = [];
        this.fileSelected.emit(this.selectedImages);
    }

    // private convertDMSFormatToDecimalDegrees(dms: string, cardinalDirection: string)
    // {
    //     /*----------------------------------------------------------+
    //     |   DMS format will be something like N 33° 53' 24.79"      |
    //     |   or E 35° 31' 15.58".  We want to convert these to       |
    //     |   something like 33.890219, called decimal degrees.       |
    //     +----------------------------------------------------------*/

    //     let hours: string = dms.substring(0, dms.indexOf('°')).trim();
    //     let minutes: string = dms.substring(dms.indexOf('°') + 1, dms.indexOf('\'')).trim();
    //     let seconds: string = dms.substring(dms.indexOf('\'') + 1, dms.indexOf('"')).trim();

    //     /*----------------------------------------------------------+
    //     |   There are 60 minutes in each hour (or degree) and 60    |
    //     |   seconds in each minute, for a total of 3600 seconds in  |
    //     |   each degree.  Calculate minutes and seconds to come up  |
    //     |   with the decimal degree                                 |
    //     +----------------------------------------------------------*/

    //     let hoursDbl: number = Number(hours);
    //     let minutesDbl: number = Number(minutes);
    //     let secondsDbl: number = Number(seconds);

    //     let decimalDegree = hoursDbl + ((minutesDbl * 60 + secondsDbl) / 3600);

    //     /*----------------------------------------------------------+
    //     |   Decimal Degree format doesn't have cardinal directions  |
    //     |   like N, S, E, W.  West and South are negative values    |
    //     +----------------------------------------------------------*/
    //     if (cardinalDirection.toLowerCase().includes('w') || cardinalDirection.toLowerCase().includes('s'))
    //         decimalDegree = -decimalDegree;

    //     return decimalDegree;
    // }
}
