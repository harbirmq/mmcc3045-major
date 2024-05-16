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

function Random(num) {
	return Math.floor(Math.random() * (num + 1));
}

// rolls a random number from 0[inclusive] --> required[inclusive].
function Roll(stat, required) {
	let roll = Random(stat);

	let success = false;
	if (roll >= required) { success = true; }

	let rollData = {
		success: success,
		text: roll + "/" + required,
	};

	return rollData;
}

/*
	modifiers:
	text, options,

	background, actor, zombie, sound

	item, removeitem, ally, removeally, buff, removebuff

	removeencounter, function
*/

/*
	encounters prefixed with 'E' are regular encounters that should be added when a new game is made
	
	encounters prefixed with 'S' are special encounters that should not be added when a new game is made
*/

const LOCATIONS = [
	"COMP BUILDING",
	"CENTRAL COURTYARD",
	"LECTURE HALL",
	"LAW BUILDING",
	"MACQUARIE LAKE",
	"APARTMENTS"
]

// encounters
const ENCOUNTERS = {
	"meta": {
		"E0": [
			{text: '"Last day, huh?", I thought to myself...'},
			{text: "I lugged myself out of the metro and walked slowly to my class..."},
			{text: "I took in the sounds of people walking, the birds chirping, the trees rustling...",},
			{text: "Strolling through Wally's Walk, I noticed the new law building was finally completed...",},
			{text: "To my right I saw two birds fighting over the last few chips...",},
			{text: "The people in front of me, walking ever so slightly slower than me...",},
			{text: '"I wish I could never leave...", I thought...',},
			{text: "...",},
			{text: "It's been 3 weeks now...", background: "wallyswalk2"},
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

		"S0": [
			{text: "Where should we go next?", options: [
				Option("Rest", function() {
					setScript([
						{text: "You took a well-deserved nap and composed yourself. [+5 HP] [+5 SANITY]", stat: { health: 5, sanity: 5 }}
					], true);

					flags.rested = true;
				}),
				Option("Jog on the spot", function() {
					setScript([
						{text: "You jogged on the spot. Your feel a little tired, but it was probably worth it. [+1 SPEED] [-1 DEFENSE]", stat: { speed: 1, defense: -1 }}
					], true);

					flags.rested = true;
				}),
				Option("Talk into the mirror", function() {
					setScript([
						{text: "You talk to yourself in the mirror... 'Am I going crazy..?' [+2 CHARISMA] [-1 SANITY]", stat: { charisma: 2, sanity: -1 }}
					], true);

					flags.rested = true;
				}),
				Option("Train your eyes", function() {
					setScript([
						{text: "You train your eyes by tracking a fly as it zips around the room. [+2 PERCEPTION] [-1 SANITY]", stat: { perception: 2, sanity: -1 }}
					], true);

					flags.rested = true;
				}),
			]}
		],
	},

	"COMP BUILDING": {
		"E0": [
			{text: "Entering a classroom on the upper floor, you notice that all the keyboards are missing... All except one..."},
			{text: "As you contemplate taking it, a loud *BANG* could be heard outside."},
			{text: "You quickly stuff the keyboard into your bag and leave the building. [+ITEM: KEYBOARD]", item: [ITEMS["key"]["Keyboard"]]},
			{finish: true, removeencounter: ["COMP BUILDING", "E0"]},
		],
		"E1": [
			{text: "Sneaking through the building, you feel like that there's something that you could take right in front of your eyes...",
			function: function() {
				if (stats.perception >= 7) {
					setScript([
						{text: "[PERCEPTION CHECK SUCCESS] You could use the glass shards on the floor as a weapon!"},
						{text: "You rip a part of your shirt off, and wrap it around a large shard to form a makeshift shiv. [+ITEM: GLASS SHIV]", item: [ITEMS["weapon"]["Glass Shiv"]]},
						{finish: true, removeencounter: ["COMP BUILDING", "E1"]}
					]);
				}
				else {
					setScript([
						{text: "[PERCEPTION CHECK FAILED] 'Eh, it's probably nothing' you think to yourself..."},
						{text: "You decide to head back to base empty-handed."},
						{finish: true}
					]);
				}
			}}
		],
		"E2": [
			{text: "While scavenging one of the computer rooms, you notice one of the monitors are on!"},
			{text: "Upon further inspection, a chatroom window is open... The chatroom contains one message simply reading 'hello?'.", options:[
				Option("Scavenge Computer Part", function() {
					setScript([
						{text: "You ignore the chatroom and carefully extract some parts from the computer..."},
						{text: "'What if they needed help?' you think to yourself... [+ITEM: COMPUTER PARTS] [-1 SANITY]", item: [ITEMS["key"]["Computer Part"]], stat: { sanity: -1 }},
						{finish: true, removeencounter: ["COMP BUILDING", "E2"]}
					], true);
				}),
				Option("[REQUIRES KEYBOARD] Reply", function() {
					if (!HasItem(ITEMS["key"]["Keyboard"])) { return; }

					setScript([
						{text: "You plug in your keyboard, and reply with 'hi? where are you?'."},
						{text: "For convience sake, you leave the keyboard plugged in. Awaiting a reponse fills you with hope. [-ITEM: COMPUTER PARTS] [+2 SANITY]", stat: { sanity: 2 }, removeitem: [ ITEMS["key"]["Keyboard"] ]},
						{finish: true, removeencounter: ["COMP BUILDING", "E2"]}
					], true);
				}),
				Option("", function() {
				}),
				Option("Leave", function() {
					setScript([
						{text: "You ignore the chatroom and leave the building."},
						{text: "'What if they needed help?' you think to yourself... [-1 SANITY]", stat: { sanity: -1 }},
						{finish: true}
					], true);
				}),
			]},
		],
		"E3": [
			{text: "Looking through the bags on the lower floor, you find a key! [+ITEM: APARTMENT KEY?]", item: [ ITEMS["key"]["Apartment Key?"] ]},
			{text: "The key reads '002'. Maybe it's a key to an apartment?"},
			{text: "You add it to your keychain and leave the building. [NEW LOCATION: APARTMENTS]" },
			{finish: true, removeencounter: ["COMP BUILDING", "E3"],  function: function(){
				SetFlag("unlocked_apartments", true);
			}}
		],
		"E4": [
			{text: "Sneaking past a zombie, you notice a pair of coding socks on the floor."},
			{text: "You decide to take it, doubling up on socks can't hurt... right? [+ITEM: CODING SOCKS]", item: [ ITEMS["armor"]["Coding Socks"]]},
			{finish: true, removeencounter: ["COMP BUILDING", "E4"]}
		],
	},

	"CENTRAL COURTYARD": {
		"E0": [
			{text: "Walking through Central Courtyard, you notice a scream!"},
			{text: "You duck behind some cover and peek out."},
			{text: "You notice a pair of zombies attacking a fairly armored girl!", options: [
				Option("[SPEED CHECK] Distract Zombies", function(){
					if (stats.speed >= 7) {
						setScript([
							{text: "[SPEED CHECK SUCCESS] You succesfully distract the zombies by yelling, then evading them."},
							{text:"The girl thanks you and asks to join your team. [+ALLY: VANESSA]", ally: [ALLIES["Vanessa"]], actor: "Vanessa"},
							{finish: true, removeencounter: ["CENTRAL COURTYARD", "E0"]}
						], true);
					}
					else {
						let roll = Roll(stats.strength, 15);

						setScript([
							{text: "[SPEED CHECK FAIL] You scream at the top of your lungs to distract the zombies... but now they're coming at you!",
							function: function() {
								if (roll.success) {
									setScript([
										{text: "STRENGTH ROLL: " + roll.text + "!"},
										{text: "You successfully defeated the zombies, but looking up you notice the girl is nowhere to be seen. [-1 SANITY]", stat: {sanity: -1}},
										{finish: true, removeencounter: ["CENTRAL COURTYARD", "E0"]}
									]);
								}
								else {
									setScript([
										{text: "STRENGTH ROLL: " + roll.text + "..."},
										{text: "You barely manage to defeat the zombies..."},
										{text: "Too scared to look up, you hastily leave the scene. [-2 HP] [+INJURY: DEEP SCRATCH]", stat: {hp: -2}, buff: [BUFFS["Deep Scratch"]] },
										{finish: true, removeencounter: ["CENTRAL COURTYARD", "E0"]}
									]);
								}
							}}
						], true);
					}
				}),
				Option("[LUCK ROLL] Wait and loot her corpse", function(){
					let roll = Roll(stats.luck, 10);

					if (roll.success) {
						setScript([
							{text: "LUCK ROLL: " + roll.text + "!"},
							{text:"You watch the girl fight for her life."},
							{text:"At a crucial moment, she slips and is promptly killed by the zombies. Shortly after, the zombies move on to find their next target..."},
							{text:"You sneak up and loot her corpse... was it worth it? [+ITEM: MOTORCYCLE HELMET] [-3 SANITY]", stat: {sanity: -1}, item: [ ITEMS["armor"]["Motorcycle Helmet"]]},
							{finish: true, removeencounter: ["CENTRAL COURTYARD", "E0"]}
						], true);
					}
					else {
						setScript([
							{text: "LUCK ROLL: " + roll.text + "..."},
							{text: "You watch the girl swiftly take out the zombies with ease."},
							{text: "She glares at you as she wipes blood off her face.", actor: "Vanessa"},
							{text: "'She saw me...' [-2 SANITY]", stat: {sanity: -2}},
							{finish: true, removeencounter: ["CENTRAL COURTYARD", "E0"]}
						], true);
					}
				}),
				Option(" ", function(){}),
				Option("Do Nothing", function(){
					setScript([
						{text:"You decide to sneak away, leaving the poor girl alone [-1 SANITY]", stat: {sanity: -1}},
						{finish: true, removeencounter: ["CENTRAL COURTYARD", "E0"]},
					], true);
				}),
			]},
		]
	},

	"LAW BUILDING": {
		"E0": [
			{text: "As you walk through a classroom you notice a groaning sound..."},
			{text: "A zombie attacks you from behind!", zombie: false, options: [
				Option("[STRENGTH ROLL] Attack", function(){
					let roll = Roll(stats.strength, 10);

					if (roll.success) {
						setScript([
							{text: "STRENGTH ROLL: " + roll.text + "!"},
							{text: "You successfully defeated the zombie with ease!"},
							{finish: true, removeencounter: ["LAW BUILDING", "E0"]}
						], true);
					}
					else {
						setScript([
							{text: "STRENGTH ROLL: " + roll.text + "..."},
							{text: "You defeated the zombie, with some difficulty... [-2 HP]", stat: { health: -2 }},
							{finish: true, removeencounter: ["LAW BUILDING", "E0"]}
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
							{finish: true, removeencounter: ["LAW BUILDING", "E0"]}
						], true);
					}
					else {
						setScript([
							{text: "LUCK ROLL: " + roll.text + "..."},
							{text: "The zombie lunges at you dealing severe damage! [-7 HP]", stat: { health: -7 }},
							{text: "As you recover, you swiftly stomp on it's head, finishing it off..."},
							{finish: true, removeencounter: ["LAW BUILDING", "E0"]}
						], true);
					}
				}),
				Option("[SPEED ROLL] Flee", function(){
					let roll = Roll(stats.speed, 5);

					if (roll.success) {
						setScript([
							{text: "SPEED ROLL: " + roll.text + "!"},
							{text: "You quickly sprint away, without even looking back."},
							{finish: true, removeencounter: ["LAW BUILDING", "E0"]}
						], true);
					}
					else {
						setScript([
							{text: "SPEED ROLL: " + roll.text + "..."},
							{text: "The zombie lunges at you! You dodge, but... what if you didn't? [-2 SANITY]", stat: { sanity: -2 }},
							{text: "Before anything else can happen, you swiftly leave the room."},
							{finish: true, removeencounter: ["LAW BUILDING", "E0"]}
						], true);
					}
				}),
				Option("Accept your fate", function(){
					setScript([
						{text: "You close your eyes and accept your fate..."},
						{text: "The zombie forcefully opens one of your eyes and pulls it out! [-5 HP] [-5 SANITY] [+INJURY - MISSING EYE]", stat: { sanity: -5, health: -5 }, buff: [ BUFFS["Missing Eye"]]},
						{text: "Satisifed with just your eye, the zombie walks away chewing on it..."},
						{finish: true, removeencounter: ["LAW BUILDING", "E0"]}
					], true);
				}),
			]},
		]
	}
}

let ACTIVE_ENCOUNTERS = {};

for (const [location, _] of Object.entries(ENCOUNTERS)) {
	ACTIVE_ENCOUNTERS[location] = [];

	for (const [code, _] of Object.entries(ENCOUNTERS[location])) {
		if (code.startsWith("E")) {
			ACTIVE_ENCOUNTERS[location].push(code);
		}
	}
}

let active_encounters_value = ReadData("active_encounters");
if (active_encounters_value != null) { ACTIVE_ENCOUNTERS = active_encounters_value; }