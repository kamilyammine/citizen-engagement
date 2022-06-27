export interface Language {
    key: string,
    value: string,
    selected: boolean
}

export const languageOptions: Language[] = [
  {key: 'ar', value: 'عربية', selected: false}, 
  {key: 'en', value: 'English', selected: false}
]