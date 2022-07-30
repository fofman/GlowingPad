function loadSize() {
    document.querySelectorAll(".editBox").forEach(element => {
        element.style.height += element.scrollHeight + "px";
    });
}

function autoResize() {
    document.querySelectorAll(".editBox").forEach(function (element) {
        element.style.boxSizing = 'border-box';
        var offset = element.offsetHeight - element.clientHeight;
        element.addEventListener('input', function (event) {
            event.target.style.height = 'auto';
            event.target.style.height = event.target.scrollHeight + offset + 'px';
        });
    });
}

function render(text) {
    let result = document.createElement("div");
    result.className = "boxText renderBox";
    let buffer = "";
    for (var i = 0; i < text.length; i++) {
        while (text[i] !== "\n") {
            if (text[i] === "<") buffer = buffer.concat("&lt;");//per evitare la creazione di tag html
            else if (text[i] === ">") buffer = buffer.concat("&gt;");
            else buffer = buffer.concat(text[i]);
            i++;
        }
        if (buffer === "") {
            result.insertAdjacentHTML("beforeend", `<br>`);
        } else if (buffer[0] === "#" && buffer[1] === "#") {
            buffer = buffer.substring(2);
            result.insertAdjacentHTML("beforeend", `<h1>${buffer}</h1>`);
        } else if (buffer[0] === "=" && buffer[1] === "=") {
            buffer = buffer.substring(2);
            try {
                result.insertAdjacentHTML("beforeend", `<div>${buffer} = <b>${eval(buffer)}</b></div>`);
            } catch (ex) {
                console.log(ex)
                result.insertAdjacentHTML("beforeend", `<div>ERROR</div>`);
            }
        } else if (buffer === "!line") {
            result.insertAdjacentHTML("beforeend", `<hr>`);
        } else if (buffer[0] === "-") {
            result.insertAdjacentHTML("beforeend", `<div>&nbsp;${buffer}</div>`);
        } else result.insertAdjacentHTML("beforeend", `<div>${buffer}</div>`);
        buffer = "";
    }

    console.log(result);
    return result;
}

function download(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function play(btn) {
    let box = btn.parentElement.parentElement.parentElement;

    let textBox = box.children[1];

    textBox.style.display = "none";//nascondo l'editbox
    btn.style.display = "none";//nascondo il bottone play
    box.firstElementChild.firstElementChild.lastElementChild.style.display = "inline";//mostro il bottone pause
    box.lastElementChild.style.display = "none";//nascondo il minimize

    box.children[1].insertAdjacentElement("afterend",render(textBox.value + "\n"));//inserimento degli oggetti renderizzati
}

function pause(btn) {
    let box = btn.parentElement.parentElement.parentElement;

    box.removeChild(box.children[2]);//cancellazione del renderbox
    let editBox = box.children[1];
    editBox.style.display = "block";

    btn.style.display = "none";//nascondo il bottone pause
    box.firstElementChild.firstElementChild.firstElementChild.style.display = "inline";//mostro il bottone play
    box.lastElementChild.style.display = "block";//mostro il minimize
}

function delContent(btn) {
    let box = btn.parentElement.parentElement.parentElement;
    if(box.lastElementChild.className!=="reduce"){
        box.children[1].value = "";
    }
}

function delBox(btn) {
    let box = btn.parentElement.parentElement.parentElement;
    box.remove();
}

function minimize(btn) {
    let editBox = btn.parentElement.children[1];
    //console.log(editBox);
    //console.log(editBox.style.height);
    if (editBox.style.height !== "64px") {
        editBox.style.height = "64px";
        btn.innerHTML=`<i class="bi bi-chevron-compact-down"></i>`;
    } else {
        //console.log(editBox.scrollHeight);
        editBox.style.height=`${editBox.scrollHeight}px`;
        btn.innerHTML=`<i class="bi bi-chevron-compact-up"></i>`
    }
}

function add(content) {
    let parent = document.getElementById("app");
    parent.insertAdjacentHTML("beforeend", `
    <div class="box">
    <div class="optBox">
        <span class="leftOpt">
            <i class="optIcon bi bi-play" onclick="play(this)"></i>
            <i class="optIcon bi bi-pause" onclick="pause(this)" style="display:none;"></i>
        </span>
        &nbsp
        <span class="rightOpt">
            <i class="optIcon bi bi-eraser" onclick="delContent(this)"></i>
            <i class="optIcon bi bi-x-circle warning" onclick="delBox(this)"></i>
        </span>
    </div>
    <textarea class="boxText editBox" rows="3" placeholder="Premi qui per scrivere">${content}</textarea>
    <div class="minimize" onclick="minimize(this)"><i class="bi bi-chevron-compact-up"></i></div>
    </div>
    `);
    autoResize();
}

function save(name) {
    let texts = [];
    let elements = document.querySelectorAll(".editBox");
    elements.forEach(box => {
        texts.push(box.value);
    });
    //console.log(texts);
    if (name !== "") {
        download(`${name}.dhn`, texts.join(""));
    } else {
        download(`untitled.dhn`, texts.join(""));
    }
}

//file reader
document.getElementById('inputfile').addEventListener('change', function () {
    let fr = new FileReader();
    fr.onload = function () {
        document.getElementById("app").innerHTML = '';
        let text = fr.result;
        let texts = text.split("");
        texts.forEach(content => {
            add(content);
            loadSize();
        });
    }

    fr.readAsText(this.files[0]);
})


//per il primo .box
add("");


