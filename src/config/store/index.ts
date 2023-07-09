import type { Store } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";

import { useSelector } from "react-redux";
import { createRootReducer } from "~/config/store/reducers";

export type StoreState = ReturnType<ReturnType<typeof createRootReducer>>;
export let store: Store<StoreState>;

export function setStore(newStore: Store<StoreState>) {
	store = newStore;
}

export type AppDispatch = typeof store.dispatch;

export const dispatch: AppDispatch = (action: any) => store.dispatch(action);
export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;
