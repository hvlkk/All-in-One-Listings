const httpGet = (endpoint) =>
  http("GET", `https://wiki-ads.onrender.com/${endpoint}`);
const httpPost = (endpoint, data) =>
  http("POST", `https://wiki-ads.onrender.com/${endpoint}`, data);
const httpGetLocalServer = (endpoint) =>
  http("GET", `http://localhost:5000/${endpoint}`);

let categories = [];

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

// setting up the HTML template for the index.html page
templates.index = Handlebars.compile(`
<h1>Categories</h1>
{{#each this}}
<section class="category">
<h2>{{title}}</h2>
<a class="category-img" href="category.html?id={{id}}&title={{title}}">
<img
  src="https://wiki-ads.onrender.com/{{img_url}}"
  alt="{{title}}"
/>
</a>
<ul>
{{#each this.subcategories}}
<li>
<a href="subcategory.html?id={{id}}">{{this.title}}</a>
</li>
{{/each}}
</ul>
</section>
{{/each}}
`);

// setting up the HTML template for each category.html page
templates.category = Handlebars.compile(`
{{#each this}}
<a class="card">
        <article class="listing">
          <h3>{{title}}</h3>
          <figure>
          {{#each images}}
          {{#if @first}}
            <img
              src="https://wiki-ads.onrender.com/{{this}}"
              alt="{{title}}"
            />
            {{/if}}
          {{/each}}
            <figcaption>
              {{description}}
            </figcaption>
          </figure>
          <dl class="listing-details">
            <dt>Τιμή</dt>
            <dd>€{{cost}}</dd>
          </dl>
        </article>
      </a>
{{/each}}
`);

// setting up the HTML template for the filter options (in the category.html page)
templates.filter = Handlebars.compile(`
    <div>
      <label for="all">Όλα</label>
      <input type="radio" id="all" name="selected" data-index="0" checked/>
    </div>
    {{#each this}}
    <div>
      <label for="{{title}}">{{title}}</label>
      <input type="radio" id="{{title}}" name="selected" data-index="{{id}}"/>
    </div>
    {{/each}}
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
    const subcategories = await httpGet(
      `categories/${categoryId}/subcategories`
    );
    const categoryTitle = new URLSearchParams(window.location.search).get(
      "title"
    );
    subcategories.selectedCategory = categoryTitle;
    const query = `ads/category?id=${categoryId}`;
    const ads = await httpGetLocalServer(query);
    ads.selectedCategory = categoryTitle;
    console.log("Ads:", ads);

    let content = templates.category(ads);
    let div = document.querySelector(".listings");
    div.innerHTML = content;

    content = templates.filter(subcategories);
    div = document.querySelector(".filter");
    div.innerHTML = content;

    div = document.querySelector("h1");
    div.innerHTML = categoryTitle;

    const radioButtons = document.querySelectorAll("input[type=radio]");
    radioButtons.forEach((radioButton) => {
      radioButton.addEventListener("click", async (event) => {
        const index = event.target.dataset.index;
        const selectedAds =
          index == 0 ? ads : ads.filter((ad) => ad.subcategory_id == index);
        content = templates.category(selectedAds);
        div = document.querySelector(".listings");
        div.innerHTML = content;
      });
    });
  }
};
