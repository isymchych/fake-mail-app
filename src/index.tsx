import React from 'react';
import ReactDOM from 'react-dom';
import { interval, startWith, switchMap } from 'rxjs';

import './index.css';
import { buildApp$ } from './ui';
import { State } from './state';
import { actionHandlers$ } from './keybindings';

const state = new State();

// TODO
// * scroll selected letter into view
// * clear selection on folder change
// * clear selection after letter update if needed

actionHandlers$(state)
  .subscribe(action => console.log('action: %s', action));

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
