async function get(endpoint) {
  const res = await http("GET", `https://wiki-ads.onrender.com/${endpoint}`);
  return res;
}

async function post(endpoint, data) {
  const res = await http(
    "POST",
    `https://wiki-ads.onrender.com/${endpoint}`,
    data
  );
  return res;
}

async function getMyServer(endpoint) {
  const res = await http("GET", `http://localhost:5000/${endpoint}`);
  return res;
}

async function postMyServer(endpoint, data) {
  const res = await http("POST", `http://localhost:5000/${endpoint}`, data);
  return res;
}

async function putMyServer(endpoint, data) {
  const res = await http("PUT", `http://localhost:5000/${endpoint}`, data);
  return res;
}

async function deleteMyServer(endpoint, data) {
  const res = await http("DELETE", `http://localhost:5000/${endpoint}`, data);
  return res;
}

async function http(method, endpoint, data = {}) {
  if (method === "GET") {
    const res = await fetch(`${endpoint}`, {
      method: "GET",
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
