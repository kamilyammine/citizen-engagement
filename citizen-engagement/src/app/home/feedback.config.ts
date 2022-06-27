export enum FeedbackPathType {
    ENVIRONMENT = 'environment',
    HEALTH = 'health',
    SOCIETY = 'society',
    TRAFFIC = 'traffic',
    OTHER = 'other'
}

export interface Location {
    latitude: number;
    longitude: number;
}

export const genderOptionsEn = [
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' }
];

export const userOptionsEn = [
    { value: 'Local Resident', label: 'Local Resident' },
    { value: 'Passer-by', label: 'Passer-by' },
    { value: 'Worker on site', label: 'Worker on site' },
    { value: 'other', label: 'Other' },
];

export const ageOptionsEn = [
    { value: '0 - 16', label: '0 - 16' },
    { value: '17 - 24', label: '17 - 24' },
    { value: '25 - 34', label: '25 - 34' },
    { value: '35 - 44', label: '35 - 44' },
    { value: '45 - 54', label: '45 - 54' },
    { value: '55 - 64', label: '55 - 64' },
    { value: '65+', label: '64+' },
    { value: 'Prefer not to say', label: 'Prefer not to say' }
];
export const genderOptionsAr = [
    { value: 'M', label: 'ذكر' },
    { value: 'F', label: 'أنثى' }
]

export const userOptionsAr = [
    { value: 'Local Resident', label: 'مقيم/ة محلي/ة' },
    { value: 'Passer-by', label: 'عابر/ة' },
    { value: 'Worker on site', label: 'عامل/ة في الموقع' },
    { value: 'other', label: 'آخر' },
];

export const ageOptionsAr = [
    { value: '0 - 16', label: '٠ - ١٦' },
    { value: '17 - 24', label: '١٧- ٢٤' },
    { value: '25 - 35', label: '٢٥ - ٣٤' },
    { value: '35 - 44', label: '٣٥ - ٤٤' },
    { value: '45 - 55', label: '٤٥ - ٥٤' },
    { value: '55 - 64', label: '٥٥ - ٦٤' },
    { value: '65+', label: '٦٥+' },
    { value: 'Prefer not to say', label: 'عدم الافصاح' },
];