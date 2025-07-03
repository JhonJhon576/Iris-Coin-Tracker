import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';

import usersSlice from "./users/usersSlice";
import alertsSlice from "./alerts/alertsSlice";
import anomaliesSlice from "./anomalies/anomaliesSlice";
import data_sourcesSlice from "./data_sources/data_sourcesSlice";
import scraping_tasksSlice from "./scraping_tasks/scraping_tasksSlice";
import rolesSlice from "./roles/rolesSlice";
import permissionsSlice from "./permissions/permissionsSlice";
import potsSlice from "./pots/potsSlice";

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,

users: usersSlice,
alerts: alertsSlice,
anomalies: anomaliesSlice,
data_sources: data_sourcesSlice,
scraping_tasks: scraping_tasksSlice,
roles: rolesSlice,
permissions: permissionsSlice,
pots: potsSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
