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

function AddEncounter(location, code) {
	ACTIVE_ENCOUNTERS[location].push(code);

	SaveData("active_encounters", ACTIVE_ENCOUNTERS);
}

function RemoveEncounter(location, code) {
	const index = ACTIVE_ENCOUNTERS[location].indexOf(code);

	if (index == -1) { console.log("Error removing encounter"); return; }

	ACTIVE_ENCOUNTERS[location].splice(index, 1);
	SaveData("active_encounters", ACTIVE_ENCOUNTERS);
}

function FlagIncrementor(id, threshold, location, code) {
	if (flags[id] == null) { flags[id] = 0; }

	SetFlag(id, flags[id] + 1);

	if (flags[id] >= threshold) { RemoveEncounter(location, code); }
}

/*
	LOCATIONS:
	COMP BUILDING, CENTRAL COURTYARD, LECTURE HALL, LAW BUILDING,
	MACQUARIE LAKE, APARTMENTS

	---

	MODIFIERS:
	text, options,

	background, actor, zombie, sound

	item, removeitem, ally, removeally, buff, removebuff

	removeencounter, function

	---

	encounters prefixed with 'E' are regular encounters that should be added when a new game is made
	
	encounters prefixed with 'S' are special encounters that should not be added when a new game is made
*/

/*
	Lurking Evil by Darren Curtis | https://www.darrencurtismusic.com/
	Music promoted by https://www.chosic.com/free-music/all/
	Creative Commons CC BY 3.0
	https://creativecommons.org/licenses/by/3.0/

	My Dark Passenger by Darren Curtis | https://www.darrencurtismusic.com/
	Music promoted by https://www.chosic.com/free-music/all/
	Creative Commons CC BY 3.0
	https://creativecommons.org/licenses/by/3.0/

	Skeleton Carnival by Shane Ivers | https://www.silvermansound.com
	Music promoted by https://www.chosic.com/free-music/all/
	Creative Commons CC BY 4.0
	https://creativecommons.org/licenses/by/4.0/

	Fall From Grace by Darren Curtis | https://www.darrencurtismusic.com/
	Music promoted by https://www.chosic.com/free-music/all/
	Creative Commons CC BY 3.0
	https://creativecommons.org/licenses/by/3.0/

	The Soul-Crushing Monotony Of Isolation (Instrumental Mix) by Punch Deck | https://soundcloud.com/punch-deck
	Music promoted by https://www.chosic.com/free-music/all/
	Creative Commons Attribution 3.0 Unported License
	https://creativecommons.org/licenses/by/3.0/deed.en_US 
*/

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
			{function() {
				window.location.replace("map.html");
			}},
		],

		"S0": [
			{text: "Where should we go next?", options: [
				Option("Rest", function() {
					setScript([
						{text: "You took a well-deserved nap and composed yourself. [+5 HP] [+5 SANITY]", stat: { health: 5, sanity: 5 }}
					], true);

					SetFlag("rested", true);
				}),
				Option("Jog on the spot", function() {
					setScript([
						{text: "You jogged on the spot. Your feel a little tired, but it was probably worth it. [+1 SPEED] [-1 DEFENSE]", stat: { speed: 1, defense: -1 }}
					], true);

					SetFlag("rested", true);
				}),
				Option("Talk into the mirror", function() {
					setScript([
						{text: "You talk to yourself in the mirror... 'Am I going crazy..?' [+2 CHARISMA] [-1 SANITY]", stat: { charisma: 2, sanity: -1 }}
					], true);

					SetFlag("rested", true);
				}),
				Option("Train your eyes", function() {
					setScript([
						{text: "You train your eyes by tracking a fly as it zips around the room. [+2 PERCEPTION] [-1 SANITY]", stat: { perception: 2, sanity: -1 }}
					], true);

					SetFlag("rested", true);
				}),
			]}
		],

		"ALL ALLIES": [
			{finish: true, function() {
				for (const ally in ALLIES) {
					AddAlly(ALLIES[ally]);
				}
			}}
		]
	},

	"COMP BUILDING": {
		"E0": [
			{text: "Entering a classroom on the upper floor, you notice that all the keyboards are missing... All except one..."},
			{text: "As you contemplate taking it, a loud *BANG* could be heard outside.", sound: "effects/gunshot"},
			{text: "You quickly stuff the keyboard into your bag and leave the building. [+ITEM: KEYBOARD]", item: [ITEMS["key"]["Keyboard"]]},
			{finish: true, removeencounter: ["COMP BUILDING", "E0"]},
		],
		"E1": [
			{text: "Sneaking through the building, you feel like that there's something that you could take right in front of your eyes...",
			function() {
				if (stats.perception >= 7) {
					setScript([
						{text: "[PERCEPTION CHECK SUCCESS] You could use the glass shards on the floor as a weapon!"},
						{text: "You rip a part of your shirt off, and wrap it around a large shard to form a makeshift shiv. [+ITEM: GLASS SHIV]", item: [ITEMS["weapon"]["Glass Shiv"]]},
						{finish: true, removeencounter: ["COMP BUILDING", "E1"]}
					]);
				}
			}},
			{text: "[PERCEPTION CHECK FAILED] 'Eh, it's probably nothing' you think to yourself..."},
			{text: "You decide to head back to base empty-handed."},
			{finish: true}
		],
		"E2": [
			{text: "While scavenging one of the computer rooms, you notice one of the monitors are on!"},
			{text: "Upon further inspection, a chatroom window is open... The chatroom contains one message simply reading 'hello?'.", options:[
				Option("[REQUIRES KEYBOARD] Reply", function() {
					if (!HasItem(ITEMS["key"]["Keyboard"])) { return; }

					setScript([
						{text: "You plug in your keyboard, and reply with 'hi? where are you?'."},
						{text: "For convienience sake, you leave the keyboard plugged in. Awaiting a reponse fills you with hope. [-ITEM: KEYBOARD] [+2 SANITY]", stat: { sanity: 2 }, removeitem: [ ITEMS["key"]["Keyboard"] ]},
						{finish: true, removeencounter: ["COMP BUILDING", "E2"], function() {
							SetObjective("await_response", true);
							AddEncounter("COMP BUILDING", "S0");
						}}
					], true);
				}),
				Option("", function() {
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
			{text: "Sneaking past a zombie, you notice a pair of coding socks on the floor."},
			{text: "You decide to take it, doubling up on socks can't hurt... right? [+ITEM: CODING SOCKS]", item: [ ITEMS["armor"]["Coding Socks"]]},
			{finish: true, removeencounter: ["COMP BUILDING", "E3"]}
		],
		"E4": [
			{text: "Our world seems grim as it is now, but maybe there is still hope out there."},
			{text: "You attempt to connect to the internet on one of the only computers that appear to be working..."},
			{text: "UPDATING..."},
			{text: "Maybe if I come back later?", function() {
				FlagIncrementor("comp_e4", 3, "COMP BUILDING", "E4");
			}},
			{finish: true}
		],

		"S0": [
			{text: "You come back to the computer with the chatroom... and notice some new messages!"},
			{text: "The screen reads the following:"},
			{text: "'omg i didnt think anyone would actually reply...'"},
			{text: "'i'm at the apartments. room 002.'"},
			{text: "'i really do NOT want to leave my room but i think the apartments would have a lot of supplies'"},
			{text: "'i think somewhere in the comp building, theres my red duffel bag.'"},
			{text: "'inside is a master key to the apartments - could you maybe bring it to me?'"},
			{text: "The rest of the text was... sent from this computer? It's a load of gibberish though..."},
			{text: "..."},
			{text: "Did a zombie type this?"},
			{text: "You simply reply with 'got it, i'll try and find it'."},
			{finish: true, removeencounter: ["COMP BUILDING", "S0"], function() {
				SetObjective("await_response", false);
				SetObjective("find_apartment_key", true);
				AddEncounter("COMP BUILDING", "S1");
			}}
		],

		"S1": [
			{text: "Looking through the bags on the lower floor, you notice a red duffel bag!"},
			{text: "'Was this the bag that person from the chatroom was talking about?'"},
			{text: "You look through all the pockets and find a key! [+ITEM: APARTMENT MASTER KEY]", item: [ITEMS["key"]["Apartment Master Key"]]},
			{text: "You add it to your keychain and leave the building. [NEW LOCATION: APARTMENTS]"},
			{finish: true, removeencounter: ["COMP BUILDING", "S1"], function() {
				SetObjective("find_apartment_key", false);
				SetObjective("apartment_002", true);
				SetFlag("unlocked_apartments", true);
			}}
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
							{text:"'Thanks for that.. I'm Vanessa.' she proudly claims. 'And you are?'", function() {
								if (objectives.find_vanessa) {
									setScript([
										{text: "..."},
										{text: "..."},
										{text: "'Hang on, did she just say Vanessa!?' you think to yourself..."},
										{finish: true, removeencounter: ["CENTRAL COURTYARD", "E0"], function() {
											SetObjective("find_vanessa", false);
											SetObjective("return_vanessa", true);
										}}
									]);
								}
							}},
							{finish: true, removeencounter: ["CENTRAL COURTYARD", "E0"]}
						], true);
					}
					else {
						let roll = Roll(stats.strength, 15);

						setScript([
							{text: "[SPEED CHECK FAIL] You scream at the top of your lungs to distract the zombies... but now they're coming at you!",
							function() {
								if (roll.success) {
									setScript([
										{text: "STRENGTH ROLL: " + roll.text + "!"},
										{text: "You successfully defeated the zombies, but looking up you notice the girl is nowhere to be seen. [-1 SANITY]", stat: {sanity: -1}},
										{finish: true, removeencounter: ["CENTRAL COURTYARD", "E0"]}
									]);
								}
							}},
							{text: "STRENGTH ROLL: " + roll.text + "..."},
							{text: "You barely manage to defeat the zombies..."},
							{text: "Too scared to look up, you hastily leave the scene. [-2 HP] [+INJURY: DEEP SCRATCH]", stat: {hp: -2}, buff: [BUFFS["Deep Scratch"]] },
							{finish: true, removeencounter: ["CENTRAL COURTYARD", "E0"]}
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
		],

		"E1": [
			{text: "Skimming through one of the classrooms, you notice tally marks scratched onto the wall."},
			{text: "The numbers look to only go up to seven... The thought of people not even surviving past a week fills you with dread. [-2 SANITY]", stat: { sanity: -2 }, function() {
				FlagIncrementor("law_e1", 3, "LAW BUILDING", "E1");
			}},
			{finish: true}
		]
	},

	"APARTMENTS": {
		"E0":  [
			{text: "You sneak past a few zombies on your way to the apartments. Upon reaching the door you try the handle."},
			{text: "It's locked, but you have the master key thanks to that person from the chatroom."},
			{text: "You insert the key, and try to turn the handle..."},
			{text: "You slowly open the door and look inside..."},
			{text: "No zombies for now..."},
			{text: "You sneak through the main corridor and make it to Room 002."},
			{text: "You think about knocking the door, but that would probably attract the wrong attention..."},
			{text: "Instead you slowly turn the handle; the door is unlocked."},
			{text: "'..Hello?' - A voice from inside the room whispers..."},
			{text: "'It's me... from the chatroom' you whisper back"},
			{text: "'Oh thank god...', you hear... A sigh of relief follows."},
			{text: "'Well what are you doing? Get in here...' the voice exclaims."},
			{text: "You quickly shift into the room and tap the door shut."},
			{text: "'Hey. Thanks for coming.', the boy says.", actor: "Linus"},
			{text: "'No problem, you want to come back to my safehouse?', you reply."},
			{text: "'Yeah... that'll be great.' he replies"},
			{text: "You notice he is a bit tense..."},
			{text: "'What's wrong?' you ask."},
			{text: "'Oh.. nothing.. uh..' he stumbles"},
			{text: "'Can I have my bag?' he finally asks"},
			{text: "'Oh... I didn't bring it...' you confess"},
			{text: "The boy looks away in silence. An awkwardness fills the room."},
			{text: "'Let's g'-'Im'... you tried talking at the same time..."},
			{text: "'You first' you insist."},
			{text: "'I'm Linus... what about you?' he says."},
			{text: "'Nice to meet you Linus, I don't want to stay here for long, lets go.' you reply."},
			{text: "..."},
			{text: "'okay...' he quietly responds"},
			{text: "[+ALLY: LINUS]", ally: [ALLIES["Linus"]]},
			{finish: true, removeencounter: ["APARTMENTS", "E0"], function() {
				SetObjective("apartment_002", false);

				AddEncounter("APARTMENTS", "S0");
			}}
		],

		"S0": [
			{text: "While exploring one apartment, a bookshelf suddenly gives way and crashes on top of you!", function() {
				if (stats.defense > 12) {
					setScript([
						{text: "[DEFENSE CHECK SUCCESS] You tanked out the pain, and avoided any injuries."},
						{text: "Before anything else starts falling on you, you quickly leave the apartment."},
						{finish: true, removeencounter: ["APARTMENTS", "S0"]}
					]);
				}
			}},
			{text: "[DEFENSE CHECK FAILED] The crushing weight of the bookshelf has caused you some damage... [-3 HP]", stat: { health: -3 }},
			{text: "Before anything else starts falling on you, you quickly leave the apartment."},
			{finish: true, removeencounter: ["APARTMENTS", "S0"]}
		]
	},

	"LECTURE HALL": {
		"E0": [
			{text: "As you walk past a janitor's closet you notice a ruffling sound coming from inside.", options: [
				Option("Investigate", function (){
					setScript([
						{text: "Preparing for the worst, you put your hand on the handle and slowly twist it open..."},
						{text: "'STOP!' - a voice from inside the closet firmly exclaims."},
						{text: "A girl is inside of this closet.."},
						{text: "'Do you need he-' 'GO AWAY' she yells"},
						{text: "'Quiet down, the zombies will hear us...' you try and reason"},
						{text: "'Leave. Now. Or I'll scream...' the girl responds", function() {
							if (HasAlly(ALLIES["Vanessa"])) {
								setScript([
									{text: "'Wendy... chill out please...' Vanessa says", actor: "Vanessa"},
									{text: "'V-Vanessa? Are you really there?' The girl asks"},
									{text: "'Yes Wendy... It's safe. Come out.' Vanessa firmly states"},
									{text: "The door opens slowly..."},
									{text: "A shy looking girl walks out.", actor: "Wendy"},
									{text: "'Y-you could've just said you were here...' Wendy quietly exclaims"},
									{text: "[+ALLY: WENDY]", ally: [ALLIES["Wendy"]]},
									{finish: true, removeencounter: ["LECTURE HALL", "E0"]}
								]);
							}
						}},
						{text: "..."},
						{text: "She seems serious... what should I do?", options: [
							Option("[CHARISMA CHECK] Reason with her", function(){
								if (stats.charisma >= 10) {
									setScript([
										{text: "[CHARISMA CHECK SUCCESS] 'Look, It's safe out here right now, but it might not be later.' you calmly speak"},
										{text: "'We've got plenty of supplies... you'll be safe with us.'"},
										{text: "'-nessa.' she quietly responds."},
										{text: "'Huh?' you ask."},
										{text: "'Is Vanessa with you?' she asks."},
										{text: "'Uh.. Yes! She is... She's back at our base...' you quickly respond."},
										{text: "'Come with me I'll take you to her.' you insist."},
										{text: "'I don't believe you! Bring her here' she conflicts."},
										{text: "'Okay. I'll go get her.' you say"},
										{text: "Okay... I need to go find a Vanessa... If she's even still alive."},
										{finish: true, removeencounter: ["LECTURE HALL", "E0"], function() {
											SetObjective("find_vanessa", true);
											AddEncounter("LECTURE HALL", "S0");
										}},
									], true);
								}
								else {
									setScript([
										{text: "[CHARISMA CHECK FAILED] 'Look, It-BLGGHHGHHHHH' you awkwardly spit out..."},
										{text: "You bit your tongue while trying to persuade the girl..."},
										{text: "You quickly leave in embarrassment"},
										{finish: true, removeencounter: ["LECTURE HALL", "E0"], function() {
											AddEncounter("LECTURE HALL", "S0");
										}}
									], true);
								}
							}),
							Option("", function(){}),
							Option("", function(){}),
							Option("Give Up", function(){
								setScript([
									{text: "'Her loss' you think to yourself..."},
									{finish: true, removeencounter: ["LECTURE HALL", "E0"], function() {
										AddEncounter("LECTURE HALL", "S0");
									}},
								], true);
							}),
						]}
					], true);
				}),
				Option("", function(){}),
				Option("", function(){}),
				Option("Leave", function(){
					setScript([
						{text: "Not wanting to risk any conflict, you decide to leave without checking the closet."},
						{finish: true}
					], true);
				}),
			]},
		],

		"S0": [
			{text: "You come across the same closet that girl was in...", function() {
				if (objectives.find_vanessa) {
					setScript([
						{text: "I haven't found Vanessa yet... I probably shouldn't try to talk to her."},
						{finish: true},
					]);
				}
			}},
			{text: "'Who's there!?' the girl asks.", function() {
				if (HasAlly(ALLIES["Vanessa"])) {
					setScript([
						{text: "'Wendy... chill out please...' Vanessa says", actor: "Vanessa"},
						{text: "'V-Vanessa? Are you really there?' The girl asks"},
						{text: "'Yes Wendy... It's safe. Come out.' Vanessa firmly states"},
						{text: "The door opens slowly..."},
						{text: "A shy looking girl walks out.", actor: "Wendy"},
						{text: "'Y-you could've just said you were here...' Wendy quietly exclaims"},
						{text: "[+ALLY: WENDY]", ally: [ALLIES["Wendy"]]},
						{finish: true, removeencounter: ["LECTURE HALL", "S0"], function() {
							SetObjective("return_vanessa", false);
						}}
					]);
				}
			}},
			{text: "She's... still in there. What should I do?", options: [
				Option("[CHARISMA CHECK] Reason with her", function(){
					if (stats.charisma >= 10) {
						setScript([
							{text: "[CHARISMA CHECK SUCCESS] 'Look, It's safe out here right now, but it might not be later.' you calmly speak"},
							{text: "'We've got plenty of supplies... you'll be safe with us.'"},
							{text: "'-nessa.' she quietly responds."},
							{text: "'Huh?' you ask."},
							{text: "'Is Vanessa with you?' she asks."},
							{text: "'Uh.. Yes! She is... She's back at our base...' you quickly respond."},
							{text: "'Come with me I'll take you to her.' you insist."},
							{text: "'I don't believe you! Bring her here' she conflicts."},
							{text: "'Okay. I'll go get her.' you say"},
							{text: "Okay... I need to go find a Vanessa... If she's even still alive."},
							{finish: true, function() {
								SetObjective("find_vanessa", true);
							}},
						], true);
					}
					else {
						setScript([
							{text: "[CHARISMA CHECK FAILED] 'Look, It-BLGGHHGHHHHH' you awkwardly spit out..."},
							{text: "You bit your tongue while trying to persuade the girl..."},
							{text: "You quickly leave in embarrassment"},
							{finish: true}
						], true);
					}
				}),
				Option("", function(){}),
				Option("", function(){}),
				Option("Give Up", function(){
					setScript([
						{text: "'Her loss' you think to yourself..."},
						{finish: true},
					], true);
				}),
			]}
		],
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