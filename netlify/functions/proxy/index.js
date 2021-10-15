const { getRequest } = require("./utils");

const BASE_URL = "https://data.covid19india.org/";

exports.handler = async (event) => {
  try {
    const { path = "" } = event.queryStringParameters || {};
    const url = BASE_URL + decodeURIComponent(path);
    let response = await getRequest(url);
    if (path === "state_test_data.json") {
        // Reduce the huge payload size
        response = filterTestDataOnlyForWb(response);
    }
    return { statusCode: 200, body: response };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed fetching data" }),
    };
  }
};
