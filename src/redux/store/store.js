import {createStore, applyMiddleware, compose} from 'redux'
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers/reducers';
import sagaApi from '../sagas/sagas';

const storeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const initialiseSagaMiddleware = createSagaMiddleware();

const store = createStore(
	rootReducer,
	storeEnhancer(
		applyMiddleware(initialiseSagaMiddleware)
	)
);

initialiseSagaMiddleware.run(sagaApi);

export default store;