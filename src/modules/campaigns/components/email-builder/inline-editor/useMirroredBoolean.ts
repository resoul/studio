import { useCallback, useRef, useState } from 'react';

type SetBooleanState = boolean | ((prev: boolean) => boolean);

export function useMirroredBoolean(initial = false) {
    const [state, setState] = useState(initial);
    const stateRef = useRef(initial);

    const setMirroredState = useCallback((nextState: SetBooleanState) => {
        setState(prev => {
            const next = typeof nextState === 'function' ? nextState(prev) : nextState;
            stateRef.current = next;
            return next;
        });
    }, []);

    return {
        state,
        stateRef,
        setState: setMirroredState,
    };
}
