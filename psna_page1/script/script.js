// Get a reference to the close icon element
const closeIcon = document.getElementById('close-login');

// Add a click event listener to the close icon
closeIcon.addEventListener('click', () => {
  // Redirect to another page when the close icon is clicked
  window.location.href = 'index.html';
});


// document.getElementsById('close-login').addEventListener('click', function(event) {
//   event.preventDefault(); // Prevent the default link behavior
//   document.getElementById('login-popup').style.display = 'block';
// });
// document.getElementById('close-login').addEventListener('click', function() {
//   document.getElementById('login-popup').style.display = 'none';
// });
document.addEventListener("DOMContentLoaded", function() {
    var loginLink = document.getElementById("login-link");
    var loginPopup = document.getElementById("login-popup");
    var closeLogin = document.getElementById("close-login");
  
    loginLink.addEventListener("click", function(event) {
      event.preventDefault(); // Prevent the default hyperlink behavior
      loginPopup.style.display = "flex";
    });
  
    closeLogin.addEventListener("click", function() {
      loginPopup.style.display = "none";
    });
  
    loginPopup.addEventListener("click", function(event) {
      if (event.target === loginPopup) {
        loginPopup.style.display = "none";
      }
    });
  });
  





