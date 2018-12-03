import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import AppReducer from './reducers';

const persistConfig = {
  key: 'root',
  storage,
  persist: (...options) => persistNative(...options),
  whitelist: ['Wallet', 'contacts', 'Debug', 'newWallet'],
  stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, AppReducer);
const middleware = applyMiddleware(thunk, promise, logger);

const store = createStore(
  persistedReducer,
  middleware,
);

const persistor = persistStore(store);

export { store, persistor };