import { combineReducers } from 'redux';
import animals from './slices/Animals';

const rootReducer = combineReducers({
    animals,
});

export { rootReducer };