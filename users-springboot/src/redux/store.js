import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Correct import syntax for thunk
import cartReducer from './reducers/cartReducer';

const rootReducer = combineReducers({
    cart: cartReducer,
    // ...other reducers...
});

const store = createStore(rootReducer, applyMiddleware(thunk)); // Use applyMiddleware to add redux-thunk

export default store;
