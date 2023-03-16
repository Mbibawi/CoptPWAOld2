var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const copticReadingsDates = getCopticReadingsDates();
document
    .getElementById("elID")
    .addEventListener("keypress", (e) => {
    let el = e.target;
    if (e.key == "Enter" && el.value.startsWith("&D=")) {
        changeDay(el.value.split("&D=")[1]);
    }
}); //this is temporary in order to change the date manually by entering a date in the text box
document
    .getElementById("datePicker")
    .addEventListener("change", (e) => {
    let el = e.target;
    console.log("date value = ", el.value.toString());
    changeDay(el.value.toString());
});
toggleDevBtn.addEventListener("click", () => openDev(toggleDevBtn));
document.getElementById('settings').addEventListener('click', () => openDev(document.getElementById('settings')));
/**
 * Adds or removes a language to the userLanguages Array
 * @param el {HTMLElement} - the html button on which the user clicked to add or remove the language. The language is retrieved from the element's dataset
 */
function addOrRemoveLanguage(el) {
    let lang;
    lang = el.dataset.lang;
    //we check that the language that we need to add is included in the userLanguages array
    if (userLanguages.indexOf(lang) > -1) {
        //The language is included in the userLanguages
        if (lang == 'CA' && userLanguages.indexOf('COP') == -1) {
            userLanguages.splice(userLanguages.indexOf(lang), 1, 'COP');
        }
        else if (lang == 'EN' && userLanguages.indexOf('FR') == -1) {
            userLanguages.splice(userLanguages.indexOf(lang), 1, 'FR');
        }
        else {
            userLanguages.splice(userLanguages.indexOf(lang), 1);
        }
        ;
        el.innerText = el.innerText.replace("Remove", "Add");
    }
    else if (userLanguages.indexOf(lang) == -1) {
        //The language is not included in user languages, we will add it
        //if the user adds the Coptic in Arabic characters, we assume he doesn't need the Coptic text we do the same for English and French
        if (lang == 'CA' && userLanguages.indexOf('COP') > -1) {
            userLanguages.splice(userLanguages.indexOf('COP'), 1, lang);
        }
        else if (lang == 'EN' && userLanguages.indexOf('FR') > -1) {
            userLanguages.splice(userLanguages.indexOf('FR'), 1, lang);
            console.log(userLanguages);
        }
        else {
            userLanguages.push(lang);
        }
        ;
        el.innerText = el.innerText.replace("Add", "Remove");
    }
    ;
    //in order to refresh the view after adding or removing a language, we call the showChildButtonsOrPrayers passing to it the lasClickedButton which is a variable storing the last clicked sideBar Button (its class is Button) that is displaying its prayers/children/inlineBtns, etc.,
    showChildButtonsOrPrayers(lastClickedButton);
}
/**
 * Changes the current Gregorian date and adjusts the coptic date and the coptic readings date, etc.
 * @param {string} date  - allows the user to pass the Greogrian calendar day to which he wants the date to be set, as a string provided from an input box or by the date picker
 * @param {boolean} next  - used when the user wants to jumb forward or back by only one day
 * @param {number} days  - the number of days by which the user wants to jumb forward or back
 * @returns {Date} - the Gregorian date as set by the user
 */
function changeDay(date, next = true, days = 1) {
    let currentDate = todayDate.getTime();
    if (date) {
        currentDate = new Date(date).getTime();
        todayDate.setTime(currentDate);
        console.log(todayDate);
    }
    else {
        if (next) {
            todayDate.setTime(currentDate + (days * calendarDay));
        }
        else if (!next) {
            todayDate.setTime(currentDate - (days * calendarDay));
        }
    }
    setCopticDates(todayDate);
    return todayDate;
}
;
autoRunOnLoad();
/**
 * Some functions that we run automatically when loading the app
 */
function autoRunOnLoad() {
    let version = 'v0.3';
    let p = document.createElement('p');
    p.style.color = 'red';
    p.style.fontSize = '15pt';
    p.style.fontWeight = "bold";
    p.innerText = version;
    document.getElementById('InstallPWA').appendChild(p);
    showChildButtonsOrPrayers(btnMain);
    //appendRepeatable('Test');
    setCopticDates();
    allDivs = document.querySelectorAll("div");
    //console.log("all nodes count = ", document.querySelectorAll("*").length);
    setButtonsPrayers();
    DetectFingerSwipe();
    //copticReadingsDate = '0101';
    //registerServiceWorker()
    //PWA();
}
;
/**
 * gets a prayer id from an input box and passes it directly to showPrayers() to display it
 */
function getPrayerFromInputBox() {
    let input = document.getElementById("elID");
    showPrayers(new Button({ btnID: '', label: { AR: '', FR: '' }, prayers: [input.value] }));
}
;
/**
 * Looks for the button's prayers ids (provided in the btn.prayers array) in the btn.prayersArray (which is an array containing all the text in which the button may find the text of its prayers), and sets the btn.retrieve to true, and the btn.prayersArray to those prayers having an id (i.e. their first element) matching one of the prayer ids provided in the btn.prayers array
 * @param {Button || inlineButton} btn - the button for which we will be setting its prayersArray to a shorter list of prayers, each matching a prayerID included in the btn.prayers array of ids
 * @param {string} prayerID - a prayer id which we will be looking for in the btn.prayersArray
 * @param {HTMLElement} rightTitlesDiv
 * @returns {string[][]} - an array containing a shortened list of prayers, each being an array containing the id of the prayer, and its text. Each element is structured like ['prayer id', 'prayer text in a given language', 'prayer text in another language', etc.]
 */
function retrieveButtonPrayersFromItsPrayersArray(btn, prayerID, rightTitlesDiv) {
    let date, idsArray = [], retrievedPrayersArray = [];
    if (prayerID.includes('&D=') || prayerID.includes('&S=')) {
        //if the id of the prayer include the value '&D=' this tells us that this prayer is either not linked to a specific day in the coptic calendar (&D=0000), or the date has been set by the button function (e.g.: PrayerGospelResponse&D=GreatLentWeek). In this case, we will not add the copticReadingsDate to the prayerID
        //Similarly, if the id includes 'Season=', it tells us that it is not linked to a specific date but to a given period of the year. We also keep the id as is without adding any date to it
        date = '';
    }
    else {
        date = '&D=' + copticReadingsDate; //this is the default case where the date equals the copticReadingsDate. This works for most of the occasions.
    }
    ;
    idsArray.push(prayerID + date + "Title", prayerID + date); //we add 2 versions of the prayerID to the idsArray: the first version ends with 'Title', the second version does not end with 'Title' (this gives us an ids array like this ['aPrayerID&D=0101Title', 'aPrayerID&D=0101']). We will look for each version of the prayer id in the PrayersArray
    retrievedPrayersArray = retrievePrayers(idsArray, btn);
    if (rightTitlesDiv) {
        showTitlesInRightSideBar(btn.titlesArray, rightTitlesDiv);
    }
    ;
    return retrievedPrayersArray;
}
;
/**
 * WILL BE DEPRECATED: Takes the idsArray which is an array of 2 elements: the 1st is the id of the prayer + 'Title, the 2nd is the id of the prayer
 * it then looks in the btnPrayersArray (an array in which the text of the prayers that need to be retrieved by the button is found) for each of the element in the idsArray. Each element in btnPrayersArray is an array which 1st element is the id of the prayer. So we will check if the 1st element of the array matches either the 1st element of idsArray, either its second element. If there is a match, we take the array of prayers and show its text
 * @param {string[]} idsArray - array of 2 elements like ['prayerIDTitle', 'prayerID']
 * @param {string[][]} btnPrayersArray - array wher the text of the prayers that the button needs to show are found
 * @param {string[]} titlesArray - array containing the titles of the prayers that the button will show. Otherwise said, it is an array of all the 1st elements of the idsArray generated by the button
 * @param languagesArray - the languages in which the prayers of the button are available (some prayers like the readings are not available in Coptic, but only in Arabic, English and French. Other prayers are not available in English but only in English. This depends on the ppts from which we retrieved the text)
 * @returns {boolean} - telling whether the prayer id in the idsArray matched a prayer in the btnPrayersArray, or no prayer with this id was found
 */
function retrievePrayers(idsArray, //this is the btn.prayers array property
btn) {
    if (btn.retrieved) {
        return btn.prayersArray;
    }
    else if (!btn.retrieved) {
        return retrievePrayers(); // we return the array containing all the text retrieved for the button
    }
    ;
    function retrievePrayers() {
        let retrievedPrayersArray = [];
        btn.prayersArray.map(p => processPrayers(btn, p, retrievedPrayersArray, idsArray));
        return retrievedPrayersArray;
    }
    ;
}
;
/**
 * WILL BE DEPRECATED
 * @param {Button | inlineButton} btn
 * @param {string[] | string[][]} prayer - prayer either represents a row of the Word table from which the text was retrieved (i.e., prayer is a string[], where the first element is the title of the table: ['TableTitle', 'TextOfCell1OfTheRow', 'TextOfCell2OfTheRow', etc.]) or, represents the entire table, in such case it is a string[][] where the first [] is the title of th table (it contains only 1 element ['TableTitle']), and each [] element afterwards is one of the table's rows: its first element is a string representing the title of the table (to which the words "Title" or "&C=" are added as the case may be), and the rest of the elements represent the text in each cell of the row. The array is hence structured this way: [["TableTitle"], ["TableTitleAdjustedAsTheCaseMayBe", "TextOfRow1Cell1", "TextOfRow1Cell2", etc.], ["TableTitleAdjustedAsTheCaseMayBe", "TextOfRow2Cell1", "TextOfRow2Cell2", etc.], etc.]
 * @param {string[][]|string[][][]} retrievedPrayersArray - an array that contains either string[][] where each element represents a table row, either a string[][][], where each element is a string[][] representing an entire table in the Word document from which the text was extracted;  inside each table string[][], the first element is a string[] of only 1 element which is the title of the table (['TableTitle']), then each string[]element represents the text of each row of the table, where the first element represents the table title: ['TableTitleAdjustedAsTheCaseMayBe', 'TextOfCell1', 'TextOfCell2', etc.]
 *@param {string[]} idsArray - is an array containing 2 versions of any prayer id in the btn.prayers array: the first element is the prayer id with the word "Title" added before "&D=" (or at the end if no "&D="), the element is hence like "TheTitleOfTheTableTitle&D=". The second element is the prayer id as is
*/
function processPrayers(btn, prayer, retrievedPrayersArray, idsArray) {
    let prayerID = setActorsClasses(prayer[0][0])[0];
    if (prayerID == idsArray[0] ||
        prayerID == idsArray[1]) {
        // if we find an array which first element equals firstElement (i.e., we find an Array constructed according to this model = ['idsArray[0] || idsArray[1]', 'prayer text in Arabic', 'prayer text in French', ' prayer text in English']. We then create a newDiv to represent the text in this subArray
        //@ts-ignore
        retrievedPrayersArray.push(prayer);
        if (prayerID == idsArray[0]) {
            //this means that it is the title of the prayer. We add it to the titlesArray in order to show it later in the right side bar 
            if (!btn.titlesArray) {
                btn.titlesArray = [];
            }
            ;
            typeof (prayer[0]) == 'string' ? btn.titlesArray.push(prayer) : btn.titlesArray.push(prayer[0]);
        }
        ;
    }
    ;
}
;
/**
 * WILL BE DEPRECATED
 * @param {Button | inlineButton } btn
 * @param {string[]} retrievedPrayer - an array having as 1st element the title of the Word table (modified as the case may be if it represents the title of the prayer or to indicate the CSS class that needs to be given to it); and the other elements represent each the text of a given prayer in a different languages
 */
/**
 * Sets the css class for the each prayer according to who tells the prayer: Priest? Diacon? Assembly?
 * @param {string | string[]} id - represents the title of the Word table form which the text was extracted. If btn.prayersArray is a string[][], id is a string representing the 1st element of each string[] in the btn.prayersArray. If btn.prayersArray is a string[][][], id is a string[] representing the 1st element of each string[][] in btn.prayersArray. This string[] contains only one string element which is the title of the Word table (like [['TitleOfTheTable'],['TitleOfTheTableAdjusted', 'TextRow1Cell1', 'TextRow1Cell2', etc.],['TitleOfTheTableAdjusted', 'TextRow2Cell1', 'TextRow2Cell2', etc.])
 * @param {string} firstElement - the first element of a prayer which represents the id of the prayer. The prayer is an array  containing the text of the prayer. It is structured like this ['prayer id', 'text in a given language', 'text in another language', etc.]
 * @returns {string[]} - string[] of 2 elements: the 1st element is the title of the Word table after removing any extra information about its class; the 2nd element is a string that will be added as a class to the html element to give it the appropriate background color
 */
function setActorsClasses(id) {
    let actorClass;
    let prayerID;
    prayerID = id;
    if (prayerID.includes('&C=')) {
        actorClass = prayerID.split('&C=')[1];
        prayerID = prayerID.split('&C=')[0];
    }
    ;
    return [prayerID, actorClass];
}
;
/**
 *
 * @param firstElement {string} - this is the id of the prayer in the prayersArray
 * @param {string[]} prayers - an array of the text of the prayer which id matched the id in the idsArray. The first element in this array is the id of the prayer. The other elements are, each, the text in a given language. The prayers array is hence structured like this : ['prayerID', 'prayer text in Arabic', 'prayer text in French', 'prayer text in Coptic']
 * @param {string[]} languagesArray - the languages available for this prayer. The button itself provides this array from its "Languages" property
 * @param {string[]} userLanguages - a globally declared array of the languages that the user wants to show.
 * @param {string} actorClass - a class that will be given to the html element showing the prayer according to who is saying the prayer: is it the Priest, the Diacon, or the Assembly?
 */
function createHtmlElementForPrayer(firstElement, prayers, languagesArray, userLanguages, actorClass, tblDiv) {
    let row, p, lang, text;
    row = document.createElement("div");
    row.classList.add("TargetRow"); //we add 'TargetRow' class to this div
    row.dataset.root = firstElement.replace(/Part\d+/, '');
    if (actorClass && actorClass !== 'Title') {
        // we don't add the actorClass if it is "Title", because in this case we add a specific class called "TargetRowTitle" (see below)
        row.classList.add(actorClass);
        row.role = 'tr';
    }
    ;
    //looping the elements containing the text of the prayer in different languages,  starting by 1 since 0 is the id
    for (let x = 1; x < prayers.length; x++) {
        //x starts from 1 because prayers[0] is the id
        if (prayers[0].includes('Comment')) {
            //this means it is a comment
            x == 1 ? lang = languagesArray[1] : lang = languagesArray[3];
        }
        else {
            lang = languagesArray[x - 1]; //we select the language in the button's languagesArray, starting from 0 not from 1, that's why we start from x-1.
        }
        ; //we check that the language is included in the allLanguages array, i.e. if it has not been removed by the user, which means that he does not want this language to be displayed. If the language is not removed, we retrieve the text in this language. otherwise we will not retrieve its text.
        if (userLanguages.indexOf(lang) > -1) {
            p = document.createElement("p"); //we create a new <p></p> element for the text of each language in the 'prayer' array (the 'prayer' array is constructed like ['prayer id', 'text in AR, 'text in FR', ' text in COP', 'text in Language', etc.])
            p.role = "td";
            if (actorClass == "Title") {
                //this means that the 'prayer' array includes the titles of the prayer since its first element ends with '&C=Title'.
                row.classList.add("TargetRowTitle");
                row.role = 'th';
                row.tabIndex = 0; //in order to make the div focusable by using the focus() method
            }
            else if (actorClass) {
                //if the prayer is a comment like the comments in the Mass
                p.classList.add(actorClass);
            }
            else {
                //The 'prayer' array includes a paragraph of ordinary core text of the array. We give it 'PrayerText' as class
                p.classList.add('PrayerText');
            }
            ;
            p.dataset.root = firstElement.replace(/Part\d+/, ''); //we do this in order to be able later to retrieve all the divs containing the text of the prayers with similar id as the title
            text = prayers[x];
            p.classList.add(lang); //we add the language as a class in order to be able to set the font
            p.dataset.lang = lang; //we are adding this in order to be able to retrieve all the paragraphs in a given language by its data attribute. We need to do this in order for example to amplify the font of a given language when the user double clicks
            p.textContent = text;
            p.addEventListener('dblclick', (event) => {
                toggleClassListForAllChildrenOFAnElement(event, 'amplifiedTextSize');
            }); //adding a double click eventListner that amplifies the text size of the chosen language;
            row.appendChild(p); //the row which is a <div></div>, will encapsulate a <p></p> element for each language in the 'prayer' array (i.e., it will have as many <p></p> elements as the number of elements in the 'prayer' array)
        }
        else {
        }
        ;
        if (languagesArray[0] == 'COP') {
            row.style.flexDirection = 'row'; //this is in order to show the Arabic text on the right hand, followed by Coptic text in Arabic characters, etc, ie. [AR, CA, FR, COP]. If we keep their original order as in the languagesArray (which is  [COP, FR, CA, AR]), the arabic paragraph will be displayed in the first column starting from left to right, and the coptic paragraph will be on the last column from left to right
        }
        ;
        setGridTemplateColumns(row);
        function setGridTemplateColumns(row) {
            let width = (100 / row.children.length).toString() + "% ";
            for (let i = 1; i < row.children.length; i++) {
                width += (100 / row.children.length).toString() + "% ";
            }
            ;
            row.style.display = 'grid';
            row.style.gridTemplateColumns = width;
        }
        ;
    }
    tblDiv.appendChild(row);
}
;
/**
 * Shows a link in the right side bar for each title in the currently displayed prayers
 * @param titlesArray {string[][]} - an array of titles. each title is an array containing the id of the title as its first element and the text in each language in the following elements (e.g. [id, 'arabic title', 'french title, 'coptic title'])
 * @param rightTitlesDiv - the right hand side bar div where the titles will be displayed
 */
function showTitlesInRightSideBar(titlesArray, rightTitlesDiv) {
    //this function shows the titles in the right side Bar
    rightTitlesDiv.innerHTML = ''; //we empty the side bar
    let newDiv, parag, text = '', suffix = 'SideBar', id;
    titlesArray.map(t => addTitle(t));
    function addTitle(t) {
        id = t[0];
        newDiv = document.createElement('div');
        newDiv.role = 'button';
        newDiv.id = id + suffix;
        newDiv.classList.add(id + suffix);
        newDiv.addEventListener('click', () => scrollHtmlElementIntoView(id));
        //newDiv.addEventListener('click',
        //	() => scrollHtmlElementIntoView(id));
        for (let i = 1; i < t.length; i++) {
            if (t[i]) {
                text = text + ' / ' + t[i];
            }
        }
        ;
        parag = document.createElement('p');
        parag.innerText = text;
        parag.classList.add('sideTitle');
        newDiv.appendChild(parag);
        rightTitlesDiv.appendChild(newDiv);
        text = '';
    }
    ;
    /**
     * scrolls down to an html element retrieved by its id, and closes the left side bar
     * @param {string} id - the id of the html element
     */
    function scrollHtmlElementIntoView(id) {
        for (let i = 1; i < containerDiv.children.length; i++) {
            if (containerDiv.children[i].id == id) {
                let target = containerDiv.children[i];
                closeSideBar(rightSideBar);
                target.scrollIntoView(true);
                return;
            }
        }
    }
    ;
}
;
/**
 * Takes a Button and, depending on its properties will do the following: if the button has children[] buttons, it will create an html element in the left side bar for each child; if the button has inlineBtns[], it will create an html element in the main page for each inlineButton; if the button has prayers[] and prayersArray, and languages, it will look in the prayersArray for each prayer in the prayers[], and if found, will create an html element in the main page showing the text of this element. It will only do so for the languages included in the usersLanguages.
 * @param {Button | inlineButton} btn - the button that the function will process according to its properties (children[], inlineBtns[], prayers[], onClick(), etc.)
 * @param {boolean} clear - whether to clear or not the text already displayed in the main page
 * @param {boolean} click - if the button has its onClick property (which is a function) and if click = true, the onClick function will be called
 * @param {boolean} pursue - after the onClick function is called, if pursue = false, the showchildButtonsOrPrayers() will return, otherwise, it will continue processing the other properties of the button
 * @returns
 */
function showChildButtonsOrPrayers(btn, clear = true, click = true, pursue = true) {
    let btnsDiv = leftSideBar.querySelector('#sideBarBtns');
    if (clear) {
        btnsDiv.innerHTML = '';
        inlineBtnsDiv.innerHTML = '';
    }
    ;
    if (btn.onClick && click) {
        btn.onClick();
        if (!pursue) {
            return;
        }
        ;
    }
    ;
    if (btn.inlineBtns) {
        let newDiv = document.createElement("div");
        newDiv.style.display = 'grid';
        btn.inlineBtns.map((b) => {
            if (btn.btnID != btnGoBack.btnID) {
                // for each child button that will be created, we set btn as its parent in case we need to use this property on the button
                b.parentBtn = btn.parentBtn;
            }
            ;
            createBtn(b, newDiv, b.cssClass);
        });
        let s = (100 / newDiv.children.length).toString() + "% ";
        newDiv.style.gridTemplateColumns = s.repeat(newDiv.children.length);
        newDiv.classList.add('inlineBtns');
        inlineBtnsDiv.appendChild(newDiv);
    }
    ;
    if (btn.children) {
        btn.children.map((c) => {
            if (btn != btnGoBack) {
                // for each child button that will be created, we set btn as its parent in case we need to use this property on the button
                c.parentBtn = btn;
            }
            ;
            createBtn(c, btnsDiv, c.cssClass); //creating and showing a new html button element for each child
        });
    }
    ;
    if (btn.prayers && btn.prayersArray && btn.languages) {
        showPrayers(btn);
    }
    ;
    if (btn.parentBtn && btn.btnID !== btnGoBack.btnID) {
        addGoBackButton(btn).addEventListener("click", () => showChildButtonsOrPrayers(btn.parentBtn));
    }
    if (btn.btnID !== btnMain.btnID && btn.btnID !== btnGoBack.btnID) {
        createBtn(btnMain, btnsDiv, btnMain.cssClass);
    }
    ;
    if (btn.btnID == btnMain.btnID) {
        //we do this in order to get a variable that tells us which sideBar button has been clicked last and displaying its prayers/children/inlineChildren. We need it to refresh the view when we change the language.
        lastClickedButton = btn;
    }
    ;
    /**
     * Adds an html element (a dive which role = button), with an 'onclick' event listner passing the lastClickedButton to showChildButtonsOrPrayers()
     * @param btn {Button} - the button that was clicked by the user and for which we create an html element that allows to get back to the side bar buttons tree before the button was clicked
     * @returns {HTMLElement} - the html element created for the "go back" button
     */
    function addGoBackButton(btn) {
        btnGoBack.children = []; //we are emptying any childs of the btnGoBack button
        if (btn.cssClass == 'inlineBtn') {
            btnGoBack.children[0] = btn.parentBtn; // we are adding btn as a child to the btnGoBack;	
        }
        else if (btn.cssClass == 'sideBarBtn') {
            btnGoBack.children[0] = btn; // we are adding btn as a child to the btnGoBack;
        }
        return createBtn(btnGoBack, leftSideBar.querySelector('#sideBarBtns'), btnGoBack.cssClass); // we are creating a new html button element from btnGoBack. Since btnGoBack has as a sole child btn, when clicking on it, it will trigger the showButtons function (see the if(btn.childs) above. When triggered, the showButtons will show btn as a button);
    }
}
;
/**
 * Creates an html element for the button and shows it in the relevant side bar. It also attaches an 'onclick' event listener to the html element which passes the button it self to showChildButtonsOrPrayers()
 * @param {Button} btn  - the button that will be displayed as an html element in the side bar
 * @param {HTMLElement} btnsBar  - the side bar where the button will be displayed
 * @param {string} btnClass  - the class that will be given to the button (it is usually the cssClass property of the button)
 * @returns {HTMLElement} - the html element created for the button
 */
function createBtn(btn, btnsBar, btnClass) {
    let newBtn = document.createElement('button');
    newBtn.classList.add(btnClass);
    newBtn.id = btn.btnID;
    for (let lang in btn.label) {
        //for each language in btn.text, we create a new "p" element
        if (btn.label[lang]) {
            let btnLable = document.createElement("p");
            //we edit the p element by adding its innerText (=btn.text[lang], and its class)
            editBtnInnerText(btnLable, btn.label[lang], "btnLable" + lang);
            //we append the "p" element  to the newBtn button
            newBtn.appendChild(btnLable);
        }
    }
    ;
    btnsBar.appendChild(newBtn);
    if (btn.children || btn.prayers || btn.onClick) {
        // if the btn object that we used to create the html button element, has childs, we add an "onclick" event that passes the btn itself to the showChildButtonsOrPrayers. This will create html button elements for each child and show them
        newBtn.addEventListener('click', () => showChildButtonsOrPrayers(btn, true));
    }
    ;
    function editBtnInnerText(el, text, btnClass) {
        el.innerText = text;
        el.classList.add("btnText");
        if (btnClass) {
            el.classList.add(btnClass);
        }
        ;
    }
    ;
    return newBtn;
}
;
function PWA() {
    // Initialize deferredPrompt for use later to show browser install prompt.
    let deferredPrompt;
    window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        showInstallPromotion();
        // Optionally, send analytics event that PWA install promo was shown.
        console.log(`'beforeinstallprompt' event was fired.`);
    });
    function showInstallPromotion() {
        let buttonInstall = document.getElementById("InstallPWA");
        buttonInstall.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            // Hide the app provided install promotion
            //hideInstallPromotion();
            // Show the install prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            const { outcome } = yield deferredPrompt.userChoice;
            // Optionally, send analytics event with outcome of user choice
            console.log(`User response to the install prompt: ${outcome}`);
            // We've used the prompt, and can't use it again, throw it away
            deferredPrompt = null;
        }));
        window.addEventListener("appinstalled", () => {
            // Hide the app-provided install promotion
            //hideInstallPromotion();
            // Clear the deferredPrompt so it can be garbage collected
            deferredPrompt = null;
            // Optionally, send analytics event to indicate successful install
            console.log("PWA was installed");
        });
    }
    function getPWADisplayMode() {
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
        if (document.referrer.startsWith("android-app://")) {
            return "twa";
            //@ts-ignore
        }
        else if (navigator.standalone || isStandalone) {
            return "standalone";
        }
        return "browser";
    }
}
;
function registerServiceWorker() {
    const registerServiceWorker = () => __awaiter(this, void 0, void 0, function* () {
        if ("serviceWorker" in navigator) {
            try {
                const registration = yield navigator.serviceWorker.register("/sw.js", {
                    scope: "/",
                });
                if (registration.installing) {
                    console.log("Service worker installing");
                }
                else if (registration.waiting) {
                    console.log("Service worker installed");
                }
                else if (registration.active) {
                    console.log("Service worker active");
                }
            }
            catch (error) {
                console.error(`Registration failed with ${error}`);
            }
        }
    });
}
;
/**
 * returns a string[][], each string[] element includes 2 elements: the current coptic date (as as string formatted like "DDMM") and the corresponding readings date if any (also formatted as "DDMM").
 * @returns {string[][]}
 */
function getCopticReadingsDates() {
    return [
        ["1903", "1307"],
        ["1301", "1703"],
        ["1101", "2708"],
        ["0901", "2803"],
        ["0501", "3005"],
        ["1001", "3005"],
        ["1508", "0105"],
        ["1907", "0105"],
        ["2005", "0105"],
        ["2209", "0105"],
        ["2510", "0105"],
        ["2908", "0105"],
        ["0110", "0105"],
        ["0309", "0105"],
        ["0611", "0105"],
        ["1501", "0105"],
        ["2401", "0105"],
        ["2602", "0105"],
        ["1612", "0109"],
        ["2105", "0109"],
        ["2110", "0109"],
        ["0304", "0109"],
        ["2504", "0206"],
        ["0704", "0206"],
        ["0711", "0206"],
        ["2002", "0206"],
        ["3006", "0210"],
        ["1208", "0311"],
        ["1303", "0311"],
        ["1812", "0311"],
        ["2207", "0311"],
        ["2810", "0311"],
        ["3003", "0311"],
        ["3009", "0311"],
        ["0103", "0311"],
        ["0202", "0311"],
        ["0205", "0311"],
        ["0308", "0311"],
        ["0701", "0311"],
        ["0706", "0311"],
        ["0709", "0311"],
        ["0805", "0311"],
        ["1102", "0311"],
        ["1702", "0311"],
        ["1409", "0312"],
        ["1511", "0312"],
        ["1704", "0312"],
        ["2109", "0312"],
        ["2410", "0312"],
        ["2909", "0312"],
        ["0209", "0312"],
        ["0906", "0312"],
        ["1401", "0312"],
        ["1310", "0313"],
        ["1608", "0405"],
        ["1609", "0405"],
        ["1611", "0405"],
        ["2404", "0405"],
        ["2906", "0405"],
        ["1708", "0511"],
        ["1803", "0511"],
        ["1811", "0511"],
        ["2104", "0511"],
        ["2106", "0511"],
        ["2911", "0511"],
        ["0404", "0511"],
        ["0807", "0511"],
        ["1006", "0511"],
        ["0604", "0605"],
        ["0806", "0605"],
        ["1505", "0801"],
        ["2004", "0801"],
        ["2010", "0801"],
        ["2212", "0801"],
        ["2307", "0801"],
        ["2606", "0801"],
        ["2610", "0801"],
        ["2611", "0801"],
        ["0401", "0801"],
        ["0412", "0801"],
        ["0504", "0801"],
        ["0508", "0801"],
        ["0509", "0801"],
        ["0601", "0801"],
        ["0708", "0801"],
        ["0910", "0801"],
        ["2102", "0801"],
        ["2501", "0801"],
        ["0106", "0903"],
        ["0303", "0903"],
        ["0407", "0903"],
        ["1201", "0903"],
        ["0812", "1009"],
        ["1509", "1202"],
        ["1210", "1203"],
        ["2111", "1307"],
        ["0402", "1307"],
        ["0403", "1307"],
        ["0804", "1307"],
        ["1002", "1307"],
        ["2107", "1312"],
        ["2507", "1402"],
        ["1211", "1503"],
        ["1510", "1503"],
        ["2411", "1503"],
        ["2805", "1503"],
        ["0112", "1503"],
        ["0410", "1503"],
        ["0411", "1503"],
        ["0606", "1503"],
        ["0912", "1503"],
        ["2807", "1601"],
        ["0909", "1608"],
        ["1104", "1610"],
        ["1506", "1610"],
        ["1603", "1610"],
        ["1705", "1610"],
        ["0204", "1610"],
        ["1007", "1701"],
        ["1212", "1701"],
        ["1209", "1703"],
        ["1406", "1703"],
        ["1412", "1703"],
        ["1504", "1703"],
        ["1806", "1703"],
        ["2103", "1703"],
        ["2706", "1703"],
        ["2809", "1703"],
        ["0104", "1703"],
        ["0302", "1703"],
        ["0502", "1703"],
        ["0603", "1703"],
        ["0705", "1703"],
        ["0902", "1703"],
        ["3001", "1705"],
        ["1008", "2009"],
        ["1206", "2009"],
        ["1405", "2009"],
        ["1906", "2009"],
        ["2505", "2009"],
        ["2910", "2009"],
        ["0108", "2009"],
        ["0306", "2009"],
        ["0702", "2009"],
        ["0703", "2009"],
        ["0907", "2009"],
        ["1204", "2009"],
        ["1302", "2009"],
        ["2502", "2009"],
        ["1807", "2011"],
        ["2008", "2011"],
        ["2408", "2011"],
        ["2506", "2011"],
        ["2608", "2011"],
        ["2806", "2011"],
        ["0208", "2011"],
        ["0610", "2011"],
        ["1502", "2011"],
        ["1902", "2011"],
        ["1107", "2101"],
        ["1407", "2101"],
        ["2301", "2101"],
        ["1804", "2202"],
        ["0406", "2202"],
        ["1010", "2203"],
        ["1308", "2203"],
        ["1905", "2203"],
        ["1911", "2203"],
        ["2012", "2203"],
        ["2210", "2203"],
        ["2603", "2203"],
        ["3011", "2203"],
        ["0107", "2203"],
        ["0408", "2203"],
        ["0707", "2203"],
        ["2701", "2203"],
        ["2801", "2203"],
        ["3007", "2204"],
        ["1309", "2205"],
        ["1710", "2205"],
        ["1909", "2205"],
        ["2310", "2205"],
        ["0510", "2205"],
        ["0904", "2205"],
        ["0908", "2205"],
        ["2402", "2205"],
        ["1910", "2308"],
        ["2312", "2308"],
        ["2711", "2308"],
        ["2712", "2308"],
        ["0609", "2308"],
        ["0710", "2308"],
        ["0809", "2308"],
        ["0703", "2308"],
        ["0810", "2409"],
        ["2509", "2503"],
        ["2511", "2503"],
        ["2808", "2503"],
        ["0505", "2503"],
        ["0802", "2503"],
        ["2802", "2503"],
        ["1103", "2601"],
        ["1304", "2601"],
        ["1606", "2601"],
        ["0712", "2601"],
        ["0512", "2605"],
        ["1411", "2702"],
        ["1809", "2702"],
        ["1912", "2702"],
        ["2707", "2702"],
        ["0506", "2702"],
        ["0811", "2702"],
        ["0905", "2702"],
        ["1604", "2703"],
        ["2311", "2703"],
        ["0503", "2703"],
        ["0607", "2703"],
        ["1012", "2703"],
        ["2902", "2703"],
        ["1110", "2708"],
        ["1306", "2708"],
        ["1404", "2708"],
        ["1605", "2708"],
        ["1706", "2708"],
        ["1808", "2708"],
        ["2211", "2708"],
        ["2306", "2708"],
        ["2705", "2708"],
        ["1111", "2708"],
        ["2201", "2708"],
        ["1101", "2708"],
        ["2201", "2708"],
        ["1004", "2803"],
        ["1109", "2803"],
        ["1311", "2803"],
        ["1403", "2803"],
        ["1410", "2803"],
        ["1707", "2803"],
        ["1709", "2803"],
        ["1805", "2803"],
        ["1904", "2803"],
        ["1908", "2803"],
        ["2206", "2803"],
        ["2303", "2803"],
        ["2305", "2803"],
        ["2406", "2803"],
        ["2412", "2803"],
        ["2704", "2803"],
        ["2709", "2803"],
        ["0207", "2803"],
        ["0310", "2803"],
        ["0507", "2803"],
        ["0513", "2803"],
        ["1011", "2803"],
        ["1112", "2803"],
        ["2302", "2803"],
        ["1106", "2903"],
        ["1207", "2903"],
        ["1408", "2903"],
        ["1607", "2903"],
        ["2006", "2903"],
        ["2007", "2903"],
        ["2208", "2903"],
        ["2407", "2903"],
        ["0203", "2903"],
        ["0307", "2903"],
        ["0409", "2903"],
        ["1602", "2903"],
        ["1802", "2903"],
        ["1810", "2905"],
        ["1003", "3005"],
        ["1108", "3005"],
        ["1507", "3005"],
        ["1512", "3005"],
        ["1711", "3005"],
        ["2121", "3005"],
        ["2405", "3005"],
        ["2508", "3005"],
        ["2604", "3005"],
        ["2607", "3005"],
        ["2811", "3005"],
        ["2905", "3005"],
        ["0102", "3005"],
        ["0212", "3005"],
        ["0602", "3005"],
        ["0608", "3005"],
        ["0612", "3005"],
        ["0808", "3005"],
        ["2001", "3005"],
        ["2901", "3005"],
        ["0211", "3008"],
        ["2003", "3008"],
        ["2309", "3008"],
        ["2710", "3008"],
        ["0111", "3008"],
        ["0911", "3008"],
        ["3002", "3008"],
        ["0301", "0311"],
    ];
}
;
function toggleSideBars() {
    if (leftSideBar.classList.contains('extended') && rightSideBar.classList.contains('collapsed')) {
        closeSideBar(leftSideBar);
    }
    else if (rightSideBar.classList.contains('extended') && leftSideBar.classList.contains('collapsed')) {
        closeSideBar(rightSideBar);
    }
    else if (leftSideBar.classList.contains('collapsed') && leftSideBar.classList.contains('collapsed')) {
        openSideBar(leftSideBar);
    }
}
;
/**
 * Opens the temporary development area
 * @param btn
 */
function openDev(btn) {
    let dev = document.getElementById("Dev");
    dev.style.display = "block";
    btn.removeEventListener("click", () => openDev(btn));
    btn.addEventListener("click", () => closeDev(btn));
}
;
/**
 * Hides the temporary development area at the top
 * @param {HTMLElement} btn - the button which hides the area or shows it
 */
function closeDev(btn) {
    let dev = document.getElementById("Dev");
    dev.style.display = "none";
    btn.removeEventListener("click", () => closeDev(btn));
    btn.addEventListener("click", () => openDev(btn));
}
;
/**
 * Opens the side bar by setting its width to a given value
 * @param {HTMLElement} sideBar - the html element representing the side bar that needs to be opened
 */
function openSideBar(sideBar) {
    //containerDiv.appendChild(sideBar);
    let btnText = String.fromCharCode(9776) + "Close Sidebar";
    let width = "30%";
    sideBar.style.width = width;
    sideBar.classList.remove('collapsed');
    sideBar.classList.add('extended');
    sideBar == leftSideBar ? contentDiv.style.marginLeft = width : contentDiv.style.marginRight = width;
    sideBarBtn.innerText = btnText;
    sideBarBtn.removeEventListener("click", () => openSideBar(sideBar));
    sideBarBtn.addEventListener("click", () => closeSideBar(sideBar));
}
;
/**
 * Closes the side bar passed to it by setting its width to 0px
 * @param {HTMLElement} sideBar - the html element representing the side bar to be closed
 */
function closeSideBar(sideBar) {
    let btnText = String.fromCharCode(9776) + "Open Sidebar";
    let width = '0px';
    sideBar.style.width = width;
    sideBar.classList.remove('extended');
    sideBar.classList.add('collapsed');
    sideBar == leftSideBar ? contentDiv.style.marginLeft = width : contentDiv.style.marginRight = width;
    sideBarBtn.innerText = btnText;
    sideBarBtn.removeEventListener("click", () => closeSideBar(sideBar));
    sideBarBtn.addEventListener("click", () => openSideBar(sideBar));
}
;
/**
 * Detects whether the user swiped his fingers on the screen, and opens or closes teh right or left side bars accordingly
 */
function DetectFingerSwipe() {
    //Add finger swipe event
    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchmove", handleTouchMove, false);
    let xDown = null;
    let yDown = null;
    function handleTouchStart(evt) {
        const firstTouch = evt.touches[0];
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    }
    ;
    function handleTouchMove(evt) {
        if (!xDown || !yDown) {
            return;
        }
        ;
        let xUp = evt.touches[0].clientX;
        let yUp = evt.touches[0].clientY;
        let xDiff = xDown - xUp;
        let yDiff = yDown - yUp;
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            /*most significant*/
            if (xDiff > 0) {
                /* right to left swipe */
                if (leftSideBar.classList.contains('extended') && rightSideBar.classList.contains('collapsed')) {
                    closeSideBar(leftSideBar);
                }
                else if (rightSideBar.classList.contains('collapsed') && leftSideBar.classList.contains('collapsed')) {
                    openSideBar(rightSideBar);
                }
                ;
            }
            else {
                /* left to right swipe */
                if (leftSideBar.classList.contains('collapsed') && rightSideBar.classList.contains('collapsed')) {
                    openSideBar(leftSideBar);
                }
                else if (rightSideBar.classList.contains('extended') && leftSideBar.classList.contains('collapsed')) {
                    closeSideBar(rightSideBar);
                }
                ;
            }
        }
        else {
            if (yDiff > 0) {
                /* down swipe */
            }
            else {
                /* up swipe */
            }
        }
        /* reset values */
        xDown = null;
        yDown = null;
    }
    ;
}
;
function toggleClassListForAllChildrenOFAnElement(ev, myClass) {
    ev.preventDefault;
    let el = ev.target;
    let hasDataLang = containerDiv.querySelectorAll('[data-lang]');
    for (let i = 0; i < hasDataLang.length; i++) {
        if (hasDataLang[i].attributes.getNamedItem('data-lang').value == el.attributes.getNamedItem('data-lang').value) {
            toggleClassList(hasDataLang[i], myClass);
            /* 			let child: HTMLElement;
                        for (let c = 1; c > el.parentElement.children.length; c++) {
                            child = el.children[c] as HTMLElement;
                            child.style.width = '20%';
                        };
                        el.style.width = '50%'*/
        }
        ;
    }
    ;
}
;
/**
 * Adds or removes a class to and from an html element
 * @param {HTMLElement} el - the html element the class will be toggled (added if missing, or removed if included)
 * @param {string} myClass - the CSS class
 */
function toggleClassList(el, myClass) {
    if (!el.classList.contains(myClass)) {
        el.classList.add(myClass);
    }
    else if (el.classList.contains(myClass)) {
        el.classList.remove(myClass);
    }
}
;
/**
 * This function is meant to create a side bar on the fly. we are not using it anymore. It will be deprecated.
 * @param id
 * @returns
 */
function buildSideBar(id) {
    let sideBar = document.createElement('div');
    let btnsDiv = document.createElement('div');
    let a = document.createElement('a');
    sideBar.id = id;
    sideBar.classList.add(id);
    sideBar.classList.add('sideBar');
    sideBar.classList.add('collapsed');
    a.innerText = '&times';
    a.setAttribute('href', 'javascript:void(0)');
    a.classList.add('closebtn');
    a.addEventListener('click', () => closeSideBar(sideBar));
    sideBar.appendChild(a);
    btnsDiv.id = 'sideBarBtns';
    sideBar.appendChild(btnsDiv);
    if (id == 'leftSideBar') {
        //leftSideBar = sideBar
    }
    else if (id == 'rightSideBar') {
        //rightSideBar = sideBar
    }
    return sideBar;
}
;
/**
 * Insert an array of prayers after the given index into another array of prayers. It takes the elements of the 'insertion' array and inserts them  after the index in the target 'prayers' array.
 * @param {string[]} prayers - the target array of prayers into which an array of prayers will be inserted
 * @param {number} index - the index into which the array of prayers will be inserted
 * @param {string}  insertion - the array of prayers that will be inserted into the target array
 */
function insertPrayerIntoArrayOfPrayers(targetArrayOfPrayers, index, prayersToInsert) {
    //This function insert prayers as string elements into an existing array of prayers, after the specified index
    for (let i = 0; i < prayersToInsert.length; i++) {
        targetArrayOfPrayers.splice(index, 0, prayersToInsert[i]);
        index++;
    }
    ;
}
/**
 * This function takes a button having a prayersArray property of type string[][][]. Prayers array is an array of string[][], each string[][] represents a table in the Word document from which the text of the prayers was extracted. each string[][] element, has as its 1st element a string[] with only 1 string, representing the title of the Word table (['TableTitle']). Then each next string[] element represents a row of the table's rows. Each row string[] starts with the title of the table, modified to reflect whether this row contains the titles of the prayers (in such case the word "Title" is added before "&D="), or to determine by whom the prayer is chanted (in such case the word "&C=" + "Priest", "Diacon" or "Assembly" are added at the end of the title). The other elements of the row string[] represent the text of of each cell in the row. The prayersArray is hence structured like this: [[['Table1Title],['Table1TitleWithTitleOr&C=', 'TextOfRow1Cell1', 'TextOfRow1Cell2', 'TextOfRow1Cell3', etc.], ['Table1TitleWithTitleOr&C=', 'TextOfRow2Cell1', 'TextOfRow2Cell2', 'TextOfRow2Cell3', etc.], etc.], [['Table2Title],['Table2TitleWithTitleOr&C=', 'TextOfRow1Cell1', 'TextOfRow1Cell2', 'TextOfRow1Cell3', etc.], ['Table2TitleWithTitleOr&C=', 'TextOfRow2Cell1', 'TextOfRow2Cell2', 'TextOfRow2Cell3', etc.]], etc. etc.]
 * @param btn
 */
function showPrayers(btn, clearSideBar = true) {
    let titles = [];
    clearDivs();
    btn.prayers.map(p => {
        let date;
        if (p.includes('&D=') || p.includes('&S=')) {
            //if the id of the prayer includes the value '&D=' this tells us that this prayer is either not linked to a specific day in the coptic calendar (&D=0000), or the date has been set by the button function (e.g.: PrayerGospelResponse&D=GLWeek). In this case, we will not add the copticReadingsDate to the prayerID
            //Similarly, if the id includes 'Season=', it tells us that it is not linked to a specific date but to a given period of the year. We also keep the id as is without adding any date to it
            date = '';
        }
        else {
            date = '&D=' + copticReadingsDate; //this is the default case where the date equals the copticReadingsDate. This works for most of the occasions.
        }
        ;
        p += date;
        findAndProcessPrayers(p);
    });
    closeSideBar(leftSideBar);
    if (titles) {
        showTitlesInRightSideBar(titles, rightSideBar.querySelector('#sideBarBtns'));
    }
    /**
     * Takes a prayer string "p" from the btn.prayers[], and looks for an array in the btn.prayersArray with its first element matches "p". When it finds the array (which is a string[][] where each element from the 2nd element represents a row in the Word table), it process the text in the row string[] to createHtmlElementForPrayer() in order to show the prayer in the main page
     * @param {string} p - a string representing a prayer in the btn.prayers[]. This string matches the title of one of the tables in the Word document from which the text was extracted. The btn.prayersArray should have one of its elements = to "p"
     */
    function findAndProcessPrayers(p) {
        let wordTable, row, tblTitle, fractionPrayers = [], wdTableDiv;
        for (let i = 0; i < btn.prayersArray.length; i++) {
            wordTable = btn.prayersArray[i]; //this represents a table in the Word document from which the prayers text was extracted*
            if (wordTable[0]) {
                tblTitle = wordTable[0][0].split('&C=')[0]; //the first element in the string[][] representing the Word table is a string[] with only 1 element representing the Title of the Table. We remove "&C=" from the end in order to get the title of the table without any additions indicating the class of the html element that will be created for each row
                wdTableDiv = document.createElement('div'); //we create a div element that will contain all the rows of the wordTable
                wdTableDiv.role = 'Table';
                wdTableDiv.id = 'Table' + tblTitle; //not sure we need it but will see later whether to keep it or not
                //wdTableDiv.classList.add('prayerTable');
                wdTableDiv.style.display = 'grid';
                let width = '100%';
                //let width: string = (100 / userLanguages.length).toString() + '% ';
                //for (let i = 1; i < userLanguages.length; i++){
                //width += width
                //};
                wdTableDiv.style.gridTemplateColumns = width;
                wdTableDiv.dataset.root = tblTitle.replace(/Part\d+/, ''); //we add a data-root property that will allow us to retrieve any div with the same data-root and hide it (notice that we remove 'Part' + any digit from the data-root, in order to retrieve all the tables with same root)
                if (p == tblTitle) {
                    if (tblTitle.startsWith("PrayerMassFractionPrayer")) {
                        fractionPrayers.push(wordTable); //We will create and inline button for each fraction instead of showing the text of the fraction prayer directly
                    }
                    else {
                        for (let r = 0; r < wordTable.length; r++) {
                            row = wordTable[r]; //each string[] element after the 1st element in the Word table string[][] represents a row in the table. The row string[] starts with the title of the table (modified as the case may be), and continues with the text in each cell of the row
                            createHtmlElementForPrayer(tblTitle, row, btn.languages, userLanguages, row[0].split('&C=')[1], wdTableDiv); //row[0] is the title of the table modified as the case may be to reflect wether the row contains the titles of the prayer, or who chants the prayer (in such case the words 'Title' or '&C=' + 'Priest', 'Diacon', or 'Assembly' are added to the title)
                            if (wordTable[r][0].includes('&C=Title')) {
                                titles.push(row);
                            }
                            ;
                        }
                        ;
                    }
                    ;
                    if (fractionPrayers.length > 0) {
                        let fractionsBtn, //a virutal button to which we will add inlineBtns for each fraction
                        fractionBtn, //an inlineBtn representing a fraction
                        newDiv;
                        newDiv = document.createElement('div');
                        fractionsBtn = new Button({
                            btnID: 'fractionsBtn',
                            label: { AR: '', FR: 'Doesn\'t need to have a label because it will not be displayed, we only need to display its inline buttons' }
                        }); //we don't need to give it a label or or an id since we will pass it directly to showChildButtonsOrPrayers() in order to display its inlineBtns[] as html elements
                        fractionsBtn.inlineBtns = [];
                        fractionPrayers.map(wdTbl => {
                            fractionBtn = new inlineButton({
                                btnID: wdTbl[0][0],
                                label: { AR: wdTbl[1][btn.languages.indexOf['AR'] + 1], FR: wdTbl[1][btn.languages.indexOf['FR'] + 1] }
                            });
                            fractionsBtn.inlineBtns.push(fractionBtn); //we add the newly created inlineBtn to the fractionsBtn.inlineBtns array
                            fractionBtn.prayersArray = wdTbl;
                            fractionBtn.prayers = [];
                            fractionBtn.prayersArray.map(tblRow => fractionBtn.prayers.push(tblRow[0])); //for each row array in the wdTbl rows, we add the 1st element (which is a string) to the fractionBtn.prayers array
                            fractionBtn.languages = btnMassStBasil.languages; //we need to set the languages otherwise showPrayers() will not be called
                        });
                        fractionBtn.inlineBtns.map(b => createBtn(b, inlineBtnsDiv, fractionBtn.cssClass));
                        showChildButtonsOrPrayers(fractionsBtn, false); //ATTENTION: the clear paramater must be false, otherwise the inilne buttons create previously will dissapear. We are creating html button elements for each fractionPrayer, and will attach to it an "onclick" eventListner that will pass the fractionBtn to showChildButtonsOrPrayers()
                    }
                    ;
                }
                ;
                //we finally append the wdTableDiv to the containerDiv
                if (wdTableDiv.children.length > 0) {
                    containerDiv.appendChild(wdTableDiv);
                }
                ;
            }
            ;
        }
        ;
    }
    ;
    /**
 * Clears the containerDiv and the rightSideBar from any text or buttons shown
 */
    function clearDivs() {
        //we empty the subdivs of the containerDiv before populating them with the new text
        containerDiv.innerHTML = "";
        if (clearSideBar) {
            rightSideBar.querySelector('#sideBarBtns').innerHTML = '';
        }
        ; //this is the right side bar where the titles are displayed for navigation purposes
    }
    ;
}
;
function setButtonsPrayers() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < btns.length; i++) {
            btnsPrayers.push([btns[i].btnID, ...yield btns[i].onClick()]);
            btns[i].retrieved = true;
        }
        ;
        console.log('Buttons prayers were set');
        return btnsPrayers;
    });
}
;
