$(document).ready(function() {
	// play music

	// sections
	let section_menu = $("div#menu");
	section_menu.hide();
	let section_intro = $("div#intro");
	//section_intro.hide();
	
	// effects
	let fade = $("div#fade");

	// buttons
	let button_start = $("div#start-button");

	button_start.click(function() {
		fade.fadeIn(400, function() {
			section_menu.hide();
			section_intro.show();

			fade.fadeOut(400);
		});
	});

	// intro sequence
	let script = new Array(
		'"Last day, huh?", I thought to myself...',
		"I lugged myself out of the metro and walked slowly to my class...",
		"I took in the sounds of people walking, the birds chirping, the trees rustling...",
		"Strolling through Wally's Walk, I noticed the new law building was completed...",
		"To my right I saw two birds fighting over the last few chips...",
		"The people in front of me, walking ever so slightly slower than me...",
		'"I wish I could never leave...", I thought...',
		"...",
		"It's been 3 weeks now...",
		"Now, I hear the sound of *them* walking, the birds missing, the trees dripping...",
		"Strolling through Wally's Walk, I notice the amount of blood on the floor...",
		"To my right I see two zombies fighting over the remains of a student..",
		"No people in front of me to complain about...",
		"...",
		"Oh, and it's always raining...",
		"...",
		"Now then...",
		"Where should I go next?",
	);
});