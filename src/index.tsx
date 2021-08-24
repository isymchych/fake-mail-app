import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { buildApp$ } from './ui';
import { State } from './state';

const state = new State();
state.start();

const app$ = buildApp$(state);

app$.subscribe({
  next(app) {
    ReactDOM.render(
      <React.StrictMode>
        {app}
      </React.StrictMode>,
      document.getElementById('root')
    )
  }
});
