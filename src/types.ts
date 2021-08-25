export interface IFolder {
  name: string
  containsLetter(letter: ILetter): boolean
}

export interface ILetter {
  id: string
  date: Date
  from: string
  subject: string
  preview: string
  isRead: boolean
  isDeleted: boolean
}

export type Action = 'next-letter' | 'prev-letter' | 'next-folder' | 'prev-folder' | 'toggle-deleted' | 'toggle-read';
