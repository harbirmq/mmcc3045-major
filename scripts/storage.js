// values
let items = new Array();
let allies = new Array();
let stats = new Array();
let buffs = new Array();

// data functions
function SaveData(name, data) {
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

// functions
function AddGeneric(genericID, genericArray, genericType) {
	genericArray.push(genericID.storage);

	SaveData(genericType, genericArray);
}

function RemoveGeneric(genericID, genericArray, genericType) {
	for (let i = 0; i < genericArray.length; i++) {
		if (genericID.storage.name == genericArray[i].name) {
			genericArray.splice(i, 1);

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