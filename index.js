var currentIndex = 0; /* Set the current index to 0 */
var selectedWebsites =
  []; /* Initialize an empty array to store selected websites */
function showOptions() {
  /* Function to display the options form */
  document.getElementById("options-container").style.display = "block";
}

/**
 * Event listener for the options form submission.
 * @param {Event} event - The submit event.
 */
document
  .getElementById("options-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var checkboxes = document.querySelectorAll("input[name='website']:checked");
    selectedWebsites = [];
    checkboxes.forEach(function (checkbox) {
      selectedWebsites.push(checkbox.value);
    });
    if (selectedWebsites.length > 0) {
      document.getElementById("options-container").style.display =
        "none"; /* Hide the options form */
      document.getElementById("select_text").style.display =
        "none"; /* Hide the options form */
      document.getElementById("iframe-container").style.display =
        "block"; /* Display the iframe container */
      document.querySelectorAll("#nav button").forEach(function (btn) {
        btn.style.display = "inline-block";
      });
      document.getElementById("launch_button").style.display = "none";
      document.getElementById("donate").style.height =
        "4em"; /* Set the height of the donate button */
      document.getElementById("donate").style.width =
        "8em"; /* Set the width of the donate button */
      loadWebsite(
        selectedWebsites[currentIndex]
      ); /* Load the first website in the list */
      displayProgress(); /* Display the progress of the selected websites */
      updateUrl(); /* Update the URL with the selected websites */
    } else {
      /* Display an alert if no websites are selected */
      alert("Please select at least one website or add a custom URL.");
    }
  });
/**
 * Loads a website into an iframe element.
 * If the website fails to load or has an empty body, it opens in a new window.
 * @param {string} url - The URL of the website to load.
 */
function loadWebsite(url) {
  var iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.onload = function () {
    if (
      iframe.contentDocument &&
      iframe.contentDocument.body.innerHTML === ""
    ) {
      window.open(url, "_blank");
    }
  };
  iframe.onerror = function () {
    window.open(url, "_blank");
  };
  document.getElementById("iframe-container").innerHTML = "";
  document.getElementById("iframe-container").appendChild(iframe);
}
/**
 * Function to load the next website in the list.
 * It updates the source of the iframe element with the URL of the next website,
 * displays the progress, and updates the URL in the browser.
 */
function nextWebsite() {
  currentIndex = (currentIndex + 1) % selectedWebsites.length;
  document.querySelector("#iframe-container iframe").src =
    selectedWebsites[currentIndex];
  displayProgress();
  updateUrl();
}
/**
 * Function to navigate to the previous website in the selectedWebsites array.
 * It updates the iframe source, displays the progress, and updates the URL.
 */
function prevWebsite() {
  currentIndex =
    (currentIndex - 1 + selectedWebsites.length) % selectedWebsites.length;
  document.querySelector("#iframe-container iframe").src =
    selectedWebsites[currentIndex];
  displayProgress();
  updateUrl();
}
/**
 * Selects or deselects all checkboxes with the name 'website' based on the state of the 'select-all' checkbox.
 */
function selectAll() {
  var selectAllCheckbox = document.getElementById("select-all");
  var checkboxes = document.querySelectorAll("input[name='website']");
  checkboxes.forEach(function (checkbox) {
    checkbox.checked = selectAllCheckbox.checked;
  });
}
/**
 * Retrieves the value of the "websites" parameter from the current URL's query string.
 * If the parameter is present, it splits the value by comma and returns an array of websites.
 * If the parameter is not present, it returns an empty array.
 *
 * @returns {Array} An array of websites extracted from the "websites" parameter in the URL query string.
 */
function getUrlParams() {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("websites") ? urlParams.get("websites").split(",") : [];
}
/**
 * Adds a custom URL to the options form.
 *
 * This function retrieves the value of the "custom-url" input field, trims any leading or trailing whitespace,
 * and checks if it is not empty. If the custom URL does not include "://", it prepends "https://" to it.
 * It then creates a checkbox input element with the name "website" and the value set to the custom URL.
 * A label element is created and the checkbox and custom URL text are appended to it.
 * The label is inserted before the "custom-url" input field's parent element in the options form.
 * The checkbox is checked and the "custom-url" input field is cleared.
 */
function addCustomURL() {
  var customURL = document.getElementById("custom-url").value.trim();
  if (customURL !== "") {
    if (!customURL.includes("://")) {
      customURL = "https://" + customURL;
    }
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "website";
    checkbox.value = customURL;
    var label = document.createElement("label");
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(customURL));
    document
      .getElementById("custom_dles")
      .insertBefore(label, document.getElementById("custom-url").parentNode);
    checkbox.checked = true;
    document.getElementById("custom-url").value = "";
  }
}

function displayProgress() {
  /* Function to display the progress of the selected websites */
  var progressElement = document.getElementById("progress");
  progressElement.textContent =
    currentIndex + 1 + "/" + selectedWebsites.length;
}
/**
 * Updates the URL with the selected websites.
 * This function appends the selected websites to the URL query string and updates the browser history.
 */
function updateUrl() {
  var queryString = "websites=";
  queryString += selectedWebsites.join(",");
  history.pushState(null, null, window.location.pathname + "?" + queryString);
}
/**
 * This function is executed when the window loads.
 * It performs the following tasks:
 * 1. Calls the showOptions() function.
 * 2. Retrieves the URL parameters using the getUrlParams() function.
 * 3. Checks if there are any URL parameters.
 * 4. If there are URL parameters, it iterates over the checkboxes and checks the ones that match the URL parameters.
 * 5. Adds the checked checkboxes to the selectedWebsites array.
 * 6. Filters out the URL parameters that are already in the selectedWebsites array.
 * 7. For each custom URL parameter, it creates a new checkbox element, sets its properties, and appends it to the options form.
 * 8. The new checkbox is checked and added to the selectedWebsites array.
 * @returns {void}
 */
window.onload = function () {
  showOptions();
  var urlParams = getUrlParams(); /* Retrieve the URL parameters */
  if (urlParams.length > 0) {
    /* Check if there are any URL parameters */
    var checkboxes = document.querySelectorAll("input[name='website']");
    checkboxes.forEach(function (checkbox) {
      /* Iterate over the checkboxes and check the ones that match the URL parameters */ if (
        urlParams.includes(checkbox.value)
      ) {
        /* Check if the URL parameter is in the selectedWebsites array */
        checkbox.checked = true;
        if (!selectedWebsites.includes(checkbox.value)) {
          /* Add the checked checkboxes to the selectedWebsites array */
          selectedWebsites.push(checkbox.value);
        }
      }
    });
  }
  var customURLParams = urlParams.filter(
    /* Filter out the URL parameters that are already in the selectedWebsites array */
    (url) => !selectedWebsites.includes(url)
  );
  customURLParams.forEach(function (customURL) {
    /* For each custom URL parameter, create a new checkbox element */ if (
      !selectedWebsites.includes(customURL)
    ) {
      selectedWebsites.push(customURL);
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "website";
      checkbox.value = customURL;
      checkbox.checked = true;
      var label =
        document.createElement("label"); /* Create a new label element */
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(customURL));
      document.getElementById("custom_dles").insertBefore(
        /* Append the new checkbox to the options form */
        label,
        document.getElementById("custom-url").parentNode
      );
    }
  });
};
