import * as React from 'react';

const SECONDS_TO_CANCEL = 5;

interface IProps {
  isDeleted: boolean,
  toggleDelete: () => void,
}

export function DeleteCheckbox({ isDeleted, toggleDelete }: IProps) {
  const [willDelete, setWillDelete] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(SECONDS_TO_CANCEL);

  React.useEffect(() => {
    if (!willDelete) {
      return;
    }

    if (isDeleted) {
      setWillDelete(false);
      return;
    }

    let secondsCounter = SECONDS_TO_CANCEL;

    const intervalId = setInterval(() => {
      secondsCounter -= 1;
      setSecondsLeft(secondsCounter);

      if (secondsCounter === 0) {
        toggleDelete();
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isDeleted, willDelete, toggleDelete]);

  return (
    <>
    {willDelete ? (
      <button
      type="button"
      onClick={() => setWillDelete(false)}
      >
      Cancel ({secondsLeft})
      </button>

    ) : (
      <label>
        <input
          type="checkbox"
          checked={isDeleted}
          onChange={isDeleted ? toggleDelete : () => setWillDelete(true)}
        />

        Is deleted
      </label>
    )}
    </>
  );
}
