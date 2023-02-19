const files = {
    'about_me.txt': 'Hi, I am Emirhan (A.K.A. larei).<br>Welcome to my portfolio.',
    'skills.txt': `["Python", "HTML", "CSS", "JavaScript"]`,
    'social.txt': `["<a target="_blank" href="https://github.com/lareithen">github</a>", "<a target="_blank" href="https://open.spotify.com/user/800b0v2zx3p2n6apxfh2bwcfn">spotify</a>"]`
}

let history = $('#history')
let input = $('#input')

$(document).click(function() {
    if (!input.is(':focus')) {
        input.focus();
    }
})

const bulamadim = `<span class="user">you@larei-website</span><span class="symbols">:</span><span class="directory">~</span><span class="symbols">$</span>&nbsp;`

history.html("Welcome to my personal website.<br>Type 'help' to see the list of available commands.<br><br>")

input.keypress(function (event) {
    var key = event.which;
    if (key == 13) {
        history.append(bulamadim + input.val());
        prompt = input.val().split(' ');

        history.append('<br>');
        if (prompt[0] == 'help') {
            history.append('help ls cat clear');
            history.append('<br>');
        } else if (prompt[0] == 'clear') {
            history.html('');
        } else if (prompt[0] == 'ls') {
            history.append(Object.keys(files).join('<br>'));
            history.append('<br>');
        } else if (prompt[0] == 'cat') {
            file = prompt[1];
            if (file in files) {
                history.append(files[file]);
                history.append('<br>');
            } else if (file == undefined) {
                history.append('error: file could not be specified.');
                history.append('<br>');
            } else {
                history.append('error: file not found.');
                history.append('<br>');
            }
        } else {
            history.append(`error: command not found: ${prompt[0]}. Try 'help' to get started.`);
            history.append('<br>');
        }

        input.val('');
    }
    $(".terminal").scrollTop($(".terminal")[0].scrollHeight);
});

// clear çekince br atıyor
