import React, { createContext, useContext, useEffect, useReducer } from "react";
import Axios from "axios";
import { User } from "../types";
import loadConfig from "next/dist/next-server/server/config";

interface State {
	auth: boolean;
	user: User | undefined;
	loading: boolean;
}

interface Action {
	type: string;
	payload?: any;
}

const StateContext = createContext<State>({
	auth: false,
	user: null,
	loading: true,
});

const DispatchContext = createContext(null);

const reducer = (state: State, { type, payload }: Action) => {
	switch (type) {
		case "LOGIN":
			return {
				...state,
				auth: true,
				user: payload,
			};

		case "LOGOUT":
			return {
				...state,
				auth: false,
				user: null,
			};

		case "FINISH_LOADING": {
			return {
				...state,
				loading: false,
			};
		}

		default:
			throw new Error(`Unkown type action of ${type}`);
	}
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, dispatch] = useReducer(reducer, {
		auth: false,
		user: null,
		loading: true,
	});

	useEffect(() => {
		Axios.get("/auth/me")
			.then((res) => {
				dispatch({ type: "LOGIN", payload: res.data });
				dispatch({ type: "FINISH_LOADING" });
			})
			.catch(() => {
				dispatch({ type: "FINISH_LOADING" });
			});
	}, []);

	return (
		<DispatchContext.Provider value={dispatch}>
			<StateContext.Provider value={state}>{children}</StateContext.Provider>
		</DispatchContext.Provider>
	);
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
