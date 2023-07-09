import React from "react";
import ReactGA from "react-ga";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";

import AppRouter from "~/router";
import { api } from "~/config/api";
import { setStore, store, StoreState } from "~/config/store";
import { createRootReducer } from "~/config/store/reducers";

import "~/assets/styles/app.css";
import "keen-slider/keen-slider.min.css";
import "reactflow/dist/style.css";

ReactGA.initialize(import.meta.env.VITE_GA_CODE);
ReactGA.pageview(window.location.pathname + window.location.search);

export class LmsApp {
	init() {
		try {
			console.info("App Initialization...");
			// configure redux store
			this.configureStore();
			const ElementRef = document.getElementById("root") as HTMLElement;
			createRoot(ElementRef).render(this.render());
		} catch (error: any) {
			console.error("Failed to start App", error);
		}
	}

	configureStore(initialState?: Partial<StoreState>) {
		const store = configureStore({
			reducer: createRootReducer(),
			devTools: import.meta.env.DEV,
			preloadedState: {
				...initialState
			},
			middleware: getDefaultMiddleware =>
				getDefaultMiddleware({
					thunk: true,
					serializableCheck: false,
					immutableCheck: false
				}).concat(api.middleware)
		});
		setStore(store);
		return store;
	}

	render() {
		return (
			<React.StrictMode>
				<Provider store={store}>
					<AppRouter />
					<Toaster position="top-center" toastOptions={{ duration: 5000 }} />
				</Provider>
			</React.StrictMode>
		);
	}
}

const App = new LmsApp();
App.init();
