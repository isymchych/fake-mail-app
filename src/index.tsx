import React from 'react';
import ReactDOM from 'react-dom';
import { interval, startWith, switchMap } from 'rxjs';

import './index.css';
import { buildApp$ } from './ui';
import { State } from './state';
import { actionHandlers$ } from './keybindings';

const state = new State();

// install keybindings
actionHandlers$(state)
  .subscribe(action => console.log('action: %s', action));

// scroll selected letter into view
state.selectedLetter$.subscribe((letter) => {
  if (!letter) {
    return;
  }

  document.querySelector(`[data-letterid="${letter.id}"]`)?.scrollIntoView(false);
});

// scroll mail list to top when switching folders
state.selectedFolder$.subscribe(() => {
  const listEl = document.getElementById('mail-list');

  if (listEl) {
    listEl.scrollTop = 0;
  }
});

// render UI
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
