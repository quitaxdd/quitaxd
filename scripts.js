// initalize 
$(document).click(function () {
    if (!input.is(':focus')) {
        input.focus();
    }
})

let audio = new AudioContext();
function beep(){
    let osc = audio.createOscillator();
    let gain = audio.createGain();
    osc.connect(gain);
    gain.connect(audio.destination);
    gain.gain.value = 0.07;
    osc.start(audio.currentTime);
    osc.stop(audio.currentTime + 0.1);
}

let input = $('#input');
let history = $('#history');

let count = 0
let command_history = [""]

// constants
const prompt = `<span class="user">user@quita</span><span class="symbols">:</span><span class="directory">~</span><span class="symbols">$</span>&nbsp;`;

const files = {
    'about_me.txt': `Selamlar. Adım Ramazan. İçerik üreticisiyim. İyi günler dilerim.`,
    'social.txt': `["<a target="_blank" href="https://github.com/Quitaxd">github</a>", "<a target="_blank" href="https://www.youtube.com/@Quitaxd">youtube</a>", "<a target="_blank" href="https://discord.com/users/723148774137921738">discord</a>"]`
}

const commands = {
    'help': 'guess what?',
    'ls': 'lists the directory contents.',
    'cat': 'prints the specified file.',
    'clear': 'clears the terminal history.',
}

// controller func
function cmd_controller(input_value) {
    let [cmd, ...args] = input_value
        .split(' ')
        .filter((arg) => {return arg.trim() !== ""})

    if (cmd == undefined) {
        null
    } else {
        command_history.push(input_value)

        if (Object.keys(commands).includes(cmd)) {
            if (cmd == 'help') {
                history.append(Object.entries(commands)
                    .map(command => command.join(': '))
                    .join('<br>')
                )
            } else if (cmd == 'ls') {
                history.append(Object.keys(files).join('<br>'))
            } else if (cmd == 'clear') {
                history.html('')
            } else if (cmd == 'cat') {
                if (args.length != 0) {
                    file = files[args[0]]
                    if (file != undefined) {
                        history.append(file)
                    } else {
                        history.append('error: file not found.')
                    }
                } else {
                    history.append('error: file not specified.')
                }
            }
        } else {
            history.append(`error: command not found: ${cmd}. Try 'help' to get started.`)
        }
    }
}

// input event
$('#prompt').html(prompt)
input.keydown(function (event) {
    let key = event.which;
    let input_value = input.val()

    if (key == 13) { // enter
        history.append(prompt + input_value);
        history.append('<br>');
        cmd_controller(input_value)
        history.append(history.html() && input_value ? '<br>' : '');

        input.val('');
    }

    if (key == 38) { // arrow up - next
        if (count > -command_history.length + 1) {
            count -= 1
        } else {
            beep()
        }

        input.val(command_history.at(count))
    }

    if (key == 40) { // arrow down - previous
        if (count < 0) {
            count += 1
            input.val(command_history.at(count))
        } else {
            beep()
        }
    }

    // autofill
    let all_args = [...Object.keys(files), ...Object.keys(commands)]
    let possible_args = []
    
    if (key == 9) { // tab
        event.preventDefault()
        
        if (input_value.length > 1) {
            args = input_value
                .split(' ')
                .filter((arg) => {return arg.trim() !== ""})
            
            for (let i = 0; i < all_args.length; i++){
                arg = all_args[i]
                if (arg.startsWith(args.at(-1))) {
                    possible_args.push(arg)
                }
            }

            if (possible_args.length > 1) {
                history.append(prompt + input_value)
                history.append('<br>')
                history.append(possible_args.join(' '))
                history.append('<br>')
            } else if (possible_args.length == 1) {
                args.pop(-1)
                input.val(args.length > 0 ? args.join(' ') + ' ' + possible_args : possible_args)
                //input.val(input_value.replace(args.at(-1), possible_args))
            } else {
                beep()
            }
        } else {
            beep()
        }
    }

    $(".terminal").scrollTop($(".terminal")[0].scrollHeight);
});
