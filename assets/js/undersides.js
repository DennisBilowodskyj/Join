function goBack() {
    window.history.back();
  }

  //async function checkEmailSummary() {
  //  const guestUser = localStorage.getItem('guestUser');
  //  if(guestUser === 'Guest'){
  //    document.getElementById('userName').innerHTML = 'Guest';
  //    document.getElementById('user').innerHTML = 'G';
  //  } else{
  //  const emailToSearch = localStorage.getItem('checkinUser');
  //  const cleanedEmailToSearch = emailToSearch.replace(/^"(.*)"$/, '$1'); // Entfernt Anführungszeichen
  //  if (emailToSearch) {
  //    const lowerCaseEmailToSearch = cleanedEmailToSearch.toLowerCase();
  //    console.log("Lowercase search email:", lowerCaseEmailToSearch);
  //
  //    const matchingUser = users.find(user => {
  //      console.log("Lowercase user email:", user.email.toLowerCase());
  //      return user.email.toLowerCase() === lowerCaseEmailToSearch;
  //    });
  //
  //    if (matchingUser) {
  //      // Übereinstimmung gefunden, setze den Benutzernamen
  //      document.getElementById('userName').innerHTML = matchingUser.name;
  //      console.log("Match found. User name:", matchingUser.name);
  //      loadInitialsHeader(matchingUser);
  //      return; // Beende die Funktion nach der Aktualisierung des Benutzernamens
  //    } else {
  //      console.error("Kein Benutzer mit der angegebenen E-Mail-Adresse gefunden.");
  //    }
  //  } else {
  //    console.error("Fehlender oder ungültiger Wert im localStorage für den Schlüssel 'checkinUser'");
  //  }
  //}
  //}