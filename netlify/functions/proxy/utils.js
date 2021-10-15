const https = require("https");

async function getRequest(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (res) => {
      if (!res.statusCode.toString().startsWith("20")) {
        reject(`Did not get an OK from the server. Code: ${res.statusCode}`);
        res.resume();
        return;
      }

      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("close", () => {
        resolve(data);
      });
    });

    request.on("error", (err) => {
      reject(`Encountered an error trying to make a request: ${err.message}`);
    });
  });
}

function filterTestDataOnlyForWb(response) {
  const { states_tested_data = [] } = JSON.parse(response) || {};
  const filteredData = states_tested_data.filter(
    (data) => data.state === "West Bengal"
  );
  return JSON.stringify({ states_tested_data: filteredData });
}

module.exports = { getRequest, filterTestDataOnlyForWb };
