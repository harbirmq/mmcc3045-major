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
	"Vanessa": Ally("Vanessa", "A very cute girl you saved from some zombies", { perception: 2, luck: 5, strength: 4 }),
	"Alvin": Ally("Alvin", "You found him holed up in the law building...", { perception: 3, defense: 5, strength: 2 }),
	"Kaitlyn": Ally("Kaitlyn", "She almost killed you when you broke into her apartment", { perception: 3, speed: 5, strength: 3 }),
	"Lily": Ally("Lily", "She always looks traumatised...", { perception: 2, charisma: 5, strength: 1 }),
	"Linus": Ally("Linus", "The guy from the chatroom. He seems to be very knowledgable with computers.", { perception: 8, strength: 1 }),
	"Trevor": Ally("Trevor", "He's staying strong despite losing his girlfriend.", { perception: 3, strength: 3, charisma: 3 }),
	"Wendy": Ally("Wendy", "She only opened the door because we had Vanessa.", { perception: 2, speed: 1, strength: 1, charisma: 1 }),
	"Noelle": Ally("Noelle", "Her voice strangely calms you down...", { perception: 5, charisma: 5, "max sanity": 3, strength: 2 }),
};

// functions
function AddAlly(allyID) { AddGeneric(allyID, allies, "allies"); }
function RemoveAlly(allyID) { RemoveGeneric(allyID, allies, "allies"); }
function HasAlly(allyID) { return HasGeneric(allyID, allies); }