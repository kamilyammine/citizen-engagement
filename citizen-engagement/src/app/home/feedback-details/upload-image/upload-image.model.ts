export class UploadImageModel {
    constructor(
        public file: File,
        public data?: UploadImageData
    ) {
    }
}

export class UploadImageData {
    constructor(
        public filename?: string,
        public GPSLatitudeRef?: string,
        public GPSLatitude?: number[],
        public GPSLongitudeRef?: string,
        public GPSLongitude?: number[],
        public value?: string) {
        this.value = `${this.filename}+${this.GPSLatitudeRef}+${this.GPSLatitude.join('+')}+${this.GPSLongitudeRef}+${this.GPSLongitude.join('+')}`;
    }
}