let skip = false;
let script_index = 0;
let active = false;

let text_area;
let choice_buttons;

function InitTextEngine(_text_area, _choice_buttons) {
	text_area = _text_area;
	choice_buttons = _choice_buttons;
}

function SetScript(script, run) {
	script_index = 0;

	choice_buttons.forEach(element => {
		DisableButton(element);
	});

	text_area.off("click");
	text_area.click(function() {
		RunScript(script);
	});

	if (run) { RunScript(script); }
}

function WriteText(text) {
	text_area.html(text).typewrite();
}

function EnableButton(button, option) {
	button.removeClass("choice-button-disabled");

	button.html(option.label);

	button.off("click");
	button.click(option.function);
}

function DisableButton(button) {
	button.addClass("choice-button-disabled");

	button.html("");

	button.off("click");
}

function RunScript(script) {
	if (script_index >= script.length) { return; }
	if (active) { skip = true; }

	active = true;

	WriteText(script[script_index].text);

	for (let [key, value] of Object.entries(script[script_index])) {
		switch (key) {
			case "function":
				value();
			return;

			case "item":
				value.forEach(element => {
					AddItem(element);
				});
			break;

			case "actor":
				$(".actor").fadeIn(200);
				$(".actor").attr("src","images/actors/" + value + ".png");
			break;

			case "zombie":
				$(".actor").fadeIn(200);
				if (!value) {
					let random = Random(17);

					$(".actor").attr("src","images/actors/zombie_" + random + ".png");

					let growl = new Audio("sounds/zombie_" + random + ".mp3");
					growl.play();
				}
				else {
					$(".actor").attr("src","images/actors/zombie_" + value + ".png");

					let growl = new Audio("sounds/" + value + ".mp3");
					growl.play();
				}
			break;

			case "sound":
				let sound = new Audio("sounds/" + value + ".mp3");
				sound.play();
			break;

			case "removeitem":
				value.forEach(element => {
					RemoveItem(element);
				});
			break;

			case "ally":
				value.forEach(element => {
					AddAlly(element);
				});
			break;

			case "removeally":
				value.forEach(element => {
					RemoveAlly(element);
				});
			break;

			case "buff":
				value.forEach(element => {
					AddBuff(element);
				});
			break;

			case "removebuff":
				value.forEach(element => {
					RemoveBuff(element);
				});
			break;

			case "stat":
				for (const [stat, v] of Object.entries(script[script_index][key])) {
					console.log(stats[stat] + " " + v);
					stats[stat] += v;
				}
			
				SaveData("stats", stats);
			break;

			case "options":
				let i = 0;
				value.forEach(element => {
					EnableButton(choice_buttons[i++], element);
				});
			break;

			case "finish":
				script[script_index].text = "";

				window.location.replace("map.html");
			break;

			case "background":
				$(".background").attr("src","images/backgrounds/" + value + ".png");
			break;
		}
	}

	script_index++;
}

// typewriter jquery plugin from https://github.com/chadselph/jquery-typewriter/
// modified to allow for text skipping
(function ( $ ) {
    $.fn.typewrite = function ( options ) {
        var settings = {
            'selector': this,
            'extra_char': '_',
            'delay':    25,
            'trim':     false,
        };
        if (options) $.extend(settings, options);

        function type_next_element(index) {
            var current_element = $(settings.selector[index]);
            var final_text = current_element.text();
            if (settings.trim) final_text = $.trim(final_text);
            current_element.html("").show();

            function type_next_character(element, i) {
                element.html( final_text.substr(0, i)+settings.extra_char );
                if (final_text.length >= i) {
                    setTimeout(function() {
						if (skip) { skip = false; return; }
                        type_next_character(element, i+1);
                    }, settings.delay);
                }
                else {
                    if (++index < settings.selector.length) {
                        type_next_element(index);
                    }
                    else { active = false; }
                }
            }
            type_next_character(current_element, 0);
        }
        type_next_element(0);

        return this;
    };
})(jQuery);