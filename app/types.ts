import { ProficiencyLevelEnum } from '#constants/proficiency_level_enum'
import { GenderEnum } from '#constants/gender_enum'
import { UserRolesEnum } from '#constants/user_roles_enum'

export interface User {
  id: string
  email: string
  role: UserRolesEnum
  createdAt: string
  updatedAt: string
  lastActive: string
  banned: boolean
  online: boolean
  // ISO-639 language code
  language: string
  shadowBanned: boolean
  profile: Profile | null
  recommendation: Recommendation[]
  settings: Settings
  staffUser: boolean
  dashboardUser: boolean
  image: string
}

export interface NotificationSettings {
  messages: boolean
  followers: boolean
  officialLinks: boolean
}

export interface BackupSettings {
  enabled: boolean
  lastBackupDate?: string
  lastBackupSize?: string
}

export interface ChatsSettings {
  textSize: number
  handsetMode: boolean
  autoSaveMedia: boolean
  backup: BackupSettings
  returnToSend: boolean
  blockUnknownChats: boolean
}

export interface AgeRangeSettings {
  start: number
  end: number
}

export interface VisibilitySettings {
  exactLanguageMatch: boolean
  sameGenderOnly: boolean
  ageRange: AgeRangeSettings
  hideFromSearch: boolean
}

export interface PrivacySettings {
  showCity: boolean
  showRegion: boolean
  updateLocation: boolean
  showAge: boolean
  showOnlineStatus: boolean
  findByUsername: boolean
  findByEmail: boolean
  visibility: VisibilitySettings
  accountsHiddenLinks: string[] | null
  blacklist: string[] | null
}

export interface Settings {
  darkMode: boolean
  notifications: NotificationSettings
  chats: ChatsSettings
  privacy: PrivacySettings
  language: string
}

export interface Recommendation {
  user: User
  matchScore: number
}

export interface Location {
  country: string
  latitude: string
  longitude: string
}

export interface Profile {
  firstName: string
  lastName: string
  birthdate: string
  gender: GenderEnum
  location: Location
  nativeLanguages: Language[]
  targetLanguages: Language[]
  following: number // TODO: transition to User[]
  followers: number // TODO: transition to User[]
  links: number // TODO: transition to Link[]
  selfIntroduction: string
  audioIntroduction: string
}

export interface PartnerLanguage {
  languages: {
    [lang: string]: string
  }
}

export interface Language {
  name: string
  level: ProficiencyLevelEnum
}
