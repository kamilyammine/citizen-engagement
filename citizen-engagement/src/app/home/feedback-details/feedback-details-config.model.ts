export interface FeedbackConfig {
    type: string,
    title:string,
    icon: string,
}

export interface FeedbackOption {
    title: string,
    title_en: string,
    icon: string,
    selected: boolean,
    selectedClass: string,
    descriptionArLb: string,
    descriptionEnUs: string,
    photoRequired: boolean


    key?: string,
}

export interface FeedbackItemResponse {
    key: string,
    nameEnUs: string,
    nameArLb: string,
    descriptionArLb: string,
    descriptionEnUs: string,
    photoRequired: boolean
}

export interface Kadaa {
    key: string,
    nameEnUs: string,
    nameArLb: string,
    descriptionEnUs: string,
    descriptionArLb: string
}

export interface Project {
    id: number,
    kadaaKey: string,
    latitude: number,
    longitude: number,
    name: string, // to remove
    description: string, //to remove
    nameEnUs: string,
    nameArLb: string,
    descriptionEnUs: string,
    descriptionArLb: string,

}

export interface Demographics {
    gender: string,
    ageRage: string,
    localResdient: boolean

}
