const { getRequest } = require("./utils");

const BASE_URL = "https://data.covid19india.org/";

exports.handler = async (event, context) => {
  try {
    const { path = "" } = event.queryStringParameters || {};
    const url = BASE_URL + decodeURIComponent(path);
    const response = await getRequest(url);
    return { statusCode: 200, body: response };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed fetching data" }),
    };
  }
};
