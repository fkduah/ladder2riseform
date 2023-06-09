

  // Access a form with then name and ID of 'flowbaseSlider' and name of 'Email Form'
  var form = document.getElementById("flowbaseSlider");

  // Get the input elements with the ID and Name 'Date' and 'hidden-amount'
  var dateInput = form.elements["Date"];
  var hiddenAmountInput = form.elements["hidden-amount"];

  // Create a function to update the new URL based on the values of the input elements
  function updateNewURL() {
    // Create a base URL with the query string parameter for publictoken
    var baseURL = "https://assurant-storefront-uat.azurewebsites.net/?publictoken=NEWHAVEN";

    // Create a new URL object with the base URL
    var newURL = new URL(baseURL);

    // Check if the date value is not null
    if (window.dateValue) {
      // Append the query string parameter for dob using the date value from the window object
      newURL.searchParams.append("dob", window.dateValue);
    }

    // Check if the hidden amount value is not null
    if (window.hiddenAmountValue) {
      // Append the query string parameter for amount using the hidden amount value from the window object
      newURL.searchParams.append("amount", window.hiddenAmountValue);
    }

    // Store the new URL as a global variable
    window.amountURL = newURL;

    // Console log the new URL
    console.log(window.amountURL);
  }

  // Add an event listener to the date input element for the input event
  dateInput.addEventListener("input", function() {
    // Update the window object with the new date value
    window.dateValue = dateInput.value;

    // Console log the new date value
    console.log(window.dateValue);

    // Update the new URL based on the input values
    updateNewURL();
  });

  // Add an event listener to the hidden amount input element for the input event
  hiddenAmountInput.addEventListener("input", function() {
    // Update the window object with the new hidden amount value
    window.hiddenAmountValue = hiddenAmountInput.value;

    // Console log the new hidden amount value
    console.log(window.hiddenAmountValue);

    // Update the new URL based on the input values
    updateNewURL();
  });
