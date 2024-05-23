// values
let items = new Array();
let allies = new Array();
let buffs = new Array();

let stats = { // default stats
	health: 20,
	sanity: 20,

	"max health": 25,
	"max sanity": 25,

	strength: 10,
	perception: 10,
	luck: 5,
	charisma: 5,
	speed: 5,
	defense: 10,
};

let flags = {
	rested_count: 0,

	military_counter: 0,
	military_max: 0,
}

let objectives = {
	// UNLOCK LINUS
	await_response: false,
	find_apartment_key: false,
	apartment_002: false,

	// UNLOCK WENDY
	find_vanessa: false,
	return_vanessa: false,

	// UNLOCK TREVOR
	find_jane: false,

	// MILITARY ENDING
	investigate_lake: false,
	find_batteries: false, get_batteries: false,
	find_frequency: false,
	find_linus: false,
	return_linus: false,
	wait_for_military: false,
	go_to_lake: false,

	// METRO ENDING
	find_generator1: false,
	find_generator2: false,
	find_generator3: false, find_generator3_apartments: false,
	find_fuel: false,
	find_flashlight: false,
	return_components: false, 
	find_allies: false,
	return_allies: false,
	go_to_metro: false,
}

// data functions
function SaveData(name, data, intro = false) {
	if (!intro) { RefreshWindows(); }
	
	localStorage.setItem(name, JSON.stringify(data));
}

function ReadData(name) {
	return JSON.parse(localStorage.getItem(name));
}

// load data
let items_value = ReadData("items");
if (items_value != null) { items = items_value; }

let allies_value = ReadData("allies");
if (allies_value != null) { allies = allies_value; }

let buffs_value = ReadData("buffs");
if (buffs_value != null) { buffs = buffs_value; }

let stats_value = ReadData("stats");
if (stats_value != null) { stats = stats_value; }

let flags_value = ReadData("flags");
if (flags_value != null) { flags = flags_value; }

let objectives_value = ReadData("objectives");
if (objectives_value != null) { objectives = objectives_value; }

// functions
function AddGeneric(genericID, genericArray, genericType) {
	genericArray.push(genericID.storage);

	// modify stats
	if (genericID.stats != null) {
		ModifyStats(genericID.stats);
	}

	SaveData(genericType, genericArray);
}

function RemoveGeneric(genericID, genericArray, genericType) {
	for (let i = 0; i < genericArray.length; i++) {
		if (genericID.storage.name == genericArray[i].name) {
			genericArray.splice(i, 1);

			// modify stats
			if (genericID.stats != null) {
				for (const [key, value] of Object.entries(genericID.stats)) {
					stats[key] -= value;

					if (stats[key] < 0) { stats[key] = 0; }
				}
				SaveData("stats", stats);
			}

			SaveData(genericType, genericArray);
			return;
		}
	}

	console.log("REMOVE FAILED");
}

function HasGeneric(genericID, genericArray) {
	for (let i = 0; i < genericArray.length; i++) {
		if (genericID.storage.name == genericArray[i].name) {
			return true;
		}
	}

	return false;
}

function ModifyStats(inputStats) {
	for (const [key, value] of Object.entries(inputStats)) {
		stats[key] += value;

		if (stats[key] < 0) { stats[key] = 0; }
	}

	if (stats.health > stats["max health"]) { stats.health = stats["max health"]; }
	if (stats.sanity > stats["max sanity"]) { stats.sanity = stats["max sanity"]; }

	if (stats.health <= 0 || stats.sanity <= 0) {
		$("body").append("<div id='mark-of-death'>Something is calling...<div>");
	}

	SaveData("stats", stats);
}

function SetFlag(id, value) {
	flags[id] = value;

	SaveData("flags", flags);
}

function SetObjective(id, value) {
	objectives[id] = value;

	SaveData("objectives", objectives);
}

// id generator
// src: https://stackoverflow.com/a/33226136
const uniqId = (() => {
    let i = 0;
    return () => {
        return i++;
    }
})();

function RefreshWindows() {
	// update health
	let hpText = stats.health;
	let sanityText = stats.sanity;

	if (stats.health <= 9) { hpText = "<span style='color:red;'>" + stats.health + "</span>"; }
	if (stats.sanity <= 9) { sanityText = "<span style='color:red;'>" + stats.sanity + "</span>"; }

	$("#hp").html("HP:" +  hpText + "<span class='maxstat'>/" + stats["max health"] + "</span>");
	$("#sanity").html("SANITY:" +  sanityText + "<span class='maxstat'>/" + stats["max sanity"] + "</span>");

	// update stats
	$("#strength").html(stats.strength);
	$("#defense").html(stats.defense);
	$("#luck").html(stats.luck);
	$("#charisma").html(stats.charisma);
	$("#speed").html(stats.speed);
	$("#perception").html(stats.perception);

	$(".scrolling-window").empty();

	const tooltip = $("#tooltip");

	// update items
	items.forEach(element => {
		itemString = "";

		if (ITEMS[element.type][element.name].stats != null) {
			for (const [key, value] of Object.entries(ITEMS[element.type][element.name].stats)) {
				itemString += "<h3 class='item-stat'>" + value + " " + key + "</h3>"
			}
		}

		const id = "item" + uniqId();

		$("#items-window").append("<div class='item' id='" + id + "'><h3 class=item-name>" + element.name +"</h3><div class='item-stats'>" + itemString + "</div></div>");
		$("#" + id).on( "mouseenter", function (){
			tooltip.html("[" + element.type.toUpperCase() + "] " + ITEMS[element.type][element.name].description);
		});

		$("#" + id).on({
			mouseenter: function() {
				tooltip.show();
				tooltip.html("[" + element.type.toUpperCase() + "] " + ITEMS[element.type][element.name].description);
			},
			mouseleave: function() {
				tooltip.hide();
				tooltip.html("");
			}
		});
	});

	// update allies
	allies.forEach(element => {
		allyString = "";

		if (ALLIES[element.name].stats != null) {
			for (const [key, value] of Object.entries(ALLIES[element.name].stats)) {
				allyString += "<h3 class='item-stat'>" + value + " " + key + "</h3>"
			}
		}

		const id = "item" + uniqId();

		$("#allies-window").append("<div class='item' id='" + id + "'><h3 class=item-name>" + element.name +"</h3><div class='item-stats'>" + allyString + "</div></div>");
		$("#" + id).on({
			mouseenter: function() {
				tooltip.show();
				tooltip.html(ALLIES[element.name].description);
				tooltip.append("<img class='portrait' src='images/actors/" + element.name + ".png'>");
			},
			mouseleave: function() {
				tooltip.hide();
				tooltip.html("");
			}
		});
	});

	// update buffs
	buffs.forEach(element => {
		buffString = "";

		if (BUFFS[element.name].stats != null) {
			for (const [key, value] of Object.entries(BUFFS[element.name].stats)) {
				buffString += "<h3 class='item-stat'>" + value + " " + key + "</h3>"
			}
		}

		const id = "item" + uniqId();

		$("#allies-window").append("<div class='item' id='" + id + "'><h3 class=item-name>" + element.name +"</h3><div class='item-stats'>" + buffString + "</div></div>");
		$("#" + id).on( "mouseenter", function (){
			tooltip.html(BUFFS[element.name].description);
		});

		$("#" + id).on({
			mouseenter: function() {
				tooltip.show();
				tooltip.html(BUFFS[element.name].description);
			},
			mouseleave: function() {
				tooltip.hide();
				tooltip.html("");
			}
		});
	});

	// update objectives
	const objective_list = $("#objectives-list");
	objective_list.empty();

	for (const [key, value] of Object.entries(objectives)) {
		if (!value) { continue; }

		let string = "";

		switch(key) {
			case "await_response": string = "Check if you got a reply from the chatroom at the COMP BUILDING"; break;
			case "find_apartment_key": string = "Look for an apartment master key in the COMP BUILDING"; break;
			case "apartment_002": string = "Head to the APARTMENTS and meet with the person at room 002"; break;

			case "find_vanessa": string = "Find someone named 'Vanessa'.. If she's not already dead"; break;
			case "return_vanessa": string = "Return to the LECTURE HALL with Vanessa"; break;

			case "find_jane": string = "If I find a girl with short black pigtails and a heart locket, I should keep her safe until Trevor finds us"; break;

			case "investigate_lake": string = "Investigate MACQUARIE LAKE to find out what the whiteboard markings meant"; break;
			case "find_batteries": string = "Find batteries somewhere to power the handheld radio"; break;
			case "get_batteries": string = "Find the guy Vanessa was talking about at CENTRAL COURTYARD and get batteries from him"; break;
			case "find_frequency": string = "If we investigate the LAW BUILDING again, maybe we can find the military frequency?"; break;
			case "find_linus": string = "I need to find someone who can read binary... Maybe I'll look at the COMP BUILDING?"; break;
			case "return_linus": string = "Linus seems great with computers. I should take him to the whiteboard at the LAW BUILDING."; break;
			case "wait_for_military": string = "I need to survive for " + (flags.military_max - flags.military_counter) + " more encounters, then head to MACQUARIE LAKE"; break;
			case "go_to_lake": string = "The military should be here any second now! I need to head to MACQUARIE LAKE!"; break;

			case "find_generator1": string = "Find generator part A to power the metro, It's probably at the COMP BUILDING"; break;
			case "find_generator2": string = "Find generator part B to power the metro, It's probably at the COMP BUILDING"; break;
			case "find_generator3": string = "Find generator part C to power the metro, It's probably at the COMP BUILDING"; break;
			case "find_generator3_apartments": string = "Find generator part C to power the metro, It's probably at the APARTMENTS"; break;
			case "find_fuel": string = "Find fuel to power the generator"; break;
			case "find_flashlight": string = "Find a flashlight to make it easier to enter the metro"; break;
			case "return_components": string = "I have all the components to repower the metro! I should head back to CENTRAL COURTYARD to assemble the pieces"; break;
			case "find_allies": string = "I need to find " + (4 - allies.length) + " more people to help assemble the generator"; break;
			case "return_allies": string = "I have enough people to return to CENTRAL COURTYARD and assemble the generator!"; break;
			case "go_to_metro": string = "I need to head to the METRO to repower a train and escape!"; break;
		}

		objective_list.append("<li>" + string + "</li>");
	}
}