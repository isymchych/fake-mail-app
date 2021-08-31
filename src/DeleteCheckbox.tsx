import * as React from 'react';
import { filter, interval, map, mapTo, merge, of, Subject, switchMap, takeWhile, withLatestFrom } from 'rxjs';

const SECONDS_TO_CANCEL = 5;

interface IProps {
  isDeleted: boolean,
  toggleDelete: () => void,
}

interface IViewProps {
  willDelete: boolean,
  onClickCancel: () => void,
  secondsLeft: number,
  isDeleted: boolean,
  onChange: () => void,
}

function DeleteCheckboxView(props: IViewProps) {
  const {
    willDelete,
    onClickCancel,
    secondsLeft,
    isDeleted,
    onChange,
  } = props;

  return (
    <>
      {willDelete ? (
        <button
          type="button"
          onClick={onClickCancel}
        >
          Cancel ({secondsLeft})
        </button>

      ) : (
        <label>
          <input
            type="checkbox"
            checked={isDeleted}
            onChange={onChange}
          />

          Is deleted
        </label>
      )}
    </>
  );
}

export function DeleteCheckbox({ isDeleted, toggleDelete }: IProps) {
  const [isDeleted$] = React.useState(() => new Subject<boolean>());
  const [onChange$] = React.useState(() => new Subject<void>());
  const [onCancel$] = React.useState(() => new Subject<void>());

  const [willDelete, setWillDelete] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(SECONDS_TO_CANCEL);

  React.useEffect(() => {
    const willDelete$ = merge(
      onCancel$.pipe(mapTo(false)),
      onChange$.pipe(
        withLatestFrom(isDeleted$),
        filter(([_, isDeleted]) => !isDeleted),
        mapTo(true),
      ),
    );

    const secondsLeft$ = willDelete$.pipe(
      switchMap((willDelete) => {
        if (!willDelete) {
          return of(SECONDS_TO_CANCEL);
        }

        return interval(1000).pipe(
          map((value) => SECONDS_TO_CANCEL - value - 1),
          takeWhile(value => value >= 0),
        );
      }),
    );

    const toggleDeleteEffect$ = merge(
      onChange$.pipe(
        withLatestFrom(isDeleted$),
        filter(([_, isDeleted]) => isDeleted),
        mapTo(true),
      ),
      secondsLeft$.pipe(
        filter((secondsLeft) => secondsLeft === 0),
        mapTo(true),
      ),
    );

    const subs = [
      willDelete$.subscribe(setWillDelete),
      secondsLeft$.subscribe(setSecondsLeft),
      toggleDeleteEffect$.subscribe(toggleDelete),
    ];

    return () => subs.forEach(sub => sub.unsubscribe());
  }, [isDeleted$, onCancel$, onChange$, toggleDelete]);

  React.useEffect(() => isDeleted$.next(isDeleted), [isDeleted, isDeleted$]);

  return (
    <DeleteCheckboxView
      willDelete={willDelete}
      onClickCancel={() => onCancel$.next()}
      secondsLeft={secondsLeft}
      isDeleted={isDeleted}
      onChange={() => onChange$.next()}
    />
  );
}
