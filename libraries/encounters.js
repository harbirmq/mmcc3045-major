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

// rolls a random number from 0[inclusive] --> required[inclusive].
function Roll(stat, required) {
	let roll = Math.floor(Math.random() * (stat + 1));

	let success = false;
	if (roll >= required) { success = true; }

	let rollData = {
		success: success,
		text: roll + "/" + required,
	};

	return rollData;
}

/*
	text, item, ally, buff, options, function, stat
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
			Option("give weapons", function() {
				AddItem(ITEMS["weapon"]["Stick"]);
				AddItem(ITEMS["weapon"]["Kitchen Knife"]);
				AddItem(ITEMS["weapon"]["Gun"]);
			}),
			Option("give armor + keyboard", function() {
				AddItem(ITEMS["armor"]["Motorcycle Helmet"]);
				AddItem(ITEMS["armor"]["Lucky Bracelet"]);
				AddItem(ITEMS["consumable"]["Bandage"]);
				AddItem(ITEMS["key"]["Keyboard"]);
			}),
			Option("example battle", function() {
				setScript(ENCOUNTERS["example battle"], true);
			}),
			Option("[REQUIRES KEYBOARD] restart intro", function() {
				console.log(HasItem(ITEMS["key"]["Keyboard"]))

				if (!HasItem(ITEMS["key"]["Keyboard"])) { return; }

				setScript(ENCOUNTERS["intro sequence"], true);
			}),
		]},
	],

	"example battle": [
		{text: "As you walk through the classroom you notice a groaning sound..."},
		{text: "A zombie attacks you from behind!", options: [
			Option("[STRENGTH ROLL] Attack", function(){
				let roll = Roll(stats.strength, 10);

				if (roll.success) {
					setScript([
						{text: "STRENGTH ROLL: " + roll.text + "!"},
						{text: "You successfully defeated the zombie with ease!"},
						{function: function() {
							setScript(ENCOUNTERS["next encounter"], true);
						}},
					], true);
				}
				else {
					setScript([
						{text: "STRENGTH ROLL: " + roll.text + "..."},
						{text: "You defeated the zombie, with some difficulty... [-2 HP]", stat: { health: -2 }},
						{function: function() {
							setScript(ENCOUNTERS["next encounter"], true);
						}},
					], true);
				}
			}),
			Option("[LUCK ROLL] Pray", function(){
				let roll = Roll(stats.luck, 15);

				if (roll.success) {
					setScript([
						{text: "LUCK ROLL: " + roll.text + "!"},
						{text: "The zombie trips over and smashes its head on the floor!"},
						{text: "You notice what it had tripped over... some sort of bracelet? [+ITEM - LUCKY BRACELET]", item: [ ITEMS["armor"]["Lucky Bracelet"] ]},
						{function: function() {
							setScript(ENCOUNTERS["next encounter"], true);
						}},
					], true);
				}
				else {
					setScript([
						{text: "LUCK ROLL: " + roll.text + "..."},
						{text: "The zombie lunges at you dealing severe damage! [-7 HP]", stat: { health: -7 }},
						{text: "As you recover, you swiftly stomp on it's head, finishing it off..."},
						{function: function() {
							setScript(ENCOUNTERS["next encounter"], true);
						}},
					], true);
				}
			}),
			Option("[SPEED ROLL] Flee", function(){
				let roll = Roll(stats.speed, 5);

				if (roll.success) {
					setScript([
						{text: "SPEED ROLL: " + roll.text + "!"},
						{text: "You quickly sprint away, without even looking back."},
						{function: function() {
							setScript(ENCOUNTERS["next encounter"], true);
						}},
					], true);
				}
				else {
					setScript([
						{text: "SPEED ROLL: " + roll.text + "..."},
						{text: "The zombie lunges at you! You dodge, but... what if you didn't? [-2 SANITY]", stat: { sanity: -2 }},
						{text: "Before anything else can happen, you swiftly leave the room."},
						{function: function() {
							setScript(ENCOUNTERS["next encounter"], true);
						}},
					], true);
				}
			}),
			Option("Accept your fate", function(){
				setScript([
					{text: "You close your eyes and accept your fate..."},
					{text: "The zombie forcefully opens one of your eyes and pulls it out! [-5 HP] [-5 SANITY] [+INJURY - MISSING EYE]", stat: { sanity: -5, health: -5 }, buff: [ BUFFS["Missing Eye"]]},
					{text: "Satisifed with just your eye, the zombie walks away chewing on it..."},
					{function: function() {
						setScript(ENCOUNTERS["next encounter"], true);
					}},
				], true);
			}),
		]},

	]
}