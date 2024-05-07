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
	locations:
	COMP BUILDING, CENTRAL COURTYARD, LECTURE HALL, LAW BUILDING, MACQUARIE LAKE, APARTMENTS

	modifiers:
	text, item, ally, buff, options, function, stat
*/

// encounters
let ENCOUNTERS = {

	"meta": {
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
			{function: function() {
				window.location.replace("map.html");
			}},
		],

		"map screen": [
			{text: "Where should we go next?", options: [
				Option("Rest", function() {
					setScript([
						{text: "You took a well-deserved nap and composed yourself. [+5 HP] [+5 SANITY]", stat: { health: 5, sanity: 5 }}
					], true);
				}),
				Option("Jog on the spot", function() {
					setScript([
						{text: "You jogged on the spot. Your feel a little tired, but it was probably worth it. [+1 SPEED] [-1 DEFENSE]", stat: { speed: 1, defense: -1 }}
					], true);
				}),
				Option("Talk into the mirror", function() {
					setScript([
						{text: "You talk to yourself in the mirror... 'Am I going crazy..?' [+2 CHARISMA] [-1 SANITY]", stat: { charisma: 2, sanity: -1 }}
					], true);
				}),
				Option("Train your eyes", function() {
					SaveData("location", "COMP BUILDING");
					SaveData("encounter", 0);
					window.location.replace("encounter.html");
					/*
					setScript([
						{text: "You train your eyes by tracking a fly as it zips around the room. [+2 PERCEPTION] [-1 SANITY]", stat: { perception: 2, sanity: -1 }}
					], true);*/
				}),
			]}
		],
	},

	"COMP BUILDING": [
		[
			{text: "Entering a classroom on the upper floor, you notice that all the keyboards are missing... All except one..."},
			{text: "As you contemplate taking it, a loud *BANG* could be heard outside."},
			{text: "You quickly stuff the keyboard into your bag and leave the building. [+ITEM: KEYBOARD]", item: [ITEMS["key"]["Keyboard"]]},
			{finish: true},
		],


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
						{text: "You notice what it had tripped over... some sort of bracelet? [+ITEM: LUCKY BRACELET]", item: [ ITEMS["armor"]["Lucky Bracelet"] ]},
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