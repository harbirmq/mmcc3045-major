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
	"intro sequence": {
		[0]: {text: '"Last day, huh?", I thought to myself...',},
		[1]: {text: "I lugged myself out of the metro and walked slowly to my class...",},
		[2]: {text: "I took in the sounds of people walking, the birds chirping, the trees rustling...",},
		[3]: {text: "Strolling through Wally's Walk, I noticed the new law building was finally completed...",},
		[4]: {text: "To my right I saw two birds fighting over the last few chips...",},
		[5]: {text: "The people in front of me, walking ever so slightly slower than me...",},
		[6]: {text: '"I wish I could never leave...", I thought...',},
		[7]: {text: "...",},
		[8]: {text: "It's been 3 weeks now...",},
		[9]: {text: "Now, I hear the sound of *them* walking, the birds missing, the trees dripping...",},
		[10]: {text: "Strolling through Wally's Walk, I notice the amount of blood on the floor...",},
		[11]: {text: "To my right I see two zombies fighting over the remains of a student..",},
		[12]: {text: "No people in front of me to complain about...",},
		[13]: {text: "...",},
		[14]: {text: "Oh, and it's always raining...",},
		[15]: {text: "...",},
		[16]: {text: "Now then...",},
		[17]: {text: "Where should I go next?",},
		[18]: {function: function() {
			setScript(ENCOUNTERS["female encounter"], true);
		}},
	},

	"female encounter": {
		[0]: {text: 'here is some sample text'},
		[1]: {text: 'now take this free female', ally: [ ALLIES["Vanessa"], ]},
		[2]: {text: 'now heres a choice', options: [
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
	}
}