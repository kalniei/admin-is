import React, { createContext, useReducer } from 'react';

export type TSeverity = 'success' | 'error' | 'warning' | 'info';

export interface ISnackbarObj {
  message: string;
  severity: TSeverity;
  isOpen: boolean;
}

interface IAction {
  type: 'SET_SNACKBAR' | 'SET_INIT_STATE';
  payload: ISnackbarObj;
}

const reducer = (state: ISnackbarObj, action: IAction): ISnackbarObj => {
  switch (action.type) {
    case 'SET_SNACKBAR':
      return {
        ...state,
        ...action.payload
      };
    case 'SET_INIT_STATE': {
      return initState;
    }
    default:
      return state;
  }
};

const initState = {
  isOpen: false,
  message: '',
  severity: 'info' as TSeverity
};

const SnackbarProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initState);

  const value = { state, dispatch };
  return <SnackbarContext.Provider value={value}>{children}</SnackbarContext.Provider>;
};

export const SnackbarContext: any = createContext(initState);

export default SnackbarProvider;
