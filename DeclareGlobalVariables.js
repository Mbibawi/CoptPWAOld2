//CONSTANTS
const calendarDay = 24 * 60 * 60 * 1000; //this is a day in milliseconds
const containerDiv = document.getElementById('TargetDiv');
const leftSideBar = document.getElementById('leftSideBar');
const rightSideBar = document.getElementById('rightSideBar');
const contentDiv = document.getElementById('content');
const sideBarBtn = document.getElementById('opensidebar');
const toggleDevBtn = document.getElementById('toggleDev');
const ResurrectionDates = ["2023-04-16", "2024-05-05", "2025-04-29", "2026-04-12", "2027-05-02", "2028-04-23", "2029-04-8", "2030-04-28"]; // these are  the dates of the Ressurection feast caclulated from the end of the Jewish Pessah Feast as got from Google
var prayersLanguages = ['COP', 'FR', 'CA', 'AR'], readingsLanguages = ['AR', 'FR', 'EN'], PrayersArray = [], PraxisArray = [], KatholikonArray = [], StPaulArray = [], SynaxariumArray = [], GospelMassArray = [], GospelVespersArray = [], GospelDawnArray = [], GospelNightArray = [], PropheciesDawnArray = [], GospelResponse = '', PsalmResponse = '', lastClickedButton;
const Readings = {
    BibleIntroFR: '',
    BibleIntroAR: 'قفوا بخوف أمام الله لنسمع الإنجيل المقدس، فصل من بشارة الإنجيل لمعلمنا مار ــــــــــ البشير، والتلميذ الطاهر، بركاته على جميعنا',
    GospelEndFR: '',
    GospelEndAR: '',
    GospelVespers: "ReadingsGospelIncenseVespers",
    GospelDawn: "ReadingsGospelIncenseDawn",
    GospelMass: "ReadingsGospelMass",
    GospelNight: "ReadingsGospelNight",
    Psalm: "Psalm",
    StPaul: "ReadingsStPaul",
    StPaulIntroFR: '',
    StPaulIntroAR: '',
    StPaulEndFR: '',
    StPaulEndAR: 'نعمة الله الآب فلتكن مع جميعكم يا آبائي وإخوتي آمين',
    Katholikon: "ReadingsKatholikon",
    KatholikonIntroFR: '',
    KatholikonIntroAR: '',
    KatholikonEndFR: '',
    KatholikonEndAR: 'لا تحبو العالم ولا الأشياء التي في العالم لأن العالم يمضي وشهوته معه أما من يصنع مشيئة الله فيثبت إلى الأبد',
    Praxis: "ReadingsPraxis",
    PraxisIntroFR: '',
    PraxisIntroAR: 'الإبركسيس فصل من أعمال آبائنا الرسل الأطهار، الحوارين، المشمولين بنعمة الروح القدس، بركتهم المقدسة فلتكن معكم يا آبائي واخوتي آمين',
    PraxisEndFR: '',
    PraxisEndAR: 'لم تزل كلمة الرب تنمو وتعتز وتكثر في هذا البيعة وكل بيعة يا آبائي وإخوتي آمين',
    Synaxarium: "ReadingsSynaxarium",
    SynaxariumIntroFR: '',
    SynaxariumIntroAR: '',
    SynaxariumEndFR: '',
    SynaxariumEndAR: '',
    PropheciesDawn: "ReadingsPropheciesDawn",
};
const CommonPrayers = {
    OurFather: "OurFatherWhoArtInHeaven",
    ThanksGivingPrayer: "LetUsGiveThanks",
    WeExaltYou: "WeExaltYouMother",
    HailToYou: "HailToYou",
    Creed: "Creed",
    Kireyelison: "Kireyelison",
    PieceBeWithAll: "PieceBeWithAll",
    HolyLordOfSabaoth: "HolyLordOfSabaoth",
    HolyGod: "HolyGod",
    LitanyOfPeace: 'LitanyOfPeace',
    LitanytoTheFathers: 'LitanyToTheFathers',
    LitanyOfTheAssemblies: 'LitanyOfTheAssemblies',
    BowYourHeads: "BowYourHeadsToTheLord"
};
const Seasons = {
    StMaryFast: 'SaintMaryFast',
    GreatLent: 'GreatLent',
    FiftyHolyDays: 'Pentecostal',
    JonahFast: 'JonahFast',
    ApostlesFast: 'ApostlesFast',
    Nayrouz: 'Nayrouz',
    CrossFeast: 'CrossFeast',
    Resurrection: 'Resurrection',
    NoSeason: 'NoSpecificSeason',
};
const copticFeasts = {
    Nayrouz: '0101',
    StJohnBaptist: '0201',
    Cross: '1701',
    NativityBaramoun: '2804',
    Nativity: '2904',
    Circumcision: '0605',
    BaptismBaramoun: '1005',
    Baptism: '1105',
    KanaGalil: '1305',
    EntryToTemple: '0806',
    EntryToEgypt: '2409',
    Annociation: '2907',
    Epiphany: '1312',
    StMaryFastVespers: '3010',
    StMaryFast: '0112',
    StMaryFeast: '1612',
    PalmSunday: Seasons.GreatLent + '49',
    LazarusSaturday: Seasons.GreatLent + '48',
    Resurrection: 'Resurrection',
    Pentecoste: Seasons.Resurrection + '40',
    Ascension: Seasons.Resurrection + '50',
};
//VARS
if (!todayDate) {
    var todayDate;
}
;
var todayString;
const allLanguages = ['AR', 'FR', 'COP', 'CA', 'EN'];
const userLanguages = ['AR', 'FR', 'COP'];
var allDivs;
var copticDate, copticMonth, copticDay, copticReadingsDate, Season, weekDay;
