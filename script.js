const httpGet = (endpoint) => http("GET", endpoint);
const httpPost = (endpoint, data) => http("POST", endpoint, data);

async function http(method, endpoint, data = {}) {
  if (method === "GET") {
    const res = await fetch(`https://wiki-ads.onrender.com/${endpoint}`, {
      method: "GET",
    });
    return await res.json();
  }
  const res = await fetch(`https://wiki-ads.onrender.com/${endpoint}`, {
    method,
    body: JSON.stringify(data),
  });
  return await res.json();
}

httpGet("categories").then((data) => {
  console.log(data);
});
