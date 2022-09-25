
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

                if (arg == "") throw Error("jselect: Identificador vacío.");
                else if (!String(arg).startsWith('#')) throw Error(`jselect: [${arg}] - Identificador no valido.`);
                else if (!document.querySelector(arg)) throw Error(`jselect: [${arg}] - Identificador no encontrado.`);
                
                // definición de las propiedades
                this.__select__ = document.querySelector(arg);
                this.__select__.valor = "hola";
                this.__select__.value = "";
                this.__select__.text = "";
                this.__status__ = false;
                this.__options__ = [];

                // crear los componentes del select
                let contentHidden = document.createElement("div");
                let contentVisible = document.createElement("span");
                let boxFilter = document.createElement("input");
                let contentItems = document.createElement("div");

                // agregos las clases que identifican a los componentes
                this.__select__.classList.add("selectOp");
                contentVisible.classList.add("selectOP__content--visible");
                contentHidden.classList.add("selectOP__content--hidden", "hidden");
                boxFilter.classList.add("selectOP__box--filter");
                contentItems.classList.add("selectOP__content--items");

                boxFilter.addEventListener("keydown", (ev) => {

                    ev.stopPropagation();
                    
                    let text = "";
                    let filter = document.createDocumentFragment();

                    (ev.key != 'Backspace') ? (
                        text = String(boxFilter.value).concat(ev.key).toLocaleLowerCase()
                    ): (
                        text = text
                    );

                    this.__options__.forEach((item) => {

                        if (item.textContent.toLocaleLowerCase().startsWith(text, 0)) {
                        
                            filter.appendChild(item);
                        }
                    });

                    contentItems.innerHTML = "";
                    contentItems.appendChild(filter);
                });

                contentVisible.addEventListener("click", (ev) => {

                    ev.stopPropagation();

                    if (!this.__status__) contentHidden.classList.remove("hidden");
                    else contentHidden.classList.add("hidden");

                    this.__status__ = !this.__status__;
                });

                this.__select__.addEventListener("click", (ev) => {

                    ev.stopPropagation();

                    if (!this.__status__) contentHidden.classList.remove("hidden");
                    else contentHidden.classList.add("hidden");
                    
                    this.__status__ = !this.__status__;
                });

                contentHidden.addEventListener("click", ev => ev.stopPropagation());
                boxFilter.addEventListener("click", ev => ev.stopPropagation());
                
                contentHidden.appendChild(boxFilter);
                contentHidden.appendChild(contentItems);

                // recupero los spans que estan definidos en el codigo html a la memoria
                for (let item of this.__select__.children) this.__options__.push(item);

                // limpio el contenedor de html
                this.__select__.innerHTML = "";

                // si el plugin cargo items se selecciona el primero por defecto
                if (this.__options__.length > 0) 
                    contentVisible.textContent = this.__options__[0].textContent;

                // definicion de los eventos de las opciones
                this.__options__.forEach((option) => {
                    
                    option.addEventListener("click", (ev) => {

                        ev.stopPropagation();

                        contentVisible.textContent = ev.target.textContent;
                        contentVisible.title = ev.target.textContent;

                        if (!this.__status__) contentHidden.classList.remove("hidden");
                        else contentHidden.classList.add("hidden");

                        this.__select__.value = ev.target.getAttribute("value");
                        this.__select__.text = ev.target.textContent;
                        this.__status__ = !this.__status__;

                        this.__select__.onclick();
                    });

                    option.title = option.textContent;
                    contentItems.appendChild(option);
                });
    
                this.__select__.appendChild(contentVisible);
                this.__select__.appendChild(contentHidden);

                return {value: this.__select__.value, text: this.__select__.text};
            }
            catch (err) {

                console.error(err.message);
            }
        }
    }
}

