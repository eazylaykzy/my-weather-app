import {call, put, takeEvery} from "redux-saga/effects";
import * as TYPES from '../actions-types/actions-types';
const CryptoJS = require("crypto-js");

export default function* WeatherWatcherSaga() {
	yield takeEvery(TYPES.WEATHER_REQUEST, WeatherWorkerSaga);
	yield takeEvery(TYPES.TEMP_BUTTON_TOGGLE_START, TogglerWorkerSaga);
}

function* WeatherWorkerSaga(action) {
	try {
		const payload = yield call(getWeather, action.payload);
		yield put({type: TYPES.WEATHER_REQUEST_SUCCESS, payload});
	} catch (e) {
		yield put({type: TYPES.WEATHER_REQUEST_ERROR, payload: e});
	}
}

function* TogglerWorkerSaga(action) {
	try {
		const payload = yield call(tempToggler, action.payload);
		yield put({type: TYPES.TEMP_BUTTON_TOGGLE_SUCCESS, payload});
	} catch (e) {
		yield put({type: TYPES.TEMP_BUTTON_TOGGLE_ERROR, payload: e});
	}
}

const getWeather = async (query) => {
	let url = "https://weather-ydn-yql.media.yahoo.com/forecastrss";
	const method = "GET", app_id = process.env.REACT_APP_WEATHER_APP_ID, consumer_key = process.env.REACT_APP_WEATHER_CONSUMER_KEY,
		consumer_secret = process.env.REACT_APP_WEATHER_CONSUMER_SECRET, concat = "&",
		oauth = {
			oauth_consumer_key: consumer_key,
			oauth_nonce: Math.random()
				.toString(36)
				.substring(2),
			oauth_signature_method: "HMAC-SHA1",
			oauth_timestamp: parseInt(new Date().getTime() / 1000, 10).toString(),
			oauth_version: "1.0"
		};

	const URLparams = new URLSearchParams(Object.entries(query)).toString(), merged = {...query, ...oauth},
		merged_arr = Object.keys(merged).sort().map(k => [k + "=" + encodeURIComponent(merged[k])]),
		signature_base_str = method + concat + encodeURIComponent(url) + concat + encodeURIComponent(merged_arr.join(concat)),
		composite_key = encodeURIComponent(consumer_secret) + concat,
		hash = CryptoJS.HmacSHA1(signature_base_str, composite_key);
	oauth["oauth_signature"] = hash.toString(CryptoJS.enc.Base64);
	console.log(oauth);
	const auth_header = "OAuth " + Object.keys(oauth).map(k => [k + '="' + oauth[k] + '"']).join(",");
	console.log(auth_header);

	// setting CORS dynamically
	let mode;
	process.env.NODE_ENV === 'development' ? mode = 'cors' : mode = 'no-cors';

	const resp = await fetch(`${url}?${URLparams}`, {
		method: "GET", // *GET, POST, PUT, DELETE, etc.
		mode: mode, // no-cors, *cors, same-origin
		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		credentials: "same-origin", // include, *same-origin, omit
		headers: {
			Authorization: auth_header,
			"X-Yahoo-App-Id": app_id
		}
	});

	const data = await resp.json();

	let localTime = parseInt(new Date().getTime() / 1000, 10).toString();
	let unixForTime = new Date(localTime * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
	let charDigit = (str) => str.replace(/[^A-Za-z]/g, '');
	let time = unixForTime,
		night = false;

	if (data !== null) {
		if (charDigit(unixForTime) === "pm") {
			night = !night;
		} else {
			night = !!night;
		}

		data.current_observation.wind.speed = Math.round(data.current_observation.wind.speed);
	}
	return {
		astronomy: data.current_observation.astronomy,
		atmosphere: data.current_observation.atmosphere,
		condition: data.current_observation.condition,
		forecasts: data.forecasts.slice(0, 5),
		location: data.location,
		wind: data.current_observation.wind,
		units: {
			distance: "mile",
			pressure: "inch Hg",
			speed: "m/h",
			temperature: "F"
		},
		time: time,
		night: night,
		unit: 'f'
	}
};

const tempToggler = payload => {
	// convert from Fahrenheit to Celsius and vice-versa
	const FtoC = f => Math.round((f - 32) * (5 / 9));
	const CtoF = c => Math.round((c * (9 / 5)) + 32);
	// convert from k/h to miles and vice-versa
	const KtoM = k => (k/1.6092).toFixed(2);
	const MtoK = m => (m*1.6092).toFixed(2);
	return payload.unit === 'f' ? {
		condition: {
      text: payload.condition.text,
			code: payload.condition.code,
			temperature: FtoC(payload.condition.temperature)
		},
		forecasts: payload.forecasts
			.map(l => ({day: l.day, date: l.date, low: FtoC(l.low), high: FtoC(l.high), text: l.text, code: l.code})),
		wind: {
			speed: MtoK(payload.wind.speed)
		},
		units: {
			distance: "km",
			pressure: "mb",
			speed: "km/h",
			temperature: "C"
		},
		unit: 'c'
	} : {
		condition: {
      text: payload.condition.text,
			code: payload.condition.code,
			temperature: CtoF(payload.condition.temperature)
		},
		forecasts: payload.forecasts
			.map(l => ({day: l.day, date: l.date, low: CtoF(l.low), high: CtoF(l.high), text: l.text, code: l.code})),
		wind: {
			speed: KtoM(payload.wind.speed)
		},
		units: {
			distance: "mile",
			pressure: "inch Hg",
			speed: "m/h",
			temperature: "F"
		},
		unit: 'f'
	}
};

