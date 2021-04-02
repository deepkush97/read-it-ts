import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { User } from "../types";

interface State {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
}
interface Action {
  type: string;
  payload: any;
}

const StateContext = createContext<State>({
  user: null,
  authenticated: false,
  loading: false,
});

const DispatchContext = createContext(null);

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
    case "STOP_LOADING":
      return {
        ...state,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    default:
      throw new Error(`Unknown Action Type : ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  });

  const dispatch = (type: string, payload?: any) =>
    defaultDispatch({ type, payload });
  useEffect(() => {
    axios
      .get("/auth/me")
      .then((res) => dispatch("LOGIN", res.data))
      .catch((error) => console.log(error))
      .finally(() => dispatch("STOP_LOADING"));
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
