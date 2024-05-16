// values
let items = new Array();
let allies = new Array();
let buffs = new Array();

let stats = { // default stats
	health: 20,
	sanity: 20,

	strength: 10,
	perception: 10,
	luck: 5,
	charisma: 5,
	speed: 5,
	defense: 10,
};

let flags = {
	unlocked_apartments: false,
	unlocked_lake: false,

	rested: false,
}

let objectives = {
	// UNLOCK LINUS
	await_response: false,
	find_apartment_key: false,
	apartment_002: false,

	// UNLOCK WENDY
	find_vanessa: false,
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
		for (const [key, value] of Object.entries(genericID.stats)) {
			stats[key] += value;
		}

		SaveData("stats", stats);
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
	$("#hp").html("HP: " +  stats.health);
	$("#sanity").html("SANITY: " +  stats.sanity);

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

			case "find_vanessa": string = "Find someone named 'Vanessa' then return to the LECTURE HALL"; break;
		}

		objective_list.append("<li>" + string + "</li>");
	}
}