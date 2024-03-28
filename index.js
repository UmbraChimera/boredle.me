let currentIndex = 0;
let selectedWebsites = [];

function showOptions() {
  document.getElementById("options-container").style.display = "block";
}

document
  .getElementById("options-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const checkboxes = document.querySelectorAll(
      "input[name='website']:checked"
    );
    selectedWebsites = Array.from(checkboxes, (checkbox) => checkbox.value);

    if (selectedWebsites.length > 0) {
      const optionsContainer = document.getElementById("options-container");
      optionsContainer.style.display = "none";
      document.getElementById("select_text").style.display = "none";
      document.getElementById("iframe-container").style.display = "block";
      document
        .querySelectorAll("#nav button")
        .forEach((btn) => (btn.style.display = "inline-block"));
      document.getElementById("launch_button").style.display = "none";
      document.getElementById("donate").style.cssText =
        "height: 4em; width: 8em;";
      loadWebsite(selectedWebsites[currentIndex]);
      displayProgress();
      updateUrl();
    } else {
      alert("Please select at least one website or add a custom URL.");
    }
  });

function loadWebsite(url) {
  const iframeContainer = document.getElementById("iframe-container");
  const iframe = document.createElement("iframe");
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
  iframeContainer.innerHTML = "";
  iframeContainer.appendChild(iframe);
}

function nextWebsite() {
  currentIndex = (currentIndex + 1) % selectedWebsites.length;
  document.querySelector("#iframe-container iframe").src =
    selectedWebsites[currentIndex];
  displayProgress();
  updateUrl();
}

function prevWebsite() {
  currentIndex =
    (currentIndex - 1 + selectedWebsites.length) % selectedWebsites.length;
  document.querySelector("#iframe-container iframe").src =
    selectedWebsites[currentIndex];
  displayProgress();
  updateUrl();
}

function selectAll() {
  const selectAllCheckbox = document.getElementById("select-all");
  const checkboxes = document.querySelectorAll("input[name='website']");
  checkboxes.forEach(
    (checkbox) => (checkbox.checked = selectAllCheckbox.checked)
  );
}

function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("websites") ? urlParams.get("websites").split(",") : [];
}

function addCustomURL() {
  let customURL = document.getElementById("custom-url").value.trim();
  if (customURL !== "") {
    if (!customURL.includes("://")) {
      customURL = "https://" + customURL;
    }
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "website";
    checkbox.value = customURL;
    const label = document.createElement("label");
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
  const progressElement = document.getElementById("progress");
  progressElement.textContent = `${currentIndex + 1}/${
    selectedWebsites.length
  }`;
}

function updateUrl() {
  const queryString = "websites=" + selectedWebsites.join(",");
  history.pushState(null, null, window.location.pathname + "?" + queryString);
}

window.onload = function () {
  showOptions();
  const urlParams = getUrlParams();
  if (urlParams.length > 0) {
    const checkboxes = document.querySelectorAll("input[name='website']");
    checkboxes.forEach((checkbox) => {
      if (urlParams.includes(checkbox.value)) {
        checkbox.checked = true;
        if (!selectedWebsites.includes(checkbox.value)) {
          selectedWebsites.push(checkbox.value);
        }
      }
    });
  }
  const customURLParams = urlParams.filter(
    (url) => !selectedWebsites.includes(url)
  );
  customURLParams.forEach((customURL) => {
    if (!selectedWebsites.includes(customURL)) {
      selectedWebsites.push(customURL);
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "website";
      checkbox.value = customURL;
      checkbox.checked = true;
      const label = document.createElement("label");
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(customURL));
      document
        .getElementById("custom_dles")
        .insertBefore(label, document.getElementById("custom-url").parentNode);
    }
  });
};
