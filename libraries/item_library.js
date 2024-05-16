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
	},

	"key": {
		"Keyboard": Key("Keyboard", "A board of keys"),
		"Computer Part": Key("Computer Part", "A small CPU chip"),
		"Apartment Key?": Key("Apartment Key?", "'002' is written on the key"),
	},
};

// functions
function AddItem(itemID) { AddGeneric(itemID, items, "items"); }
function RemoveItem(itemID) { RemoveGeneric(itemID, items, "items"); }
function HasItem(itemID) { return HasGeneric(itemID, items); }