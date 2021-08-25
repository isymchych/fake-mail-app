import { map, mergeMap, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { IFolder, ILetter } from './types';
import { genFakeLetters, sortLettersByDateDesc } from './utils';
import { FOLDERS } from './folders';

export class State {
  letters$ = new BehaviorSubject<ILetter[]>(genFakeLetters());
  selectedFolder$ = new BehaviorSubject<IFolder>(FOLDERS[0]);
  private selectedLetterId$ = new BehaviorSubject<string | undefined>(undefined);

  visibleLetters$ = this.selectedFolder$.pipe(
    mergeMap((selectedFolder) =>
      this.letters$.pipe(
        map((letters): ILetter[] =>
          letters.filter(letter => selectedFolder.containsLetter(letter)).sort(sortLettersByDateDesc)
        )
      ),
    ),
  );

  selectedLetter$ = this.selectedLetterId$.pipe(
    switchMap(selectedLetterId => this.visibleLetters$.pipe(
      map((letters): ILetter | undefined => letters.find(letter => letter.id === selectedLetterId)),
    )),
  );

  selectLetter(letter: ILetter): void {
    this.selectedLetterId$.next(letter.id);
  }

  selectFolder(folder: IFolder): void {
    this.selectedFolder$.next(folder);
  }

  toggleSelectedLetterRead(): void {
    combineLatest([this.letters$, this.selectedLetter$])
    .pipe(take(1))
    .subscribe({
      next: ([letters, selectedLetter]) => {
        if (!selectedLetter) {
          return;
        }

        this.letters$.next(letters.map((letter) => {
          if (letter === selectedLetter) {
            return {
              ...letter,
              isRead: !letter.isRead,
            };
          }

          return letter;
        }));
      },
    });
  }

  toggleSelectedLetterDeleted(): void {
    combineLatest([this.letters$, this.selectedLetter$])
    .pipe(take(1))
    .subscribe({
      next: ([letters, selectedLetter]) => {
        if (!selectedLetter) {
          return;
        }

        this.letters$.next(letters.map((letter) => {
          if (letter === selectedLetter) {
            return {
              ...letter,
              isDeleted: !letter.isDeleted,
            };
          }

          return letter;
        }));
      },
    });
  }

  nextLetter(): void {
    combineLatest([this.visibleLetters$, this.selectedLetter$])
    .pipe(take(1))
    .subscribe({
      next: ([visibleLetters, selectedLetter]) => {
        if (visibleLetters.length === 0) {
          return;
        }

        let nextPos = selectedLetter ? visibleLetters.indexOf(selectedLetter) + 1 : 0;
        if (nextPos === visibleLetters.length) {
          nextPos = 0;
        }

        this.selectLetter(visibleLetters[nextPos])
      },
    });
  }

  prevLetter(): void {
    combineLatest([this.visibleLetters$, this.selectedLetter$])
    .pipe(take(1))
    .subscribe({
      next: ([visibleLetters, selectedLetter]) => {
        if (visibleLetters.length === 0) {
          return;
        }

        let nextPos = selectedLetter ? visibleLetters.indexOf(selectedLetter) - 1 : 0;
        if (nextPos < 0) {
          nextPos = visibleLetters.length - 1;
        }

        this.selectLetter(visibleLetters[nextPos])
      },
    });
  }

  nextFolder(): void {
    const selectedFolder = this.selectedFolder$.value;

    let nextPos = FOLDERS.indexOf(selectedFolder) + 1;
    if (nextPos === FOLDERS.length) {
      nextPos = 0;
    }

    this.selectedFolder$.next(FOLDERS[nextPos]);
  }

  prevFolder(): void {
    const selectedFolder = this.selectedFolder$.value;

    let nextPos = FOLDERS.indexOf(selectedFolder) - 1;
    if (nextPos < 0) {
      nextPos = FOLDERS.length - 1;
    }

    this.selectedFolder$.next(FOLDERS[nextPos]);
  }
}
