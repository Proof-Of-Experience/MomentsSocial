// ./store.js

import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import authReducer from '../slices/authSlice';
import { persistStore, persistReducer, Persistor } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'authUser'],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

interface Store extends EnhancedStore {
  __persistor: Persistor;
}

export const makeStore = (): Store => {
  const store = configureStore({
    reducer: {
      auth: persistedReducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  }) as Store;

  store.__persistor = persistStore(store); 

  return store;
};

export const wrapper = createWrapper(makeStore);
