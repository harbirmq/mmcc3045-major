// type
function Buff(_name, _description, stats) {
	return {
		description: _description,
		stats: stats,
		storage: {
			name: _name,
		}
	};
}

// library
const BUFFS = {
	"Missing Eye": Buff("Missing Eye", "Your right eye is missing...", { perception: -5 }),
	"Deep Scratch": Buff("Deep Scratch", "Hopefully this wont lead to an infection...", { speed: -2 })
};

// functions
function AddBuff(buffID) { AddGeneric(buffID, buffs, "buffs"); }
function RemoveBuff(buffID) { RemoveGeneric(buffID, buffs, "buffs"); }
function HasBuff(buffID) { return HasGeneric(buffID, buffs); }