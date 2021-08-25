import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { buildApp$ } from './ui';
import { State } from './state';
import { interval, startWith, switchMap } from 'rxjs';

const state = new State();

interval(60 * 1000).pipe(
  startWith(0),
  switchMap(() => buildApp$(state, new Date())),
).subscribe({
  next(app) {
    ReactDOM.render(
      <React.StrictMode>
        {app}
      </React.StrictMode>,
      document.getElementById('root')
    )
  }
});
