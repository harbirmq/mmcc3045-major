// types
function Weapon(_name, _description, _damage) {
	return {
		description: _description,
		damage: _damage,
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

function Consumable(_name, _description, _function) {
	return {
		description: _description,
		function: _function,
		storage: {
			type: "consumable",
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
		"Stick": Weapon("Stick", "A suprisingly sturdy stick", 2),
		"Kitchen Knife": Weapon("Kitchen Knife", "A dull knife found in a kitchen", 5),
		"Gun": Weapon("Gun", "A blickey", 15),
	},

	"armor": {
		"Motorcycle Helmet": Armor("Motorcycle Helmet", "A cool, black, motorcycle helmet", {}),
		"Lucky Bracelet": Armor("Lucky Bracelet", "A shiny gold bracelet decorated with some gems", {}),
	},

	"consumable": {
		"Bandage": Consumable("Bandage", "A standard issue bandage", function(){}),
	},

	"key": {
		"Keyboard": Key("Keyboard", "A board of keys"),
	},
};

// functions
function AddItem(itemID) { AddGeneric(itemID, items, "items"); }
function RemoveItem(itemID) { RemoveGeneric(itemID, items, "items"); }
function HasItem(itemID) { HasGeneric(itemID, items); }