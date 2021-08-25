import { map, mergeMap } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import classNames from 'classnames';
import { formatRelative } from 'date-fns';
import { FOLDERS, State } from './state';

export function buildApp$(state: State, currentDate: Date): Observable<JSX.Element> {
  const {
    selectedFolder$,
    letters$,
    visibleLetters$,
    selectedLetterId$,
    selectedLetter$,
  } = state;

  const foldersUI$ = combineLatest([selectedFolder$, letters$]).pipe(
    map(([selectedFolder, letters]) => FOLDERS.map((folder) => {
      const letterCount = letters.filter(letter => folder.containsLetter(letter)).length;

      return (
        <div
          key={folder.name}
          className={classNames('folder', { 'is-selected': folder === selectedFolder })}
          onClick={() => selectedFolder$.next(folder)}
        >
          {folder.name} <small>{letterCount}</small>
        </div>
      )
    })),
  );

  const lettersUI$ = selectedLetterId$.pipe(
    mergeMap((selectedLetterId) =>
      visibleLetters$.pipe(
        map((letters) => letters.map((letter) => (
          <li
            key={letter.id}
            className={classNames('letter', { 'is-selected': letter.id === selectedLetterId })}
            onClick={() => selectedLetterId$.next(letter.id)}
          >
            <div className="letter-from">
              {letter.from}
            </div>

            <div className="letter-subject">
              {letter.subject}
            </div>

            <div className="letter-date">
              {formatRelative(letter.date, currentDate)}
            </div>
          </li>
        ))),
      )
    ),
  );

  const selectedLetterUI$ = selectedLetter$.pipe(
    map((selectedLetter) => {
      if (!selectedLetter) {
        return null;
      }

      return (
        <>
          <div id="toolbar">
            <label>
              <input
                type="checkbox"
                checked={selectedLetter.isRead}
                onChange={el => state.markLetterRead(selectedLetter.id, el.target.checked)}
              />

              Is read
            </label>

            <label>
              <input
                type="checkbox"
                checked={selectedLetter.isDeleted}
                onChange={el => state.markLetterDeleted(selectedLetter.id, el.target.checked)}
              />

              Is deleted
            </label>
          </div>

          <article>
            <div className="letter-preview-from">
              <span className="label">FROM:</span> {selectedLetter.from}
            </div>
            <div className="letter-preview-date">
              <span className="label">DATE:</span> {formatRelative(selectedLetter.date, currentDate)}
            </div>
            <h1 className="letter-preview-subject">
              {selectedLetter.subject}
            </h1>
            <div className="letter-preview">
              {selectedLetter.preview}
            </div>
          </article>
        </>
      );
    })
  );

  const app$ = combineLatest([foldersUI$, lettersUI$, selectedLetterUI$])
    .pipe(
      map(([foldersUI, lettersUI, selectedLetterUI]) => (
        <div id="app">
          <aside>
            {foldersUI}
          </aside>

          <ul id="mail-list">
            {lettersUI}
          </ul>

          <div id="preview">
            {selectedLetterUI}
          </div>
        </div>
      )),
    );

  return app$;
}
