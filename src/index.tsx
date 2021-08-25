import React from 'react';
import ReactDOM from 'react-dom';
import { interval, startWith, switchMap } from 'rxjs';

import './index.css';
import { buildApp$ } from './ui';
import { State } from './state';
import { actionHandlers$ } from './keybindings';

const state = new State();

// TODO
// * clear selection after letter update if needed

actionHandlers$(state)
  .subscribe(action => console.log('action: %s', action));

// scroll selected letter into view
state.selectedLetter$.subscribe((letter) => {
  if (!letter) {
    return;
  }

  document.querySelector(`[data-letterid="${letter.id}"]`)?.scrollIntoView(false);
});

interval(60 * 1000).pipe(
  startWith(0),
  switchMap(() => buildApp$(state, new Date())),
).subscribe((app) => {
  ReactDOM.render(
    <React.StrictMode>
      {app}
    </React.StrictMode>,
    document.getElementById('root')
  );
});
