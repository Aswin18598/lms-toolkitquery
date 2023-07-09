import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import { notify } from "~/helpers";
import { addRootReducer } from "~/config/store/reducers";
import { CatalogApi } from "./query";

const rejectedMatches = isAnyOf(
	CatalogApi.endpoints.getCatalog.matchRejected,
	CatalogApi.endpoints.getCatalogDetails.matchRejected,
	CatalogApi.endpoints.getCatalogCurriculum.matchRejected,
	CatalogApi.endpoints.getCategories.matchRejected,
	CatalogApi.endpoints.getSubCategories.matchRejected,
	CatalogApi.endpoints.getCategoriesTopics.matchRejected
);

const initialState = {};

const slice = createSlice({
	name: "catalog",
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder.addMatcher(rejectedMatches, (state, action: any) => {
			const payload = action.payload;
			if (payload?.data) notify("catalog_error_message", payload?.data);
		});
	}
});

export const catalogAction = slice.actions;
const catalogReducer = { [slice.name]: slice.reducer };
addRootReducer(catalogReducer);
