const state = {
	local: "(51.5074, 0.1278)",
	unit: "c",
	time: "",
	night: "",
	units: {},
	astronomy: {
		sunrise: "6:20 am",
		sunset: "6:30 pm"
	},
	atmosphere: {},
	condition: {},
	forecast: [],
	location: {},
	wind: {}
};

const digits = (str) => Number(str.replace(/\D/g, ''));
const timeDigit = (str) => str.replace(/[^:0-9]/g, '');
const charDigit = (str) => str.replace(/[^A-Za-z]/g, '');
const lastBuildDate = "Tue, 31 Dec 2019 11:07 AM PST";

console.log(digits('5[p'));
console.log(timeDigit('ko1:po8lkW'));
console.log(charDigit('ko1:po8lkW'));

const padMinutes = function(str) {
	const time = str.replace(/[^:0-9]/g, ''),
		minutes = time.substring(time.lastIndexOf(':'));
	if (minutes.length === 2) {
		str = time + 0 + ' ' + str.replace(/[^A-Za-z]/g, '');
	}
	return str;
};
let time = lastBuildDate.slice(17, 25),
	ampm = time.replace(/[^A-Za-z]/g, '').toLowerCase(),
	sunrise = padMinutes(state.astronomy.sunrise),
	sunset = padMinutes(state.astronomy.sunset),
	night = false;

if (digits(time) >= 1200) {
	ampm = ampm === "pm" ? 'am' : 'pm';
}
if (ampm === "pm") {
	night = digits(time) > digits(sunset);
} else {
	night = digits(time) < digits(sunrise);
}

const params = {
	key: 'XXX',
	q: 'I like coding',
	target: 'fr',
	source: 'en',
	format: 'text'
};

const URLparams = new URLSearchParams(Object.entries(params)).toString();
console.log(URLparams);

let unixForTime = new Date(1577828541000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
let unixForDate = new Date(1578556800000).toLocaleDateString("en-US");

/*(50°F - 32) x .5556 = 10°C*/

const FtoC = f => Math.round((f-32)*(5/9));
const CtoF = c => Math.round((c*(9/5))+32);
const KtoM = k => k/1.6092;
const MtoK = m => m*1.6092;

const forecasts = [
		{
			day: 'Wed',
			date: 1577833200,
			low: 75,
			high: 86,
			text: 'Partly Cloudy',
			code: 30
		},
		{
			day: 'Thu',
			date: 1577919600,
			low: 76,
			high: 85,
			text: 'Mostly Sunny',
			code: 34
		},
		{
			day: 'Fri',
			date: 1578006000,
			low: 74,
			high: 83,
			text: 'Sunny',
			code: 32
		},
		{
			day: 'Sat',
			date: 1578092400,
			low: 74,
			high: 82,
			text: 'Partly Cloudy',
			code: 30
		},
		{
			day: 'Sun',
			date: 1578178800,
			low: 75,
			high: 83,
			text: 'Partly Cloudy',
			code: 30
		}
	];

const arr = [
	{"id": 1, "title": "test mix", "tracks":[
			{"id": 88, "title":"Test track"},
			{"id":42, "title": "Test track 33"}]
	},
	{"id": 4, "title":"test mix 44", "tracks":[
			{"id":84, "title":"test Track 444"}]
	},
];
const result = arr.map(obj => ({ ...obj, ...{ tracks: obj.tracks.filter(track => track.id !== 88) } }));

const lows = forecasts.map(l => ({low: l.low, high: l.high, date: l.date}));

console.log(result)
console.log(lows);
console.log(KtoM(11.2644));
console.log(MtoK(7));
console.log(FtoC(-6));
console.log(CtoF(-21));
console.log(unixForTime, unixForDate);
console.log(sunset, sunrise);
console.log(time, night, digits(time), charDigit(unixForTime));