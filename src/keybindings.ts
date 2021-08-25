import { filter, fromEvent, map, tap } from 'rxjs';
import { State } from './state';
import { Action } from './types';

export const KEYBINDINGS: Record<string, Action | undefined> = {
  'ArrowDown': 'next-letter',
  'ArrowUp': 'prev-letter',
  'ArrowRight': 'next-folder',
  'ArrowLeft': 'prev-folder',
  'd': 'toggle-deleted',
  'r': 'toggle-read',
};

const actions$ = fromEvent<KeyboardEvent>(document, 'keydown')
.pipe(
  map(event => KEYBINDINGS[event.key]),
  filter(event => event !== undefined),
  map(event => event as Action) // fixes type inference
);

export function actionHandlers$(state: State) {
  const ActionHandlers: Record<Action, Function> = {
    'next-folder': state.nextFolder,
    'prev-folder': state.prevFolder,
    'next-letter': state.nextLetter,
    'prev-letter': state.prevLetter,
    'toggle-deleted': state.toggleSelectedLetterDeleted,
    'toggle-read': state.toggleSelectedLetterRead,
  };

  return actions$.pipe(
    tap((action) => ActionHandlers[action]()),
  );
}
