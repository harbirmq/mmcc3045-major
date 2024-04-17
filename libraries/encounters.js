// functions
function Option(_label, _function) {
	return {
		label: _label,
		function: _function,
	}
}

let setScript;
function InitEncounters(_setScript) {
	setScript = _setScript;
}

// encounters
let ENCOUNTERS = {
	"intro sequence": [
		{text: '"Last day, huh?", I thought to myself...',},
		{text: "I lugged myself out of the metro and walked slowly to my class...",},
		{text: "I took in the sounds of people walking, the birds chirping, the trees rustling...",},
		{text: "Strolling through Wally's Walk, I noticed the new law building was finally completed...",},
		{text: "To my right I saw two birds fighting over the last few chips...",},
		{text: "The people in front of me, walking ever so slightly slower than me...",},
		{text: '"I wish I could never leave...", I thought...',},
		{text: "...",},
		{text: "It's been 3 weeks now...",},
		{text: "Now, I hear the sound of *them* walking, the birds missing, the trees dripping...",},
		{text: "Strolling through Wally's Walk, I notice the amount of blood on the floor...",},
		{text: "To my right I see two zombies fighting over the remains of a student..",},
		{text: "No people in front of me to complain about...",},
		{text: "...",},
		{text: "Oh, and it's always raining...",},
		{text: "...",},
		{text: "Now then...",},
		{text: "Where should I go next?",},
		{function: function() {
			setScript(ENCOUNTERS["female encounter"], true);
		}},
	],

	"female encounter": [
		{text: 'here is some sample text'},
		{text: 'now take this free female', ally: [ ALLIES["Vanessa"], ]},
		{text: 'now heres a choice', options: [
			Option("eat vanessa ass", function() {
				console.log("ASS");
			}),
			Option("eat vanessa pussy", function() {
				console.log("PUSSY");
			}),
			Option("suck vanessa nipples", function() {
				console.log("NIPPLES");
			}),
			Option("[REQUIRES LOVE] kiss vanessa lips", function() {
				setScript(ENCOUNTERS["intro sequence"], true);
			}),
		]},
	],
}