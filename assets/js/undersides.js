function goBack() {
    let previousPage = sessionStorage.getItem("previousPage");
    if (previousPage) {
      window.location.href = previousPage;
    } else {
      alert("Keine vorherige Seite gefunden");
    }
  }  


function openNewTab(url) {
    sessionStorage.setItem('previousPage', window.location.href);
    window.open(url, '_blank');
}