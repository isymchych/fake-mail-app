import { IFolder, ILetter } from './types';

export const FOLDERS: IFolder[] = [
  {
    name: 'Inbox',
    containsLetter(letter: ILetter): boolean {
      return !letter.isRead && !letter.isDeleted;
    }
  },
  {
    name: 'Read',
    containsLetter(letter: ILetter): boolean {
      return letter.isRead;
    }
  },
  {
    name: 'All',
    containsLetter(_letter: ILetter): boolean {
      return true;
    }
  },
  {
    name: 'Deleted',
    containsLetter(letter: ILetter): boolean {
      return letter.isDeleted;
    }
  },
];
