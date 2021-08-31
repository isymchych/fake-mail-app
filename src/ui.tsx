import { map, mergeMap } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import classNames from 'classnames';
import { formatRelative } from 'date-fns';
import { State } from './state';
import { FOLDERS } from './folders';
import { KEYBINDINGS } from './keybindings';
import { DeleteCheckbox } from './DeleteCheckbox';

const keybindingsUI = (
  <table id="keybindings">
    <thead>
      <tr>
        <th>Key</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(KEYBINDINGS).map(([key, action]) => (
        <tr key={key}>
          <td>{key}</td>
          <td>{action}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export function buildApp$(state: State, currentDate: Date): Observable<JSX.Element> {
  const {
    selectedFolder$,
    letters$,
    visibleLetters$,
    selectedLetter$,
  } = state;

  const foldersUI$ = combineLatest([selectedFolder$, letters$]).pipe(
    map(([selectedFolder, letters]) => FOLDERS.map((folder) => {
      const letterCount = letters.filter(letter => folder.containsLetter(letter)).length;

      return (
        <div
          key={folder.name}
          className={classNames('folder', { 'is-selected': folder === selectedFolder })}
          onClick={() => state.selectFolder(folder)}
        >
          {folder.name} <small>{letterCount}</small>
        </div>
      )
    })),
  );

  const lettersUI$ = selectedLetter$.pipe(
    mergeMap((selectedLetter) =>
      visibleLetters$.pipe(
        map((letters) => letters.map((letter) => (
          <li
            key={letter.id}
            data-letterid={letter.id}
            className={classNames('letter', { 'is-selected': letter === selectedLetter })}
            onClick={() => state.selectLetter(letter)}
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
                onChange={() => state.toggleSelectedLetterRead()}
              />

              Is read
            </label>

            <DeleteCheckbox
              isDeleted={selectedLetter.isDeleted}
              toggleDelete={state.toggleSelectedLetterDeleted}
            />
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

          {keybindingsUI}
        </div>
      )),
    );

  return app$;
}
