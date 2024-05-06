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
	active = false;

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
	text_area.html(text).typewrite({
		"callback": function() {
			active = false;
		}
	});
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

	for (let [key, value] of Object.entries(script[script_index])) {
		switch (key) {
			case "item":
				value.forEach(element => {
					AddItem(element);
				});
			break;

			case "ally":
				value.forEach(element => {
					AddAlly(element);
				});

				console.log("ally")
			break;

			case "buff":
				value.forEach(element => {
					AddBuff(element);
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

			case "function":
				value();
			return;
		}
	}
	
	WriteText(script[script_index].text);

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
            'callback': null,
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
                    else if (settings.callback) settings.callback();
                }
            }
            type_next_character(current_element, 0);
        }
        type_next_element(0);

        return this;
    };
})(jQuery);