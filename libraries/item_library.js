// types
function Weapon(_name, _description, _stats) {
	return {
		description: _description,
		stats: _stats,
		storage: {
			type: "weapon",
			name: _name,
		}
	};
}

function Armor(_name, _description, _stats) {
	return {
		description: _description,
		stats: _stats,
		storage: {
			type: "armor",
			name: _name,
		}
	};
}

function Key(_name, _description) {
	return {
		description: _description,
		storage: {
			type: "key",
			name: _name,
		}
	};
}

// library
const ITEMS = {
	"weapon": {
		"Stick": Weapon("Stick", "A suprisingly sturdy stick", { strength: 2 }),
		"Kitchen Knife": Weapon("Kitchen Knife", "A dull knife found in a kitchen", { strength: 4 }),
		"Glass Shiv": Weapon("Glass Shiv", "A large piece of glass wrapped with a part of your shirt", { strength: 5 }),
	},

	"armor": {
		"Motorcycle Helmet": Armor("Motorcycle Helmet", "A cool, black, motorcycle helmet", { defense: 5, perception: -5 }),
		"Lucky Bracelet": Armor("Lucky Bracelet", "A shiny gold bracelet decorated with some gems", { luck: 3 }),
		"Coding Socks": Armor("Coding Socks", "A pair of thigh-high, black socks", { charisma: 2, luck: 1 }),
		"Bomber Jacket": Armor("Bomber Jacket", "A cool looking, black jacket with purple markings.", { defense: 3 }),

		"Flashlight": Armor("Flashlight", "An electric torch that can be charged via USB.", { perception: 5}),
	},

	"key": {
		"Keyboard": Key("Keyboard", "A board of keys"),
		"Apartment Master Key": Key("Apartment Master Key", "A key to all the rooms in the apartments... Why does this exist?"),

		"Handheld Radio (DEAD)": Key("Handheld Radio (DEAD)", "A radio that could be used to communicate with the military. Its batteries' are dead."),
		"Handheld Radio (FIXED)": Key("Handheld Radio (FIXED)", "A radio that could be used to communicate with the military. I've replaced the batteries."),

		"Generator Piece (A)": Key("Generator Piece (A)", "A weird piece of machinery with a panel and some funnels."),
		"Generator Piece (B)": Key("Generator Piece (B)", "A weird piece of machinery with cables sticking out."),
		"Generator Piece (C)": Key("Generator Piece (C)", "A weird piece of machinery with a huge outlet."),
		"Metro Generator": Key("Metro Generator", "A gas powered generator that can power and control a metro train."),
		"Fuel Canister": Key("Fuel Canister", "A medium-sized, red fuel cansiter. It's about 90% full."),
	},
};

// functions
function AddItem(itemID) { AddGeneric(itemID, items, "items"); }
function RemoveItem(itemID) { RemoveGeneric(itemID, items, "items"); }
function HasItem(itemID) { return HasGeneric(itemID, items); }