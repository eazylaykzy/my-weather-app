import * as TYPES from '../actions-types/actions-types';

const initialState = {
	weatherResults: {
		astronomy: {},
		atmosphere: {},
		condition: {},
		forecasts: [],
		location: {},
		wind: {},
		units: {
			distance: "mile",
			pressure: "inch Hg",
			speed: "m/h",
			temperature: "F"
		},
		time: null,
		night: null,
		unit: 'f',
		query: {location: 'Lagos', format: 'json'}
	}
};

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case TYPES.ONLOAD_SUCCESS:
			return {
				weatherResults: {...state.weatherResults, ...action.payload}
			};
		case TYPES.TEMP_BUTTON_TOGGLE_SUCCESS:
			return {
				weatherResults: {...state.weatherResults, ...action.payload}
			};
		case TYPES.INPUT_QUERY:
			return {
				weatherResults: {...state.weatherResults, ...action.payload}
			};

		default:
			return state;
	}
};

export default rootReducer;