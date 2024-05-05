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

/*
	text, item, ally, buff, options, function
*/

// encounters
let ENCOUNTERS = {
	"intro sequence": [
		{text: '"Last day, huh?", I thought to myself...'},
		{text: "I lugged myself out of the metro and walked slowly to my class..."},
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
			setScript(ENCOUNTERS["next encounter"], true);
		}},
	],

	"next encounter": [
		{text: 'here is some sample text'},
		{text: 'now take this free ally', ally: [ ALLIES["Vanessa"], ]},
		{text: 'now heres a choice', options: [
			Option("option 1", function() {
				AddItem(ITEMS["weapon"]["Stick"]);
				AddItem(ITEMS["weapon"]["Kitchen Knife"]);
				AddItem(ITEMS["weapon"]["Gun"]);
			}),
			Option("option 2", function() {
				AddItem(ITEMS["armor"]["Motorcycle Helmet"]);
				AddItem(ITEMS["armor"]["Lucky Bracelet"]);
				AddItem(ITEMS["consumable"]["Bandage"]);
				AddItem(ITEMS["key"]["Keyboard"]);
			}),
			Option("option 3", function() {
				AddBuff(BUFFS["Missing Eye"]);
				AddAlly(ALLIES["Vanessa"]);
			}),
			Option("[REQUIRES KEYBOARD] option 4", function() {
				console.log(HasItem(ITEMS["key"]["Keyboard"]))

				if (!HasItem(ITEMS["key"]["Keyboard"])) { return; }

				setScript(ENCOUNTERS["intro sequence"], true);
			}),
		]},
	],
}