$(document).ready(function() {
	// play music

	// sections
	let section_menu = $("div#menu");
	let section_intro = $("div#intro");
	section_intro.hide();
	
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
});