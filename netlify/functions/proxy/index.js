const { getRequest, filterTestDataOnlyForWb } = require("./utils");

const BASE_URL = "https://data.covid19india.org/";
const CACHE_RESP_TIME_IN_SECONDS = 60 * 60;

exports.handler = async (event) => {
  try {
    const { path = "" } = event.queryStringParameters || {};
    const url = BASE_URL + decodeURIComponent(path);
    let response = await getRequest(url);
    if (path === "state_test_data.json") {
      // Reduce the huge payload size
      response = filterTestDataOnlyForWb(response);
    }
    return {
      statusCode: 200,
      headers: {
        "cache-control": `public, max-age=${CACHE_RESP_TIME_IN_SECONDS};`,
      },
      body: response,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed fetching data" }),
    };
  }
};
