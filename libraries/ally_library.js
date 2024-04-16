// type
function Ally(_name, _description, stats) {
	return {
		description: _description,
		stats: stats,
		storage: {
			name: _name,
		}
	};
}

// library
const ALLIES = {
	"Vanessa": Ally("Vanessa", "A very cute girl you saved from some zombies", {}),
};

// functions
function AddAlly(allyID) { AddGeneric(allyID, allies, "allies"); }
function RemoveAlly(allyID) { RemoveGeneric(allyID, allies, "allies"); }
function HasAlly(allyID) { HasGeneric(allyID, allies); }