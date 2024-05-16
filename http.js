const PORT = 5000;

// Makes a GET request to the wiki-ads server with the endpoint passed as parameter.
async function get(endpoint) {
  const res = await http("GET", `https://wiki-ads.onrender.com/${endpoint}`);
  return res;
}

// Makes a POST request to the wiki-ads server with the endpoint passed as parameter, and the data to be posted.
async function post(endpoint, data) {
  const res = await http(
    "POST",
    `https://wiki-ads.onrender.com/${endpoint}`,
    data
  );
  return res;
}

// Makes a GET request to our local server with the endpoint passed as parameter.
async function getMyServer(
  endpoint,
  headers = { "Content-Type": "application/json" }
) {
  const res = await http(
    "GET",
    `http://localhost:${PORT}/${endpoint}`,
    {},
    headers
  );
  return res;
}

// Makes a POST request to our local server with the endpoint passed as parameter, and the data to be posted.

async function postMyServer(endpoint, data) {
  const res = await http("POST", `http://localhost:${PORT}/${endpoint}`, data);
  return res;
}

// Makes a POST request to our local server with the endpoint passed as parameter, and the data to be put.
async function putMyServer(endpoint, data) {
  const res = await http("PUT", `http://localhost:${PORT}/${endpoint}`, data);
  return res;
}

// Makes a POST request to our local server with the endpoint passed as parameter, and the data to be deleted.
async function deleteMyServer(endpoint, data) {
  const res = await http(
    "DELETE",
    `http://localhost:${PORT}/${endpoint}`,
    data
  );
  return res;
}

// the method used for all the http calls
async function http(method, endpoint, data = {}, headers = {}) {
  if (method === "GET") {
    const res = await fetch(`${endpoint}`, {
      method: "GET",
      headers,
    });
    return await res.json();
  }
  const res = await fetch(`${endpoint}`, {
    method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
}

export default {
  get,
  post,
  getMyServer,
  postMyServer,
  putMyServer,
  deleteMyServer,
};
