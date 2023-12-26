const httpGet = (endpoint) =>
  http("GET", `https://wiki-ads.onrender.com/${endpoint}`);
const httpPost = (endpoint, data) =>
  http("POST", `https://wiki-ads.onrender.com/${endpoint}`, data);
const httpGetLocalServer = (endpoint) =>
  http("GET", `http://localhost:5000/${endpoint}`);
const httpPostLocalServer = (endpoint, data) =>
  http("POST", `http://localhost:5000/${endpoint}`, data);
const httpPutLocalServer = (endpoint, data) =>
  http("PUT", `http://localhost:5000/${endpoint}`, data);
const httpDeleteLocalServer = (endpoint, data) =>
  http("DELETE", `http://localhost:5000/${endpoint}`, data);

let categories = [];
let username = "";
let sessionId = "";
const ads = [];

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

async function addSubcategories() {
  // Use Promise.all to wait for all async calls to complete
  await Promise.all(
    categories.map(async (category) => {
      const data = await httpGet(`categories/${category.id}/subcategories`);
      category.subcategories = data;
    })
  );
}

// processes the ads fetched from subcategory GETs
async function processAds(ads) {
  console.log(ads);

  // for each ad, make features into an array
  ads.forEach((ad) => {
    ad.features = ad.features.split("; ");
    // for each feature, split it into a key-value pair
    const pairs = [];
    ad.features.forEach((feature) => {
      const pair = feature.split(": ");
      if (pair.length == 1) pair.push("Ναι");
      pairs.push(pair);
    });
    ad.features = pairs;
  });
  console.log(ads);
}

let templates = {};

// setting up the HTML template for the index.html page
templates.index = Handlebars.compile(`
<h1>Categories</h1>
{{#each this}}
<section class="category">
  <h2>{{title}}</h2>
  <a class="category-img" href="category.html?id={{id}}&title={{title}}">
    <img src="https://wiki-ads.onrender.com/{{img_url}}" alt="{{title}}" />
  </a>
  <ul>
    {{#each this.subcategories}}
    <li>
      <a href="subcategory.html?id={{id}}&title={{title}}">{{title}}</a>
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
  <img src="../resources/heart.svg" alt="heart" class="heart" data-index="{{id}}" />
    <h3>{{title}}</h3>
   <h4>Κωδικός αγγελίας: {{id}}</h4>
    <figure>
      {{#each images}} {{#if @first}}
      <img src="https://wiki-ads.onrender.com/{{this}}" alt="{{title}}"/>
      {{/if}} {{/each}}
      <figcaption>{{description}}</figcaption>
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
  <input type="radio" id="all" name="selected" data-index="0" checked />
</div>
{{#each this}}
  <div>
    <label for="{{title}}">{{title}}</label>
    <input type="radio" id="{{title}}" name="selected" data-index="{{id}}" />
  </div>
{{/each}}
`);

// setting up the HTML template for each category.html page
templates.subcategory = Handlebars.compile(`
{{#each this}}
<a class="card">
  <article class="listing">
    <h3>{{title}}</h3>
    <figure>
      <div class="image-container">
        {{#each images}}
          <img src="https://wiki-ads.onrender.com/{{this}}" alt="{{title}}" />
        {{/each}}
      </div>
      <figcaption>{{description}}</figcaption>
    </figure>
    <dl class="listing-details">
      <dt>Τιμή</dt>
      <dd>€{{cost}}</dd>
    </dl>
    <table>
        <caption>
          Χαρακτηριστικά
        </caption>
        <colgroup>
          <col span="2" />
        </colgroup>
        <tbody>
          {{#each features}}
          <tr>
          {{#each this}}
          {{#if @first}}
            <th>{{this}}</th>
          {{else}}
            <td>{{this}}</td>
          {{/if}}
          {{/each}}
          </tr>
          {{/each}}
        </tbody>
      </table>
  </article>
</a>
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

  if (url.includes("/subcategory.html")) {
    const subcategoryId = new URLSearchParams(window.location.search).get("id");
    const subcategoryTitle = new URLSearchParams(window.location.search).get(
      "title"
    );
    const query = `ads/subcategory?id=${subcategoryId}`;
    const ads = await httpGetLocalServer(query);

    processAds(ads);

    let content = templates.subcategory(ads);
    let div = document.querySelector(".listings");
    div.innerHTML = content;

    div = document.querySelector("h1");
    div.innerHTML = subcategoryTitle;
  }

  if (url.includes("/category.html")) {
    const categoryId = new URLSearchParams(window.location.search).get("id");
    const categoryTitle = new URLSearchParams(window.location.search).get(
      "title"
    );
    const subcategories = await httpGet(
      `categories/${categoryId}/subcategories`
    );
    const query = `ads/category?id=${categoryId}`;
    const ads = await httpGetLocalServer(query);

    let content = templates.category(ads);
    let div = document.querySelector(".listings");
    div.innerHTML = content;

    content = templates.filter(subcategories);
    div = document.querySelector(".filter");
    div.innerHTML = content;

    div = document.querySelector("h1");
    div.innerHTML = categoryTitle;

    document.querySelectorAll(".heart").forEach((heart) => {
      heart.addEventListener("click", async (event) => {
        const id = event.target.dataset.index;
        const title = event.target.parentElement.querySelector("h3").innerHTML;
        const description =
          event.target.parentElement.querySelector("figcaption").innerHTML;
        const cost = event.target.parentElement.querySelector("dd").innerHTML;
        const image_url =
          event.target.parentElement.querySelector("figure>img").src;
        const ad = { id, title, description, cost, image_url };
        console.log(ad);
        await addFavourite(ad);
      });
    });

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

async function submitForm() {
  event.preventDefault();
  const name = document.getElementById("username-txt").value;
  const password = document.getElementById("password-txt").value;
  if (name == "" || password == "") {
    alert("Παρακαλώ συμπληρώστε τα στοιχεία σας");
    return;
  }
  username = name;
  const data = { username, password };
  console.log(data);
  const response = await httpPostLocalServer("login", data);
  console.log(response);
  sessionId = response.sessionId;
  // display message
  const message = document.getElementById("message");
  message.innerHTML = response.message;
  // add class to message, depending on status code
  const status = response.code == 200 ? "success" : "error";
  message.classList.add(status);

  // remove message after 3 seconds
  setTimeout(() => {
    message.innerHTML = "";
    message.classList.remove(status);
  }, 3000);
}

async function addFavourite(ad) {
  const data = { ad, username, sessionId };
  console.log(data);
  const res = await httpPutLocalServer("favourites", data);
  alert(res.message);
}
