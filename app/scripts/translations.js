angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('de', {"Add user":"Kontakt hinzufügen","Cancel":"Abbrechen","Enter user name":"Telefonnummer des neuen Kontakts","Enter your password":"Gibt dein Passwort ein","Enter your phone number":"deine wunsch telefonnummer","Login Failed!":"Login fehlgeschlagen","Password":"Passwort","Please sign in":"Anmeldung","The phone-number exists. Please choose another phone-number.\n        <br>\n        If this this phone-number is yours, please insert the correct password.":"Diese Telefonnummer existiert bereits.<br>\nGebe dein Passwort ein, wenn die Telefonnummer dir gehört.","Your phone number":"deine Telefonnummer","only Words/Numbers are allowed":"Nur Buchstaben und Zahlen sind erlaubt","save new password":"neues Passwort speichern"});
/* jshint +W100 */
}]);