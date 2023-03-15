class Button {
    constructor(btn) {
        this._label = { FR: '', AR: '', EN: '' };
        this._retrieved = false;
        this._btnID = btn.btnID;
        this._label = btn.label;
        this._rootID = btn.rootID;
        this._parentBtn = btn.parentBtn;
        this._children = btn.children;
        this._prayers = btn.prayers;
        this._retrieved = btn.retrieved;
        this._prayersArray = btn.prayersArray;
        this._titlesArray = btn.titlesArray;
        this._languages = btn.languages;
        this._onClick = btn.onClick;
        this._value = btn.value;
        btn.cssClass ? this._cssClass = btn.cssClass : this._cssClass = 'sideBarBtn';
        this._inlineBtns = btn.inlineBtns;
    }
    ;
    get btnID() { return this._btnID; }
    ;
    get children() { return this._children; }
    ;
    get prayers() { return this._prayers; }
    ;
    get retrieved() { return this._retrieved; }
    ;
    get prayersArray() { return this._prayersArray; }
    ;
    get titlesArray() { return this._titlesArray; }
    ;
    get languages() { return this._languages; }
    ;
    get label() { return this._label; }
    ;
    get parentBtn() { return this._parentBtn; }
    ;
    get rootID() { return this._rootID; }
    ;
    get onClick() { return this._onClick; }
    ;
    get value() { return this._value; }
    ;
    get cssClass() { return this._cssClass; }
    ;
    get inlineBtns() { return this._inlineBtns; }
    ;
    set btnID(id) { this._btnID = id; }
    ;
    set label(lbl) { this._label = lbl; }
    ;
    set parentBtn(parentBtn) { this._parentBtn = parentBtn; }
    ;
    set prayers(btnPrayers) { this._prayers = btnPrayers; }
    ;
    set retrieved(retrieved) { this._retrieved = retrieved; }
    ;
    set prayersArray(btnPrayersArray) { this._prayersArray = btnPrayersArray; }
    ;
    set titlesArray(titles) { this._titlesArray = titles; }
    ;
    set languages(btnLanguages) { this._languages = btnLanguages; }
    ;
    set onClick(fun) { this._onClick = fun; }
    ;
    set children(children) { this._children = children; }
    ;
    set cssClass(cssClass) { this._cssClass = cssClass; }
    ;
    set inlineBtns(btns) { this._inlineBtns = btns; }
}
;
class inlineButton extends Button {
    constructor(btn) {
        super(btn);
        this.cssClass = 'inlineBtn';
    }
    ;
}
;
const btnMain = new Button({
    btnID: 'btnMain',
    label: { AR: "العودة إلى القائمة الرئيسية", FR: "Retour au menu principal", EN: "Back to the main menu" },
});
const btnGoBack = new Button({
    btnID: 'btnGoBack',
    label: { AR: "السابق", FR: "Retour", EN: "Go Back" },
});
const btnMass = new Button({
    btnID: 'btnMass',
    label: { AR: "القداسات", FR: "Messes" },
});
const btnIncenseOffice = new Button({
    btnID: 'btnIncenseOffice',
    label: {
        AR: "رفع بخور باكر أو عشية",
        FR: "Office des Encens Aube et Soir"
    },
    onClick: () => {
        //setting the children of the btnIncenseOffice. This must be done by the onClick() in order to reset them each time the button is clicked 
        btnIncenseOffice.children = [btnIncenseDawn, btnIncenseVespers];
        //show or hide the PropheciesDawn button if we are in the Great Lent or JonahFast:
        if (Season == Seasons.GreatLent || Season == Seasons.JonahFast) {
            //we will remove the btnIncenseVespers from the children of btnIncenseOffice for all the days of the Week except Saturday because there is no Vespers incense office except on Saturday:
            if (todayDate.getDay() != 6) {
                btnIncenseOffice.children.splice(btnIncenseOffice.children.indexOf(btnIncenseVespers), 1);
            }
            ;
            // we will remove or add the Prophecies Readings button as a child to btnDayReadings depending on the day
            if (btnIncenseDawn.children.indexOf(btnReadingsPropheciesDawn) == -1 //The Prophecies button is not among the children of btnDayReadings
                && todayDate.getDay() != 0 //i.e., we are not a Sunday
                && todayDate.getDay() != 6 //i.e., we are not a Saturday
            ) {
                //it means btnReadingsPropheciesDawn does not appear in the Incense Dawn buttons list (i.e., =-1), and we are neither a Saturday or a Sunday, which means that there are prophecies lectures for these days and we need to add the button in all the Day Readings Menu, and the Incense Dawn
                btnIncenseDawn.children.unshift(btnReadingsPropheciesDawn); //We add the Prophecies button at the begining of the btnIncenseDawn children[], i.e., we add it as the first button in the list of Incense Dawn buttons, the second one is the Gospel
            }
            else if (btnIncenseDawn.children.indexOf(btnReadingsPropheciesDawn) > -1
                && (todayDate.getDay() == 0 //i.e., we are a Sunday
                    || todayDate.getDay() == 6 //i.e., we are a Saturday
                )) {
                //it means btnReadingsPropheciesDawn appears in the Incense Dawn buttons list, and we are either a Saturday or a Sunday, which means that there are no prophecies for these days and we need to remove the button from all the menus to which it had been added before
                btnIncenseDawn.children.splice(btnIncenseDawn.children.indexOf(btnReadingsPropheciesDawn), 1);
            }
            ;
            //removing the vespers prayers if we are not a Saturday, and adding it if we aree
            if (btnDayReadings.children && todayDate.getDay() != 6 && btnDayReadings.children.indexOf(btnIncenseVespers) > -1) {
                //it means we are not a Saturday. we need to remove the btnIncenseVespers because there are not vespers
                btnDayReadings.children.splice(btnDayReadings.children.indexOf(btnIncenseVespers), 1);
            }
            else if (todayDate.getDay() == 6 && btnDayReadings.children.indexOf(btnIncenseVespers) == -1) {
                //it means we are  a Saturday. we need to add the btnReadingsGospelIncenseVespers if missing
                btnDayReadings.children.splice(btnDayReadings.children.indexOf(btnReadingsGospelIncenseDawn), 0, btnIncenseVespers);
            }
        }
        ;
    }
});
const btnIncenseDawn = new Button({
    btnID: 'btnIncenseDawn',
    label: {
        AR: 'بخور باكر',
        FR: 'Encens Aube'
    },
    prayersArray: PrayersArray,
    languages: prayersLanguages,
    onClick: () => {
        (function setBtnchildrenAndPrayers() {
            //We will set the children of the button:
            btnIncenseDawn.children = [btnReadingsGospelIncenseDawn];
            //we will also set the prayers of the Incense Dawn button
            btnIncenseDawn.prayers = [...IncensePrayers];
        })();
        (function adaptCymbalVerses() {
            //removing the non-relevant Cymbal prayers according to the day of the week: Wates/Adam
            if (todayDate.getDay() > 2) {
                //we are between Wednesday and Saturday, we keep only the "Wates" Cymbal prayers
                btnIncenseDawn.prayers.splice(btnIncenseDawn.prayers.indexOf("PrayerCymbalVersesAdam&D=0000"), 1);
            }
            else {
                //we are Sunday, Monday, or Tuesday. We keep only the "Adam" Cymbal prayers
                btnIncenseDawn.prayers.splice(btnIncenseDawn.prayers.indexOf("PrayerCymbalVersesWates&D=0000"), 1);
            }
            ;
        })();
        (function removeDepartedLitany() {
            //removing the Departed Litany from IncenseDawn prayers
            btnIncenseDawn.prayers.splice(btnIncenseDawn.prayers.indexOf('PrayerDepartedPrayerPart1&D=0000'), 5);
        })();
        (function removeStMaryVespersDoxology() {
            //removing the Wates Vespers' Doxology for St. Mary
            btnIncenseDawn.prayers.splice(btnIncenseDawn.prayers.indexOf('PrayerDoxologyVespersWatesStMary'), 1);
        })();
        (function addInlineBtnForAdmDoxolgies() {
            //Adding an inline Button for showing the "Adam" Doxologies, and removing the id of the Adam Doxologies from the btn.prayers array
            if (!btnIncenseDawn.inlineBtns) {
                btnIncenseDawn.inlineBtns = [];
            }
            ; //if btnIncenseDawn has no inlineBtns, we add an inlineBtn for the 'DoxologiesAdam' prayers
            if (btnIncenseDawn.inlineBtns.length == 0) {
                let btn = new inlineButton({
                    btnID: 'AdamDoxologies',
                    label: {
                        AR: 'ذكصولوجيات باكر آدام',
                        FR: 'Doxologies Adam Aube'
                    },
                    onClick: () => {
                    }
                });
                btnIncenseDawn.inlineBtns.push(btn);
                //We also add a GoBackButton as an inlineBtn to btn
                if (!btn.inlineBtns) {
                    btn.inlineBtns = [];
                    btn.inlineBtns.push(new inlineButton({
                        btnID: btnGoBack.btnID,
                        label: btnGoBack.label,
                        onClick: () => showChildButtonsOrPrayers(btnIncenseDawn, true, false)
                    })); //when the GoBack html element will be created, an 'onclick' eventListner will be attached to it (Please NOTE that the eventListner WILL NOT be attached unless the button has either its 'prayers' or 'children' or 'onClick' properties set).This eventListner passes the GoBack button to the showChildButtonsOrPrayers() function. When passed to showChildButtonsOrPrayers(), the onClick function will be called. We set the onClick property of the GoBack Button to a function that, at its turn, passes the btnIncenseDawn button to the showChildButtonsOrPrayers() function. Notice that we set the 'click' parameter to 'false' in order to avoid calling the onClick property of btnIncenseDawn when passing it to the showChildButtonsOrPrayers(), because we just want it to show its 'prayers'  and its 'inlineButton' (i.e. the DoxologiesAdam inlineButton) as those properties were set before clicking the DoxologiesAdam inlineButton.
                }
                ;
                if (!btn.prayers) {
                    btn.prayers = [];
                    btn.prayersArray = btnIncenseDawn.prayersArray; //we need it because the prayers are not shown unless the button has the prayersArray and the Languages properties set
                    btn.languages = btnIncenseDawn.languages;
                    btnIncenseDawn.prayers.map(prayer => {
                        if (prayer.includes('DoxologyAdam')) {
                            //add the id of the prayer to the prayers of the inline button that we created
                            btn.prayers.push(prayer);
                        }
                    });
                }
                ;
                //then removing the prayer id from the btnIncenseDawn.prayers array in order to exclude them unless requested by the user by clicking on the inline button
                btn.prayers.map(p => btnIncenseDawn.prayers.splice(btnIncenseDawn.prayers.indexOf(p, 1)));
            }
            ;
        })();
        let index;
        (function addGospelReadings() {
            // We will add the Gospel readings to the prayers
            index = btnIncenseDawn.prayers.indexOf('PrayerGospelIntroductionPart3&D=0000' + 1);
            let gospel = setGospelPrayers(Readings.GospelDawn); //we get the gospel prayers array for the Incense Dawn office
            insertPrayerIntoArrayOfPrayers(btnIncenseDawn.prayers, index, gospel.splice(0, 1)); //we remove the 'Psalm response' ;
            index = btnIncenseDawn.prayers.indexOf('PrayerGospelPrayerPart2&D=0000' + 1); //this is the end of the Gospel Prayer
            insertPrayerIntoArrayOfPrayers(btnIncenseDawn.prayers, index, [gospel[0]]); //we insert the 'Psalm response'                            
        })();
        (function removeEklonominTaghonata() {
            //We remove "Eklonomin Taghonata" from the prayers array
            btnIncenseDawn.prayers.splice(btnIncenseDawn.prayers.indexOf('PrayerGodHaveMercyOnUsRefrainComment&S=GL'), 1); //this is the comment
            for (let i = 1; i < 6; i++) {
                btnIncenseDawn.prayers.splice(btnIncenseDawn.prayers.indexOf('PrayerGodHaveMercyOnUsRefrain&S=GL'), 1);
            }
            ; //We remove the refrain which is included 5 times in the prayers[] array
            for (let i = 1; i < 16; i++) {
                btnIncenseDawn.prayers.splice(btnIncenseDawn.prayers.indexOf('PrayerGodHaveMercyOnUsPart' + i.toString() + '&S=GL'), 2); // we remove 2 because there is a "Kyrielison" after each part
            }
            ;
        })();
        //We will then add other prayers according to the occasion
        (function addGreatLentPrayers() {
            if (Season == Seasons.GreatLent && todayDate.getDay() != 0 && todayDate.getDay() != 6) {
                //If we are during any day of the week, we will add the Prophecies readings to the children of the button
                if (btnIncenseDawn.children.indexOf(btnReadingsPropheciesDawn) == -1) {
                    btnIncenseDawn.children.unshift(btnReadingsPropheciesDawn);
                }
                ;
                //we will also add the 'Eklonomin Taghonata' prayer to the Dawn Incense Office prayers, after the 'Efnoti Naynan' prayer
                (function addEklonominTaghonata() {
                    index = btnIncenseDawn.prayers.indexOf('PrayerEfnotiNaynanPart4&D=0000') + 2;
                    let temp = [];
                    //we add the comment
                    temp.push('PrayerGodHaveMercyOnUsRefrainComment&S=GL');
                    let prayer = ['PrayerGodHaveMercyOnUsRefrain&S=GL', 'PrayerKyrieElieson&D=0000', 'PrayerKyrieEliesonThreeTimesWithoutAmen&D=0000'];
                    let id = ['PrayerGodHaveMercyOnUsPart', '&S=GL'];
                    let kyrielson = prayer[1], lastKyrie;
                    //then we add the refraint + each set of 3 prayers
                    for (let i = 1; i < 14; i += 3) {
                        i + 2 == 15 ? lastKyrie = prayer[2] : lastKyrie = kyrielson;
                        temp.push(prayer[0], id[0] + i.toString() + id[1], kyrielson, id[0] + (i + 1).toString() + id[1], kyrielson, id[0] + (i + 2).toString() + id[1], lastKyrie);
                    }
                    ;
                    insertPrayerIntoArrayOfPrayers(btnIncenseDawn.prayers, index, temp);
                })();
                //We will then add the GreatLent      Doxologies to the Doxologies before the first Doxology of St. Mary
                (function addGreatLentDoxologies() {
                    index = btnIncenseDawn.prayers.indexOf('PrayerDoxologyArchangelMichaelWates&D=0000') - 1;
                    if (todayDate.getDay() != (0 || 6)) {
                        insertPrayerIntoArrayOfPrayers(btnIncenseDawn.prayers, index, ['PrayerDoxology1&D=GLWeek', 'PrayerDoxology2&D=GLWeek', 'PrayerDoxology3&D=GLWeek', 'PrayerDoxology4&D=GLWeek', 'PrayerDoxology5&D=GLWeek']);
                    }
                    else if (todayDate.getDay() == (0 || 6)) {
                        insertPrayerIntoArrayOfPrayers(btnIncenseDawn.prayers, index, ['PrayerDoxology1&D=GLSundays']);
                    }
                    ;
                })();
            }
        })();
        (function addKiahkPrayers() {
            if (Number(copticMonth) == 4) {
                index = btnIncenseDawn.prayers.indexOf('PrayerDoxologyStMaryDate=0000') - 1;
                insertPrayerIntoArrayOfPrayers(btnIncenseDawn.prayers, index, ['PrayerDoxology1&D=0004', 'PrayerDoxology2&D=0004', 'PrayerDoxology3&D=0004', 'PrayerDoxology4&D=0004',
                    'PrayerDoxology5&D=0004',
                    'PrayerDoxology6&D=0004']);
            }
            ;
        })();
        (function addResurrectionPrayers() {
            if (Season == Seasons.Resurrection) {
                insertPrayerIntoArrayOfPrayers(btnIncenseDawn.prayers, index, ['']);
            }
            ;
        })();
        return btnIncenseDawn.prayers;
    }
});
const btnIncenseVespers = new Button({
    btnID: 'btnIncenseVespers',
    label: {
        AR: "بخور عشية",
        FR: 'Incense Vespers'
    },
    prayersArray: PrayersArray,
    languages: prayersLanguages,
    onClick: () => {
        btnIncenseVespers.children = [btnReadingsGospelIncenseVespers];
        btnIncenseVespers.prayers = [...IncensePrayers];
        //removing the Travelers Litany from IncenseVespers prayers
        btnIncenseVespers.prayers.splice(btnIncenseVespers.prayers.indexOf('PrayerTravelersPrayerPart1Date=0000'), 5);
        //removing the Oblations Litany from IncenseVespers paryers
        btnIncenseVespers.prayers.splice(btnIncenseVespers.prayers.indexOf('PrayerOblationsPrayerPart1Date=0000'), 5);
        //removing the Dawn Doxology for St. Mary
        btnIncenseVespers.prayers.splice(btnIncenseVespers.prayers.indexOf('PrayerDoxologyDawnWatesStMary'), 1);
        //removing the non-relevant Cymbal prayers according to the day of the week: Wates/Adam
        if (todayDate.getDay() > 2) {
            //we are between Wednesday and Saturday, we keep only the "Wates" Cymbal prayers
            btnIncenseVespers.prayers.splice(btnIncenseVespers.prayers.indexOf("PrayerCymbalVersesAdamDate=0000"), 1);
        }
        else {
            //we are Sunday, Monday, or Tuesday. We keep only the "Adam" Cymbal prayers
            btnIncenseVespers.prayers.splice(btnIncenseVespers.prayers.indexOf("PrayerCymbalVersesWatesDate=0000"), 1);
        }
        ;
        return btnIncenseVespers.prayers;
    }
});
const btnMassStCyril = new Button({
    btnID: 'btnMassStCyril',
    label: { AR: "كيرلسي", FR: "Messe Saint Cyril", EN: "St Cyril Mass" },
    prayersArray: PrayersArray,
    languages: prayersLanguages,
    onClick: () => {
        if (btnsPrayers[btns.indexOf(btnMassStCyril)]) {
            //if the prayers array of this button had already been set by the async function setButtonsPrayers(), which is called when the app is loaded, then we will not recalculate the paryers array and will use the preset array
            btnMassStCyril.prayers = btnsPrayers[btns.indexOf(btnMassStCyril)];
            return;
        }
        ;
        //Setting the standard mass prayers sequence
        btnMassStCyril.prayers = [...MassPrayers.MassCommonIntro, ...MassPrayers.MassStCyril, ...MassPrayers.MassFractions, ...MassPrayers.Communion];
        // adding inline buttons if they were not already set when the user previously clicked the button
        if (!btnMassStCyril.inlineBtns) {
            btnMassStCyril.inlineBtns = [...goToAnotherMass];
            btnMassStCyril.inlineBtns.splice(2, 1); //removing btnGoToStCyrilReconciliation from the inlineBtns
        }
        ;
        //we will retrieve the prayers from the prayersArray and set the retrieved property to true
        return btnMassStCyril.prayers;
    }
});
const btnMassStGregory = new Button({
    btnID: 'btnMassStGregory',
    label: { AR: "غريغوري", FR: "Saint Gregory" },
    prayersArray: PrayersArray,
    languages: prayersLanguages,
    onClick: () => {
        if (btnsPrayers[btns.indexOf(btnMassStGregory)]) {
            //if the prayers array of this button had already been set by the async function setButtonsPrayers(), which is called when the app is loaded, then we will not recalculate the paryers array and will use the preset array
            btnMassStGregory.prayers = btnsPrayers[btns.indexOf(btnMassStGregory)];
            return;
        }
        ;
        //Setting the standard mass prayers sequence
        btnMassStGregory.prayers = [...MassPrayers.MassCommonIntro, ...MassPrayers.MassStGregory, ...MassPrayers.MassCallOfHolySpirit, ...MassPrayers.MassLitanies, ...MassPrayers.MassFractions, ...MassPrayers.Communion];
        // adding inline buttons if they were not already set when the user previously clicked the button
        if (!btnMassStGregory.inlineBtns) {
            btnMassStGregory.inlineBtns = [...goToAnotherMass];
            btnMassStGregory.inlineBtns.splice(1, 1); //removing btnGoToStGregoryReconciliation from the inlineBtns
        }
        ;
        return btnMassStGregory.prayers;
    }
});
const btnMassStBasil = new Button({
    btnID: 'btnMassStBasil',
    label: { AR: 'باسيلي', FR: 'Messe Saint Basil', EN: 'St Basil Mass' },
    prayersArray: PrayersArray,
    languages: prayersLanguages,
    onClick: () => {
        if (btnsPrayers[btns.indexOf(btnMassStBasil)]) {
            //if the prayers array of this button had already been set by the async function setButtonsPrayers(), which is called when the app is loaded, then we will not recalculate the paryers array and will use the preset array 
            btnMassStBasil.prayers = btnsPrayers[btns.indexOf(btnMassStBasil)];
            return;
        }
        ;
        //Setting the standard mass prayers sequence
        btnMassStBasil.prayers = [...MassPrayers.MassCommonIntro, ...MassPrayers.MassStBasil, ...MassPrayers.MassCallOfHolySpirit, ...MassPrayers.MassLitanies, ...MassPrayers.MassFractions, ...MassPrayers.Communion];
        // adding inline buttons if they were not already set when the user previously clicked the button
        if (!btnMassStBasil.inlineBtns) {
            btnMassStBasil.inlineBtns = [...goToAnotherMass];
            btnMassStBasil.inlineBtns.splice(0, 1); //removing btnGoToStBasilReconciliation from the inlineBtns
        }
        ;
        return btnMassStBasil.prayers;
    }
});
const btnMassStJohn = new Button({
    btnID: 'btnMassStJohn',
    label: { AR: 'القديس يوحنا', FR: 'Saint Jean' },
    prayers: [],
    onClick: () => {
        // adding inline buttons if they were not already set when the user previously clicked the button
        if (!btnMassStJohn.inlineBtns) {
            btnMassStJohn.inlineBtns = [...goToAnotherMass];
            btnMassStJohn.inlineBtns.splice(3, 1); //removing btnGoToStJohnReconciliation from the inlineBtns
        }
        ;
        if (!btnMassStJohn.retrieved) {
            btnMassStJohn.prayersArray = retrieveBtnPrayers(btnMassStJohn);
        }
        ;
    }
});
/**
 * This function takes a Button or an inlineButton, and looks in the button's array of prayers text (i.e. btn.prayersArray) if there is a prayer having the same id as the id of each prayer in the btn.prayers array
 * @param {Button || inlineButton} btn - a button having its btn.prayers && btn.prayersArray set (i.e. not undefined)
 * @returns {string[][]} - an array of prayers text, each prayer is an array starting with the prayer id, the text in a given language, text in another languages, etc.,
 */
function retrieveBtnPrayers(btn) {
    if (btn.prayers && btn.prayersArray) {
        let retrieved = [];
        btn.prayers.map(p => {
            retrieved = [...retrieved, ...retrieveButtonPrayersFromItsPrayersArray(btn, p)];
        });
        btn.retrieved = true;
        return retrieved;
    }
    else {
        console.log('the ' + btn.btnID + ' does not have its prayers or prayersArray set', 'prayers = ', btn.prayers, 'prayersArray = ', btn.prayersArray);
    }
}
;
const goToAnotherMass = [
    new inlineButton({
        btnID: 'btnGoToStBasilReconciliation',
        label: { AR: 'صلاة الصلح الباسيلي', FR: 'Reconciliation Saint Basil' },
        onClick: () => {
            showChildButtonsOrPrayers(btnMassStBasil);
        }
    }),
    new inlineButton({
        btnID: 'btnGoToStGregoryReconciliation',
        label: { AR: 'صلاة الصلح الغريغوري', FR: 'Reconciliation Saint Gregory' },
        onClick: () => {
            showChildButtonsOrPrayers(btnMassStGregory);
        }
    }),
    new inlineButton({
        btnID: 'btnGoToStCyrilReconciliation',
        label: { AR: 'صلاة الصلح الكيرلسي', FR: 'Reconciliation Saint Cyril' },
        onClick: () => {
            showChildButtonsOrPrayers(btnMassStCyril);
        }
    }),
    new inlineButton({
        btnID: 'btnGoToStJeanReconciliation',
        label: { AR: 'صلاة الصلح للقديس يوحنا', FR: 'Reconciliation Saint Jean' }, rootID: 'StJohn',
        parentBtn: btnMass,
        onClick: () => {
            showChildButtonsOrPrayers(btnMassStJohn);
        }
    })
];
const btnMassOfferingOfTheLamb = new Button({
    btnID: 'btnMassOfferingOfTheLamb',
    label: { AR: 'تقديم الحمل', FR: "Présentation de l'Agneau" }
});
const btnMassRoshoumat = new Button({
    btnID: 'btnMassRoshoumat',
    label: { AR: 'رشومات الحمل', FR: "Roshoumat El Hamal" }
});
const btnMassUnBaptised = new Button({
    btnID: 'btnMassUnBaptised',
    label: { AR: 'قداس الموعوظين', FR: 'Messe des non baptisés', EN: 'Unbaptised Mass' }
});
const btnMassBaptised = new Button({
    btnID: 'btnMassBaptised',
    label: {
        AR: 'قداس المؤمنين',
        FR: 'Messe des Croyants',
        EN: 'Baptized Mass'
    },
    parentBtn: btnMass,
    children: [btnMassStBasil, btnMassStCyril, btnMassStGregory, btnMassStJohn]
});
const btnFractionPrayers = new Button({
    btnID: 'btnFractionPrayers',
    label: { AR: 'صلوات القسمة', FR: 'Fraction' }
});
const btnMassReadings = new Button({
    btnID: 'btnMassReadings',
    label: {
        AR: 'القراءات',
        FR: 'Lectures'
    },
    prayers: [Readings.StPaul, Readings.Katholikon, Readings.Praxis, Readings.Synaxarium, Readings.GospelMass],
});
const btnDayReadings = new Button({
    btnID: 'btnDayReadings',
    label: { AR: "قراءات اليوم", FR: "Lectures du jour", EN: 'Day\'s Readings' },
    onClick: () => {
        //We set the btnDayReadings.children[] property
        btnDayReadings.children = [btnReadingsGospelIncenseVespers, btnReadingsGospelIncenseDawn, btnReadingsStPaul, btnReadingsKatholikon, btnReadingsPraxis, btnReadingsGospelMass];
        if (Season == Seasons.GreatLent && todayDate.getDay() != 6) {
            //we are during the Great Lent and we are not a Saturday
            if (btnDayReadings.children.indexOf(btnReadingsGospelIncenseVespers) > -1) {
                //There is no Vespers office: we remove the Vespers Gospel from the list of buttons
                btnDayReadings.children.splice(btnDayReadings.children.indexOf(btnReadingsGospelIncenseVespers), 1);
            }
            ;
            //If, in additon, we are not a Sunday (i.e., we are during any week day other than Sunday and Saturday), we will  add the Prophecies button to the list of buttons
            if (todayDate.getDay() != 0) {
                //We are not a Sunday:
                if (btnDayReadings.children.indexOf(btnReadingsPropheciesDawn) == -1) {
                    btnDayReadings.children.unshift(btnReadingsPropheciesDawn);
                }
                ;
                //since we  are not a Sunday, we will also remove the Night Gospel if included
                if (btnDayReadings.children.indexOf(btnReadingsGospelNight) > -1) {
                    btnDayReadings.children.splice(btnDayReadings.children.indexOf(btnReadingsGospelNight), 1);
                }
                ;
            }
            else if (todayDate.getDay() == 0) {
                //However, if we are a Sunday, we add the Night Gospel to the readings list of buttons
                if (btnDayReadings.children.indexOf(btnReadingsGospelNight) == -1) {
                    // (we do not add it to the Unbaptized mass menu because it is not read during the mass)
                    btnDayReadings.children.push(btnReadingsGospelNight);
                }
                ;
            }
            ;
        }
        ;
    }
});
const btnReadingsStPaul = new Button({
    btnID: 'btnReadingsStPaul',
    label: {
        AR: 'البولس',
        FR: 'Epître de Saint Paul',
        EN: 'Pauline Epistle'
    },
    prayers: [Readings.StPaul],
    prayersArray: StPaulArray,
    languages: readingsLanguages
});
const btnReadingsKatholikon = new Button({
    btnID: 'btnReadingsKatholikon',
    label: {
        AR: 'الكاثوليكون',
        FR: 'Katholikon'
    },
    prayers: [Readings.Katholikon],
    prayersArray: KatholikonArray,
    languages: readingsLanguages
});
const btnReadingsPraxis = new Button({
    btnID: 'btnReadingsPraxis',
    label: {
        AR: 'الإبركسيس',
        FR: 'Praxis'
    },
    prayers: [Readings.Praxis],
    prayersArray: PraxisArray,
    languages: readingsLanguages
});
const btnReadingsSynaxarium = new Button({
    btnID: 'btnReadingsSynaxarium',
    label: {
        AR: 'السنكسار',
        FR: 'Synaxarium'
    },
    prayers: [Readings.Synaxarium],
    prayersArray: SynaxariumArray,
    languages: readingsLanguages
});
const btnReadingsGospelMass = new Button({
    btnID: 'btnReadingsGospelMass',
    label: {
        AR: 'إنجيل القداس',
        FR: 'l\'Evangile',
        EN: 'Gospel'
    },
    prayers: setGospelPrayers(Readings.GospelMass),
    prayersArray: GospelMassArray,
    languages: readingsLanguages,
});
const btnReadingsGospelIncenseVespers = new Button({
    btnID: 'btnReadingsGospelIncenseVespers',
    label: {
        AR: 'إنجيل عشية',
        FR: 'Evangile  Vêpres',
        EN: 'Vespers Gospel'
    },
    prayers: setGospelPrayers(Readings.GospelVespers),
    prayersArray: GospelVespersArray,
    languages: readingsLanguages,
    onClick: () => {
        //we will first store the value of Season because it might be changed during the following process
        let currentSeason = Season;
        // we will retrieve the vespers prayers by the date of the next day (i.e., if we are a Saturday, we will retrieve the gospel according to the date of Sunday not the date of Saturday itself). Thi is because the ppt slides were setting the date of the vespers gospel according the the next day
        let readingDate = 'Date=' + setSeasonAndCopticReadingsDate(convertGregorianDateToCopticDate(new Date(todayDate.getTime() + calendarDay)));
        //adding the date to the psalm
        btnReadingsGospelIncenseVespers.prayers[1] += readingDate;
        //adding the date to the gospel
        btnReadingsGospelIncenseVespers.prayers[2] += readingDate;
        //we then reset the Season because it was potentially modified when calling setSeasonAndCopticReadingsDate()
        Season = currentSeason;
    }
});
const btnReadingsGospelIncenseDawn = new Button({
    btnID: 'btnReadingsGospelIncenseDawn',
    label: {
        AR: 'إنجيل باكر',
        FR: 'Evangile Aube',
        EN: 'Gospel Dawn'
    },
    prayers: setGospelPrayers(Readings.GospelDawn),
    prayersArray: GospelDawnArray,
    languages: readingsLanguages,
});
const btnReadingsGospelNight = new Button({
    btnID: 'btnReadingsGospelNight',
    label: {
        AR: 'إنجيل المساء',
        FR: 'Evangile Soir',
        EN: 'Vespers Gospel'
    },
    prayers: setGospelPrayers(Readings.GospelNight),
    prayersArray: GospelNightArray,
    languages: readingsLanguages,
});
const btnReadingsPropheciesDawn = new Button({
    btnID: 'btnReadingsPropheciesDawn',
    label: {
        AR: "نبوات باكر",
        FR: 'Propheties Matin'
    },
    parentBtn: btnIncenseDawn,
    prayers: [Readings.PropheciesDawn],
    prayersArray: PropheciesDawnArray,
    languages: readingsLanguages
});
const btnHeteneyat = new Button({
    btnID: 'btnHeteneyat',
    label: { AR: 'الهيتنيات', FR: 'Heteneyat' }
});
const btnPraxisResponse = new Button({
    btnID: 'btnPraxisResponse',
    label: { AR: 'مرد الإبركسيس', FR: 'Réponse Praxis' }
});
const btnMassGospelResponse = new Button({
    btnID: 'btnMassGospelResponse',
    label: { AR: 'مرد الإنجيل', FR: 'Réponse Evangile' }
});
const btnMassReconciliation = new Button({
    btnID: 'btnMassReconciliation',
    label: {
        AR: 'صلاة الصلح',
        FR: 'Reconcilation'
    }
});
const btnMassAnaphora = new Button({
    btnID: 'btnMassAnaphora',
    label: { AR: 'الأنافورة', FR: 'Anaphora' }
});
const btnMassCommunion = new Button({
    btnID: 'btnMassCommunion',
    label: { AR: 'التوزيع', FR: 'Communion' }
});
btnMain.children = [btnMass, btnIncenseOffice, btnDayReadings];
btnMass.children = [btnIncenseDawn, btnMassOfferingOfTheLamb, btnMassRoshoumat, btnMassUnBaptised, btnMassBaptised];
btnMassUnBaptised.children = [btnReadingsStPaul, btnReadingsKatholikon, btnReadingsPraxis, btnReadingsSynaxarium, btnReadingsGospelMass];
/**
 * takes a liturgie name like "IncenseDawn" or "IncenseVespers" and replaces the word "Mass" in the buttons gospel readings prayers array by the name of the liturgie. It also sets the psalm and the gospel responses according to some sepcific occasions (e.g.: if we are the 29th day of a coptic month, etc.)
 * @param liturgie {string} - expressing the name of the liturigie that will replace the word "Mass" in the original gospel readings prayers array
 * @returns {string} - returns an array representing the sequence of the gospel reading prayers, i.e., an array like ['Psalm Response', 'Psalm', 'Gospel', 'Gospel Response']
 */
function setGospelPrayers(liturgie) {
    //this function sets the date or the season for the Psalm response and the gospel response
    // if (!todayDate) { var todayDate = new Date };
    let prayers = [...GospelPrayers], date;
    let psalm = prayers.indexOf('PrayerPsalmResponse'), gospel = prayers.indexOf('PrayerGospelResponse');
    //we replace the word 'Mass' in 'ReadingsGospelMass' by the liturige, e.g.: 'IncenseDawn'
    prayers[psalm + 1] = prayers[psalm + 1].replace(Readings.GospelMass, liturgie);
    //setting the psalm and gospel responses
    if (Number(copticDay) == 29 && Number(copticMonth) != 4) {
        //we on the 29th of any coptic month except Kiahk (because the 29th of kiahk is the nativity feast)
        date = 'Date=2900';
        setResponse(psalm, date);
        setResponse(gospel, date);
    }
    else if (Number(copticMonth) == 4) {
        // we are during Kiahk month: the first 2 weeks have their own gospel response, and the second 2 weeks have another gospel response
        checkWhichSundayWeAre(Number(copticDay)) == '1stSunday' || '2ndSunday' ? date = 'Date=041stSunday' : date = 'Date=043rdSunday';
        setResponse(psalm, date);
    }
    else if (Season == Seasons.GreatLent) {
        //we are during the Great Lent period
        todayDate.getDay() == 0 || todayDate.getDay() == 6 ? date = 'Season=' + Season + 'Sundays' : date = 'Season=' + Season + 'Week';
        setResponse(gospel, date);
    }
    else if (Object.keys(copticFeasts).map(k => copticFeasts[k]).indexOf(copticDate) > -1 || //we check if copticDate = the value of any of the feasts dates in copticFeasts object
        [Seasons.JonahFast + '1', Seasons.JonahFast + '2', Seasons.JonahFast + '3', Seasons.JonahFast + '4'].indexOf(copticDate) > -1) //those are the 4 days of the Jonah fast
     {
        //if coptiDate equals one of the coptic feasts in the copticFeasts object, we set the psalm and gospel prayers to the copticDate
        date = 'Date=' + copticDate;
        setResponse(psalm, date);
        setResponse(gospel, date);
    }
    else if (Season == Seasons.NoSeason) {
        date = 'Date=0000';
        setResponse(psalm, date);
    }
    ;
    function setResponse(index, date) {
        prayers[index] = prayers[index] + date;
    }
    return prayers;
}
;
let btnsPrayers = [];
let btns = [btnIncenseDawn, btnIncenseVespers, btnMassStCyril, btnMassStBasil, btnMassStGregory];
