/** notes pour ce TP :
 *  Utilisation de certaines fonctionalités EcmaScript7, prises en charge par la majorité des navigateurs
 *  Explications des différents choix ergonomiques :
 *  - Suppression d'un élément :
 *    Afin de rester simple, le bouton modifier devient annuler et supprimer confirmer.
 *    Permet une suppression rapide en double-cliquant sur supprimer tout en évitant la suppression inopinée
 *    dûe à un clique inintentionnel ou un manque d'habitude de l'application web
 *  - Sélecteur du type de véhicule :
 *    Permet une sélection plus rapide qu'une liste déroulante et plus visuelle que de simples boutons radios
 *  - La modification se fait directement dans la ligne, pour être plus simple
 *  - Chaque notification a une couleur clair correspondant à son action
 *  - Utiisation des Glyphicons de Google.
 *
 *  - Quelques aveux et améliorations possibles :
 *    -- J'ai un peu triché pour rendre le tableau responsive... J'ai changé le display des éléments dans le CSS
 *    -- Modifier les éléments à partir de ce qui est dans inner text n'est vraiment pas une bonne idée.
 *       J'aurais peut-être dû stocker les données texte séparément
 *    -- listOfParkingJSON aurait pu être un élément statique de Row
 *
 *
 * **/
(function () {

    var listOfParkingJSON = [];

    function notification(text, color) {
        let container = document.createElement('div');
        let spanMessage = document.createElement('span');
        spanMessage.innerHTML = text;

        container.classList.add('notification');
        container.style.backgroundColor = color;
        container.appendChild(spanMessage);
        let notificationZone = document.getElementById('notification-zone');
        notificationZone.appendChild(container);
        container.style.opacity = 100;
        window.setTimeout(function () {
            container.style.opacity = 0;
            window.setTimeout(function () {
                notificationZone.removeChild(container);
            }, 500);
        }, 5000)
    }

    class Row {
        constructor(nom, type, loc, mail, nbPlace) {
            this.rendered = false;
            this.stateDel = 0;
            this.stateModify = 0;
            this.th_nom = document.createElement('th');
            this.th_nom.innerText = nom;
            this.th_nom.classList.add('nom-e');


            this.td_type = document.createElement('td');
            this.td_type.innerText = type;
            this.td_type.classList.add('type-e');

            this.td_loc = document.createElement('td');
            this.td_loc.innerText = loc;
            this.td_loc.classList.add('loc-e');

            this.td_email = document.createElement('td');
            this.td_email.innerText = nbPlace;
            this.td_email.classList.add('mail-e');

            this.td_nbplaces = document.createElement('td');
            this.td_nbplaces.innerText = mail;
            this.td_nbplaces.classList.add('nbplaces');


            this.btn_del = document.createElement('button');

            this.btn_del.classList.add('material-icons');
            this.btn_del.innerText = "delete";
            this.btn_upd = document.createElement('button');
            this.btn_upd.classList.add('material-icons');
            this.btn_upd.innerText = 'edit';

            this.btn_del.classList.add('btn');
            this.btn_del.classList.add('btn-outline-danger');
            this.btn_upd.classList.add('btn');
            this.btn_upd.classList.add('btn-outline-primary');

            this.btn_upd.classList.add('btn-sib');
            this.btn_del.classList.add('btn-sib');


            this.td_gestion = document.createElement('td');
            this.td_gestion.style.minWidth = '150px';
            this.td_gestion.appendChild(this.btn_upd);
            this.td_gestion.appendChild(this.btn_del);
            this.td_gestion.classList.add('gestion');


            this.tr = document.createElement('tr');
            this.tr.appendChild(this.th_nom);
            this.tr.appendChild(this.td_type);
            this.tr.appendChild(this.td_loc);
            this.tr.appendChild(this.td_email);
            this.tr.appendChild(this.td_nbplaces);
            this.tr.appendChild(this.td_gestion);

            this.btn_del.addEventListener('click', evt => this.delBtn(evt));
            this.btn_upd.addEventListener('click', evt => this.mdfBtn(evt));
            listOfParkingJSON.push({nom: nom, obj: this});

        }

        delBtn(evt) {
            if (this.stateDel === 0 && this.stateModify === 0) {
                this.stateDel = 1;
                this.btn_del.className = '';
                this.btn_del.classList.add('btn');
                this.btn_del.classList.add('btn-sib');
                this.btn_del.classList.add('btn-danger');

                this.btn_upd.className = '';
                this.btn_upd.classList.add('btn');
                this.btn_upd.classList.add('btn-sib');
                this.btn_upd.classList.add('btn-outline-danger');

                this.btn_upd.classList.add('material-icons');
                this.btn_del.classList.add('material-icons');

                this.btn_del.innerHTML = 'check';
                this.btn_upd.innerHTML = 'close'
            }
            else if (this.stateDel === 1) {
                this.tr.parentNode.removeChild(this.tr);
                for (let i = 0; i < listOfParkingJSON.length; i++) {
                    if (listOfParkingJSON[i].obj === this) {
                        listOfParkingJSON.splice(i, 1);
                    }
                }
                notification('Le parking a bien été supprimé !', '#dc3545')
            }
            else if (this.stateModify === 1) {

                if (
                    !this.th_nom.firstChild.checkValidity() ||
                    !this.td_email.firstChild.checkValidity() ||
                    !this.td_loc.firstChild.checkValidity() ||
                    !this.td_nbplaces.firstChild.checkValidity()
                ) {
                    return;
                }

                this.stateModify = 0;
                let nom = this.th_nom.firstChild.value;
                this.th_nom.removeChild(this.th_nom.firstChild);

                let loc = this.td_loc.firstChild.value;
                this.td_loc.removeChild(this.td_loc.firstChild);

                let nbplaces = this.td_nbplaces.firstChild.value;
                this.td_nbplaces.removeChild(this.td_nbplaces.firstChild);

                let email = this.td_email.firstChild.value;
                this.td_email.removeChild(this.td_email.firstChild);


                this.td_type.removeChild(this.td_type.firstChild);
                let type = this.td_type.firstChild.value;
                this.td_type.removeChild(this.td_type.firstChild);

                this.th_nom.textContent = nom;
                this.td_loc.textContent = loc;
                this.td_nbplaces.textContent = nbplaces;
                this.td_type.textContent = type;
                this.td_email.textContent = email;

                this.btn_del.className = '';
                this.btn_del.classList.add('btn');
                this.btn_del.classList.add('btn-sib');
                this.btn_del.classList.add('btn-outline-danger');

                this.btn_upd.className = '';
                this.btn_upd.classList.add('btn');
                this.btn_upd.classList.add('btn-sib');
                this.btn_upd.classList.add('btn-outline-primary');
                this.btn_upd.classList.add('material-icons');
                this.btn_del.classList.add('material-icons');

                this.btn_del.innerHTML = 'delete';
                this.btn_upd.innerText = 'edit';
                this.btn_upd.blur();

                for (let i = 0; i<listOfParkingJSON.length; i++){
                    if(listOfParkingJSON [i].obj===this){
                        console.log(nom);
                        listOfParkingJSON[i].nom=nom;
                    }
                }
                notification('Le parking ' + nom + ' a été mdifié !', '#007bff')

            }
        }

        hide() {
            if (this.rendered) {
                this.tr.parentNode.removeChild(this.tr);
                this.rendered = false;
            }
        }

        mdfBtn(evt) {
            if (this.stateDel === 1) {
                this.stateDel = 0;
                this.btn_del.className = '';
                this.btn_del.classList.add('btn');
                this.btn_del.classList.add('btn-sib');
                this.btn_del.classList.add('btn-outline-danger');

                this.btn_upd.className = '';
                this.btn_upd.classList.add('btn');
                this.btn_upd.classList.add('btn-sib');
                this.btn_upd.classList.add('btn-outline-primary');
                this.btn_upd.classList.add('material-icons');
                this.btn_del.classList.add('material-icons');

                this.btn_del.innerHTML = 'delete';
                this.btn_upd.innerText = 'edit';
                this.btn_upd.blur();


            }
            else if (this.stateDel === 0 && this.stateModify === 0) {
                this.stateModify = 1;

                this.oldValueNom = this.th_nom.innerText;
                this.oldValueLoc = this.td_loc.innerText;
                this.oldValueType = this.td_type.innerText;
                this.oldValueMail = this.td_nbplaces.innerText;
                this.oldValueNbPlace = this.td_email.innerText;

                this.btn_del.className = '';
                this.btn_del.classList.add('btn');
                this.btn_del.classList.add('btn-sib');
                this.btn_del.classList.add('btn-primary');

                this.btn_upd.className = '';
                this.btn_upd.classList.add('btn');
                this.btn_upd.classList.add('btn-sib');
                this.btn_upd.classList.add('btn-outline-danger');


                this.btn_upd.classList.add('material-icons');
                this.btn_del.classList.add('material-icons');

                this.btn_del.innerHTML = 'check';
                this.btn_upd.innerHTML = 'close';

                let e1 = document.createElement('input');
                e1.type = 'text';
                e1.required = true;
                e1.style.maxWidth = '100px';
                let tdTypeContent = this.td_type.textContent;
                this.td_type.innerText = "";
                new Selector(this.td_type, null, tdTypeContent);// à modifier par un selector
                let e3 = document.createElement('input');
                e3.type = 'text';
                e3.required = true;
                e3.style.maxWidth = '200px';
                let e4 = document.createElement('input');
                e4.type = 'number';
                e4.min = 1;
                e4.style.maxWidth = '100px';
                let e5 = document.createElement('input');
                e5.required = true;
                e5.type = 'email';


                e1.value = this.th_nom.innerText;
                e3.value = this.td_loc.innerText;
                e4.value = this.td_nbplaces.innerText;
                e5.value = this.td_email.innerText;

                e1.classList.add('form-control');
                e3.classList.add('form-control');
                e4.classList.add('form-control');
                e5.classList.add('form-control');

                this.th_nom.innerText = "";
                this.td_loc.innerText = "";
                this.td_nbplaces.innerText = "";
                this.td_email.innerText = "";

                this.th_nom.appendChild(e1);
                this.td_loc.appendChild(e3);
                this.td_nbplaces.appendChild(e4);
                this.td_email.appendChild(e5);
            }

            else if (this.stateModify === 1) {
                this.stateModify = 0;
                this.th_nom.removeChild(this.th_nom.firstChild);
                this.td_loc.removeChild(this.td_loc.firstChild);
                this.td_nbplaces.removeChild(this.td_nbplaces.firstChild);
                this.td_email.removeChild(this.td_email.firstChild);
                this.td_type.removeChild(this.td_type.firstChild);
                this.td_type.removeChild(this.td_type.firstChild);

                this.th_nom.textContent = this.oldValueNom;
                this.td_loc.textContent = this.oldValueLoc;
                this.td_nbplaces.textContent = this.oldValueMail;
                this.td_type.textContent = this.oldValueType;
                this.td_email.textContent = this.oldValueNbPlace;

                this.btn_del.className = '';
                this.btn_del.classList.add('btn');
                this.btn_del.classList.add('btn-sib');
                this.btn_del.classList.add('btn-outline-danger');

                this.btn_upd.className = '';
                this.btn_upd.classList.add('btn');
                this.btn_upd.classList.add('btn-sib');
                this.btn_upd.classList.add('btn-outline-primary');
                this.btn_upd.classList.add('material-icons');
                this.btn_del.classList.add('material-icons');

                this.btn_del.innerHTML = 'delete';
                this.btn_upd.innerText = 'edit';
                this.btn_upd.blur();

            }
        }

        render() {
            if (!this.rendered) {
                document.getElementById("content-tab").appendChild(this.tr);
                this.rendered = true;
            }
        }
    }


    class Selector {
        constructor(parent, id = null, defaultValue = "Voiture") {
            let c = document.createElement('div');
            c.classList.add('selector');
            this.btnDivCar = document.createElement('div');
            this.btnDivByc = document.createElement('div');

            this.btnDivCar.dataset.type = 'Voiture';
            this.btnDivByc.dataset.type = 'Vélo';

            this.btnDivCar.classList.add('material-icons');
            this.btnDivByc.classList.add('material-icons');

            this.btnDivByc.classList.add('selector-type');
            this.btnDivCar.classList.add('selector-type');
            this.btnDivCar.classList.add('md-light');
            this.btnDivByc.classList.add('md-light');

            this.btnDivCar.innerText = 'directions_car';
            this.btnDivByc.innerText = 'directions_bike';


            this.btnDivCar.addEventListener('click', evt => this.setSelected(evt));
            this.btnDivByc.addEventListener('click', evt => this.setSelected(evt));

            this.input = document.createElement('input');
            this.input.type = 'hidden';
            this.input.value = defaultValue;
            if (id != null) {
                this.input.id = id;
            }

            if (defaultValue === 'Voiture') {
                this.btnDivCar.classList.add('selector-type-selected');
            }
            else if (defaultValue === 'Vélo') {
                this.btnDivByc.classList.add('selector-type-selected');
            }

            c.appendChild(this.btnDivCar);
            c.appendChild(this.btnDivByc);

            parent.appendChild(c);
            parent.appendChild(this.input);
        }

        setSelected(evt) {
            this.btnDivCar.classList.remove('selector-type-selected');
            this.btnDivByc.classList.remove('selector-type-selected');

            evt.currentTarget.classList.add('selector-type-selected');
            this.input.value = evt.currentTarget.dataset.type;
        }

    }


    new Selector(document.getElementById('form-selector'), 'inputType');
    let form = document.getElementById('in-form');
    let sear = document.getElementById('search-parking');


    form.addEventListener('submit', function (evt) {
        evt.preventDefault();

        new Row(
            document.getElementById('nom').value,
            document.getElementById('inputType').value,
            document.getElementById('localisation').value,
            document.getElementById('nbPlace').value,
            document.getElementById('email').value);
        notification('Le parking ' + document.getElementById('nom').value + ' a été bien été ajouté à la liste !', '#28a745');
        renderAll();
    });

    sear.addEventListener('keyup', function (e) {
        let v = e.target.value;
        regexp = new RegExp(v);
        for (let i = 0; i < listOfParkingJSON.length; i++) {
            listOfParkingJSON[i].obj.hide();
        }
        for (let i = 0; i < listOfParkingJSON.length; i++) {
            if (listOfParkingJSON[i].nom.match(regexp))
                listOfParkingJSON[i].obj.render();
        }

    });

    function renderAll() {
        for (let i = 0; i < listOfParkingJSON.length; i++) {
            listOfParkingJSON[i].obj.render();
        }
    }

    new Row('Daubié', 'Voiture', '1.224325, 1.1524325', 155, 'xample@example.fr').render();
    new Row('Thémis', 'Voiture', '1.2234525, 1.154325', 12, 'anthony.b@example.fr').render();
    new Row('Nautilus', 'Vélo', '1.2223445, 1.3244155', 12, 'email@lyon1.fr').render();
    new Row('Grignard', 'Voiture', '1.2254323, 1.1532355', 15, 'thisisamail@example.fr').render();

})();