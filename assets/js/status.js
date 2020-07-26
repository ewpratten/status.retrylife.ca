// Get the DOM element to place all status info inside of
var status_container = document.getElementById("status-container");

// List of statuses to writer
var statuses = [];

function addStatusToBuffer(name, ok, message, desc) {
  // Determine the badge type
  var badge_type = ok ? "success" : "warning";

  // Construct some HTML and add it to the statuses list
  statuses.push(
    '<li class="list-group-item"> <h4 class="list-group-item-heading service-name">\
        ' +
      name +
      '\
        <a href="#" data-toggle="tooltip" data-placement="bottom" title="' +
      desc +
      '">\
        <i class="fa fa-question-circle"></i>\
        </a></h4><h4> <span class="badge badge-' +
      badge_type +
      ' service-status">' +
      message +
      "</span></h4></li>"
  );
}

function writeBuffer() {
  status_container.innerHTML = "";
  statuses.forEach((s) => {
    status_container.innerHTML += s;
  });
  statuses = [];
}

function loadStatusData() {
  // Make the API call
  const Http = new XMLHttpRequest();
  const url = "https://api.retrylife.ca/status";
  Http.open("GET", url);
  Http.send();

  // Handle response
  Http.onreadystatechange = (e) => {
    // Get response data
    var response = JSON.parse(Http.response);

    // Check API status
    if (!response.success) {
      addStatusToBuffer(
        "RetryLife API",
        false,
        "Failed to generate status info",
        "The RetryLife API's production deployment"
      );
      writeBuffer();
      return;
    }

    // Handle writing each status message
    Object.keys(response.services).forEach((key) => {
      // Get the data
      var name = key;
      var ok = response.services[key].ok;
      var message = response.services[key].message;
      var desc = response.services[key].service_info;

      // Add the status
      addStatusToBuffer(key, ok, message, desc);
    });

    // Write the buffer
    writeBuffer();
  };
}

// Load the data every 30 seconds
setInterval(loadStatusData, 30000);
loadStatusData();