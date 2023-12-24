const httpGet = (endpoint) => http("GET", endpoint);
const httpPost = (endpoint, data) => http("POST", endpoint, data);

let categories = [];

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
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
  return await res.json();
}

async function addSubcategories() {
  console.log("addSubcategories");
  // Use Promise.all to wait for all async calls to complete
  await Promise.all(
    categories.map(async (category) => {
      const data = await httpGet(`categories/${category.id}/subcategories`);
      category.subcategories = data;
    })
  );
}

let templates = {};
templates.index = Handlebars.compile(`
<h1>Categories</h1>
{{#each this}}
<section class="category">
<h2>{{title}}</h2>
<a class="category-img" href="category.html?id={{id}}">
<img
  src="https://wiki-ads.onrender.com/{{img_url}}"
  alt="category image"
/>
</a>
<ul>
  {{#each this.subcategories}}
  <li>{{this.title}}</li>
  {{/each}}
</ul>
</section>
{{/each}}
`);
templates.category = Handlebars.compile(`

`);

window.onload = async function () {
  const url = window.location.href;

  if (url.includes("index.html")) {
    categories = await httpGet("categories");
    await addSubcategories();
    let content = templates.index(categories);
    let div = document.querySelector(".categories");
    div.innerHTML = content;
  }

  if (url.includes("category.html")) {
    const categoryId = new URLSearchParams(window.location.search).get("id");
    console.log("Category ID:", categoryId);
    const category = await httpGet("ads?category=1");
    console.log("Category:", category);
  }
};
