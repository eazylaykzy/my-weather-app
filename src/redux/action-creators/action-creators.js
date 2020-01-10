import * as TYPES from '../actions-types/actions-types';

export const getWeather = (payload) => ({type: TYPES.WEATHER_REQUEST, payload});
export const tempToggler = (payload) => ({type: TYPES.TEMP_BUTTON_TOGGLE_START, payload});
export const inputQuery = (payload) => ({type: TYPES.INPUT_QUERY, payload});