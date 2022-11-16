/**
 * Esta obra está licenciada bajo la Licencia Creative Commons Atribución 4.0 Internacional. 
 * Para ver una copia de esta licencia, visite http://creativecommons.org/licenses/by/4.0/ 
 * o envíe una carta a Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
 * @product javascript selection - jst
 * @version 1.0
 * @autor Dairo Carrasquilla
 * @param {*} arg id del elemento que requiere implementar el selector
 * @returns valor y el texto asociado al item seleccionado
 */
function jst(arg = "") {

    return new class {

        constructor() {

            try {

                if (arg == "") {

                    throw Error("jselect: Identificador vacío.");
                } else if (!document.getElementById(arg)) {
                    
                    throw Error(`jselect: [${arg}] - Identificador no encontrado.`);
                } else {
                    this.__element__ = arg;
                }
            }
            catch (err) {

                console.error(err.message);
            }
        }

        select() {
            try {
                // primero ocultamos y recorremos las opciones del select
                let change, clases, container, select;

                select = document.getElementById(this.__element__);

                if (document.getElementById(String(this.__element__).concat("_selector"))) {

                    let select2 = document.getElementById(String(this.__element__).concat("_selector"));
                    container = select2.parentElement;
                    clases = select2.classList.toString().split(' ');
                    container.removeChild(select2);
                }
                else {
                    container = select.parentElement;

                    if (select.classList.length > 0) {
                        clases = select.classList.toString().split(' ');
                    } else {
                        clases = [];
                    }

                    select.setAttribute("hidden", '');
                    select.removeAttribute("class");
                }
                
                if (select.hasAttribute("onchange")) {
                    change = select.onchange;
                } else {
                    change = () => {
                        return;
                    }
                }

                // creamos el selector nuevo
                this.__select__ = document.createElement("span");
                
                if (clases.length > 0) {
                    this.__select__.classList.add("selectOp", ...clases);
                } else {
                    this.__select__.classList.add("selectOp");
                }

                this.__options__ = [];
                
                // crear los componentes del select
                let contentHidden = document.createElement("div");
                let contentVisible = document.createElement("span");
                let boxFilter = document.createElement("input");
                let contentItems = document.createElement("div");
                let aux = [];

                // agregos las clases que identifican a los componentes
                this.__select__.classList.add("selectOp");
                contentVisible.classList.add("selectOP__content--visible");
                contentHidden.classList.add("selectOP__content--hidden", "hidden");
                boxFilter.classList.add("selectOP__box--filter");
                boxFilter.setAttribute("status", "off");
                contentItems.classList.add("selectOP__content--items");

                boxFilter.addEventListener("keydown", (ev) => {

                    ev.stopPropagation();
                    
                    let text = "";
                    let filter = document.createDocumentFragment();

                    if (ev.key != 'Backspace') {
                        text = String(boxFilter.value).concat(ev.key).toLocaleLowerCase();
                    } else {
                        text = text;
                    }

                    this.__options__.forEach((span) => {

                        if (String(span.textContent).toLocaleLowerCase().includes(text, 0)) {
                            filter.appendChild(span);
                        }

                        
                        // if (span.textContent.toLocaleLowerCase().startsWith(text, 0)) {
                        //     filter.appendChild(span);
                        // }
                    });

                    boxFilter.setAttribute("status", "on");
                    contentItems.innerHTML = "";
                    contentItems.appendChild(filter);
                });

                contentVisible.addEventListener("click", (ev) => {

                    ev.stopPropagation();

                    window.onclick = function () {
                        if (!contentHidden.classList.contains("hidden")) {
                            contentHidden.classList.add("hidden");
                        }
                    }

                    if (contentHidden.classList.contains("hidden")) {
                        contentHidden.classList.remove("hidden");
                    } else {
                        contentHidden.classList.add("hidden");
                    }
                });

                this.__select__.addEventListener("click", (ev) => {

                    ev.stopPropagation();

                    window.onclick = function () {
                        if (!contentHidden.classList.contains("hidden")) {
                            contentHidden.classList.add("hidden");
                        }
                    }

                    if (contentHidden.classList.contains("hidden")) {
                        contentHidden.classList.remove("hidden");
                    } else {
                        contentHidden.classList.add("hidden");
                    }
                });

                contentHidden.addEventListener("click", ev => ev.stopPropagation());
                boxFilter.addEventListener("click", ev => ev.stopPropagation());
                contentHidden.appendChild(boxFilter);
                contentHidden.appendChild(contentItems);

                // recupero los spans que estan definidos en el codigo html a la memoria
                for (let item of select.children) {
                    this.__options__.push(item);
                }

                // si el plugin cargo items se selecciona el primero por defecto
                if (this.__options__.length > 0) {
                    contentVisible.textContent = this.__options__[0].textContent;
                }

                // recorre los items del select original y los agrega al nuevo select
                this.__options__.forEach((opt) => {

                    let span = document.createElement("span");
                    span.setAttribute("value", opt.value);
                    span.textContent = opt.textContent;
                    span.addEventListener("click", (ev) => {

                        ev.stopPropagation();

                        contentVisible.textContent = ev.target.textContent;
                        contentVisible.title = ev.target.textContent;

                        if (contentHidden.classList.contains("hidden")) {
                            contentHidden.classList.remove("hidden");
                        } else {
                            contentHidden.classList.add("hidden");
                        }

                        this.__select__.setAttribute("value", ev.target.getAttribute("value"));
                        this.__select__.setAttribute("text", ev.target.textContent);

                        if (boxFilter.getAttribute("status") == "on") {
                            boxFilter.value = "";
                            contentItems.innerHTML = "";
                            this.__options__.forEach(opt => contentItems.appendChild(opt));
                        }

                        change();
                    });

                    contentItems.appendChild(span);
                    aux.push(span);
                });
                
                this.__options__ = aux;
                this.__select__.appendChild(contentVisible);
                this.__select__.appendChild(contentHidden);

                this.__select__.id = String(this.__element__).concat("_selector");

                if (this.__options__.length > 0)  {
                    this.__select__.setAttribute("text", this.__options__[0].textContent);
                    this.__select__.setAttribute("value", this.__options__[0].getAttribute("value"));

                    if (this.__options__.length > 12) {
                        contentHidden.classList.add("selectOP__content--hidden__height-fixe");
                    }
                }

                container.appendChild(this.__select__);
                select.innerHTML = "";
                return this;
            }
            catch (err) {
                console.error(err);
            }
        }

        text(arg = undefined) {

            let id = String(this.__element__).concat("_selector");
            let select = document.getElementById(id);
            let contentVisible = select.children.item(0);
            let contentItems = select.children.item(1).children.item(1).children;
            let myItem = undefined;

            if (arg == undefined) {

                return select.getAttribute("text");
            } 
            else if (arg == "") {

                contentVisible.textContent = "";
                select.setAttribute("text", "");
                select.setAttribute("value", "0");
            } 
            else {

                for (let item of contentItems) {
                    if (item.textContent == arg) {
                        myItem = item;
                        break;
                    }
                }

                if (myItem) {

                    contentVisible.textContent = arg; 
                    select.setAttribute("text", arg);
                    select.setAttribute("value", myItem.getAttribute("value"));
                } else {

                    contentVisible.textContent = arg;
                    select.setAttribute("text", arg);
                    select.setAttribute("value", "0");
                }
            }
        }

        value(arg = "") {

            let id = String(this.__element__).concat("_selector");
            let select = document.getElementById(id);

            if (arg == "") {

                return select.getAttribute("value");
            } else {

                let contentVisible = select.children.item(0);
                let contentItems = select.children.item(1).children.item(1).children;

                for (let item of contentItems) {
                    if (parseInt(item.getAttribute("value")) == parseInt(arg)) {
                        contentVisible.textContent = item.textContent;
                        select.setAttribute("text", item.textContent);
                        select.setAttribute("value", parseInt(arg));
                        break;
                    }
                }
            }
        }
    }
}
