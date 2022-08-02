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
    let text = textBox.innerText;

    textBox.style.display = "none";//nascondo l'editbox
    btn.style.display = "none";//nascondo il bottone play
    box.firstElementChild.firstElementChild.lastElementChild.style.display = "inline";//mostro il bottone pause
    box.lastElementChild.style.display = "none";//nascondo il minimize

    box.children[1].insertAdjacentElement("afterend", render(text + "\n"));//inserimento degli oggetti renderizzati

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
    if (box.lastElementChild.className !== "reduce") {
        box.children[1].innerText = "";
    }
}

function delBox(btn) {
    let box = btn.parentElement.parentElement.parentElement;
    box.remove();
}

function minimize(btn) {
    let editBox = btn.parentElement.children[1];
    if (editBox.style.height !== "64px") {
        editBox.style.height = "64px";
        btn.innerHTML = `<i class="bi bi-chevron-compact-down"></i>`;
    } else {
        //console.log(editBox.scrollHeight);
        editBox.style.height = "auto";
        btn.innerHTML = `<i class="bi bi-chevron-compact-up"></i>`
    }
}

function add(category, content) {
    let parent = document.getElementById("app");
    parent.insertAdjacentHTML("beforeend", `
    <div class="box">
    <div class="optBox">
        <span class="leftOpt">
            <i class="optIcon bi bi-play" onclick="play(this)"></i>
            <i class="optIcon bi bi-pause" onclick="pause(this)" style="display:none;"></i>
        </span>
        <span class="rightOpt">
            <input class="inputBox" name="category" value="${category}">
            <i class="optIcon bi bi-eraser" onclick="delContent(this)"></i>
            <i class="optIcon bi bi-x-circle warning" onclick="delBox(this)"></i>
        </span>
    </div>
    <div class="boxText editBox" contentEditable>${content}</div>
    <div class="minimize" onclick="minimize(this)"><i class="bi bi-chevron-compact-up"></i></div>
    </div>
    `);
}

function setFilter(selector) {
    let app = document.getElementById("app").children;

    for (let i = 0; i < app.length; i++) {
        app[i].style.display = "block";
    }

    for (let i = 0; i < app.length; i++) {
        if (app[i].firstElementChild.lastElementChild.firstElementChild.value !== selector.value) {
            app[i].style.display = "none";
        }
        if (selector.value === "") {
            app[i].style.display = "block";
        }
    }
    document.getElementById("category").remove();
}

function filterDoc(btn) {
    let app = document.getElementById("app").children;
    let categories = [];

    for (let i = 0; i < app.length; i++) {
        categories.push(app[i].firstElementChild.lastElementChild.firstElementChild.value);
    }

    categories = new Set(categories);

    categories.delete("");
    if (categories.size === 0) {
        return false;
    }
    if (document.getElementById("appBar").firstElementChild.lastElementChild.id !== "category") {
        document.getElementById("appBar").firstElementChild.insertAdjacentHTML("beforeend", "<select id='category' onchange='setFilter(this)'><option value='' selected hidden disabled>No Filter</option><option value=''>All</select>")

        categories.forEach(category => {
            document.getElementById("category").insertAdjacentHTML("beforeend", `<option>${category}</option>`);
        });
    }

}

function save(name) {
    let texts = [];
    let categories = [];
    let elements = document.querySelectorAll(".editBox");
    elements.forEach(box => {
        if(box.innerText.split(/\r\n|\r|\n/).length>1){
            texts.push(box.innerText.slice(0,-1));
        }
        else{
            texts.push(box.innerText);
        }
    });

    elements = document.querySelectorAll("[name='category']");
    elements.forEach(category => {
        categories.push(category.value);
    });

    texts = texts.join("");
    texts += "";
    texts += categories.join("");

    console.log(texts);

    if (name !== "") {
        download(`${name}.dhn`, texts);
    } else {
        download(`untitled.dhn`, texts);
    }
}

//file reader
document.getElementById('inputfile').addEventListener('change', function () {
    let fr = new FileReader();

    fr.onload = function () {
        document.getElementById("app").innerHTML = '';
        let buffer = "";
        let text = fr.result;
        let parts = text.split("")
        let texts = parts[0].split("");
        let categories = parts[1].split("");

        for (let i = 0; i < texts.length; i++) {
            let lines = texts[i].split("\n");
            let category = categories[i];

            for (let i = 0; i < lines.length; i++) {
                buffer += lines[i] + "<br>";
            }

            add(category, buffer);
            buffer = "";
        }
    }

    fr.readAsText(this.files[0]);
    document.getElementById("name").value = this.files[0].name.slice(0, -4);
    //console.log(this.files[0].name);
})

//per il primo .box
add("", "");