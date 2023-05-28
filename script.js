function render(text) {
    return text
        .replace(/^### (.*$)/gim, `<h3>$1</h3>`)
        .replace(/^## (.*$)/gim, `<h2>$1</h2>`)
        .replace(/^# (.*$)/gim, `<h1>$1</h1>`)
        .replace(/^###r (.*$)/gim, `<h3 style="color:red">$1</h3>`)
        .replace(/^##r (.*$)/gim, `<h2 style="color:red">$1</h2>`)
        .replace(/^#r (.*$)/gim, `<h1 style="color:red">$1</h1>`)
        .replace(/^###g (.*$)/gim, `<h3 style="color:green">$1</h3>`)
        .replace(/^##g (.*$)/gim, `<h2 style="color:green">$1</h2>`)
        .replace(/^#g (.*$)/gim, `<h1 style="color:green">$1</h1>`)
        .replace(/^###b (.*$)/gim, `<h3 style="color:blue">$1</h3>`)
        .replace(/^##b (.*$)/gim, `<h2 style="color:blue">$1</h2>`)
        .replace(/^#b (.*$)/gim, `<h1 style="color:blue">$1</h1>`)
        .replace(/^> (.*$)/gim, `<blockquote>$1</blockquote>`)
        .replace(/\*\*(.*?)\*\*/gim, `<b>$1</b>`)
        .replace(/\*(.*?)\*/gim, `<i>$1</i>`)
        .replace(/!\[(.*?)]\((.*?)\)/gim, "<img alt=`$1` src=`$2` />")
        .replace(/v\((.*?)\)/gim, "<video width=`320` height=`240` controls preload=`none`><source src=$1 type=`video/mp4`></video>")
        .replace(/\[(.*?)]\((.*?)\)/gim, "<a target=`_blank` href=`$2`>$1</a>")
        .replace(/qr\((.*?)\)/gim, `<img src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=$1' alt='qrcode' />`)
        .replace(/\n$/gim, `<br />`)
        .replace(/^TABLE:\n(.[\s\S]*)END/gm, function (match, capture) {
            let res = "<table>";
            capture.split("\n").forEach(line => {
                if (line != "") {
                    res += "<tr>"
                    line.split("|").forEach(el => {
                        res += `<td>${el.trim()}</td>`;
                    })
                    res += "</tr>"
                }
            });
            return res + "</table>";
        });
}

function play() {
    document.getElementById("render").innerHTML = render(document.getElementById("edit").innerText)
    document.getElementById("edit").style.display = "none";
    document.getElementById("render").style.display = "block";

    document.getElementById("play").classList.add("disabled");
    document.getElementById("save").classList.add("disabled");
    document.getElementById("pause").classList.remove("disabled");
}

function pause() {
    document.getElementById("render").style.display = "none";
    document.getElementById("edit").style.display = "block";
    document.getElementById("edit").focus();

    document.getElementById("play").classList.remove("disabled");
    document.getElementById("save").classList.remove("disabled");
    document.getElementById("pause").classList.add("disabled");
}



function save() {
    let text = [document.getElementById("edit").innerText];
    let file = new File(text, 'note.dhn', {
        type: 'text/plain',
      })
      let link = document.createElement('a');
      let url = URL.createObjectURL(file);
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
    
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

}
/*
 *GESTIONE DEGLI EVENTI 
 */
document.getElementById('inputfile').addEventListener('change', function () {
    try {
        let fr = new FileReader();
        fr.onload = function () {
            document.getElementById("edit").innerHTML = fr.result;
        }
        fr.readAsText(this.files[0]);
        pause();
    } catch (ex) { return }

});

document.onkeydown = (e) => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        save();
    }
    else if(e.ctrlKey && e.key === 'q'){
        if (document.getElementById("edit").style.display === "none") {
            pause()
        }
        else {
            play();
        }
    }
}

document.addEventListener("paste", function(e) {
    e.preventDefault();
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');
    document.execCommand("insertHTML", false, text);
});

window.onbeforeunload = function ()
{
    return "";
};