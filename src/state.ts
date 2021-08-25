import { map, mergeMap, switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { IFolder, ILetter } from './types';
import { genFakeLetters, sortLettersByDateDesc } from './utils';
import { FOLDERS } from './folders';

export class State {
  letters$ = new BehaviorSubject<ILetter[]>(genFakeLetters());
  selectedFolder$ = new BehaviorSubject<IFolder>(FOLDERS[0]);
  selectedLetterId$ = new BehaviorSubject<string | undefined>(undefined);

  selectedLetter$ = this.selectedLetterId$.pipe(
    switchMap(selectedLetterId => this.letters$.pipe(
      map((letters): ILetter | undefined => letters.find(letter => letter.id === selectedLetterId)),
    )),
  );

  visibleLetters$ = this.selectedFolder$.pipe(
    mergeMap((selectedFolder) =>
      this.letters$.pipe(
        map((letters): ILetter[] =>
          letters.filter(letter => selectedFolder.containsLetter(letter)).sort(sortLettersByDateDesc)
        )
      ),
    ),
  );

  markLetterRead(letterId: string, isRead: boolean): void {
    const letters = this.letters$.value.map((letter) => {
      if (letter.id !== letterId) {
        return letter;
      }

      return {
        ...letter,
        isRead,
      };
    });

    this.letters$.next(letters);
  }

  markLetterDeleted(letterId: string, isDeleted: boolean): void {
    const letters = this.letters$.value.map((letter) => {
      if (letter.id !== letterId) {
        return letter;
      }

      return {
        ...letter,
        isDeleted,
      };
    });

    this.letters$.next(letters);
  }
}
