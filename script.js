const httpGet = (endpoint) => http("GET", endpoint);
const httpPost = (endpoint, data) => http("POST", endpoint, data);

const categories = [];
const name = "Yehuda Katz";
const people = ["Yehuda Katz", "Alan Johnson", "Charles Jolley"];

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

function addSubcategories() {
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    categories[i].subcategories = httpGet(
      `categories/${category.id}/subcategories`
    );
  }
}

httpGet("categories").then((data) => {
  console.log(data);
});

let templates = {};
