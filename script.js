import http from "./http.js";

let categories = [];
let username = "";
let sessionId = "";

async function addSubcategories() {
  // Use Promise.all to wait for all async calls to complete
  await Promise.all(
    categories.map(async (category) => {
      const data = await http.get(`categories/${category.id}/subcategories`);
      category.subcategories = data;
    })
  );
}

// processes the ads fetched from subcategory GETs
async function processAds(ads) {
  // for each ad, make its features into an array
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
}

let templates = {};

// setting up the HTML template for the index.html page
templates.index = Handlebars.compile(`
<h1>Κατηγορίες</h1>
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
    <img src="../resources/heart.svg" alt="heart" class="heart heart-empty" data-index="{{id}}" />
    <img src="../resources/heart_full.svg" alt="heart" class="heart heart-full" data-index="{{id}}" hidden/>
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

// setting up the HTML template for the favourite-ads.html page
templates.favourites = Handlebars.compile(`
{{#each this}}
<a class="card">
  <article class="listing">
    <img src="../resources/heart_full.svg" alt="heart" class="heart" data-index="{{id}}" />
    <h3>{{title}}</h3>
    <h4>Κωδικός αγγελίας: {{id}}</h4>
    <figure>
      <img src="{{image_url}}" alt="{{title}}"/>
      <figcaption>{{description}}</figcaption>
    </figure>
    <dl class="listing-details">
      <dt>Τιμή</dt>
      <dd>{{cost}}</dd>
    </dl>
  </article>
</a>
{{/each}}
`);

window.onload = async function () {
  const url = window.location.href;

  if (url.includes("index.html")) {
    categories = await http.get("categories");
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
    const ads = await http.getMyServer(query);

    processAds(ads);

    let title = document.querySelector("title");
    title.innerHTML = subcategoryTitle;

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
    const subcategories = await http.get(
      `categories/${categoryId}/subcategories`
    );
    const query = `ads/category?id=${categoryId}`;
    const ads = await http.getMyServer(query);

    let title = document.querySelector("title");
    title.innerHTML = categoryTitle;

    let content = templates.category(ads);
    let div = document.querySelector(".listings");
    div.innerHTML = content;

    content = templates.filter(subcategories);
    div = document.querySelector(".filter");
    div.innerHTML = content;

    div = document.querySelector("h1");
    div.innerHTML = categoryTitle;

    document.querySelector("form").addEventListener("submit", submitForm);

    document.querySelectorAll(".heart").forEach((heart) => {
      if (heart.classList.contains("heart-empty")) {
        heart.addEventListener("click", async (event) => {
          setEmptyHeartListener(event);
        });
      } else {
        heart.addEventListener("click", async (event) => {
          setFullHeartListener(event);
        });
      }
    });

    // loading appropriate onclick event listeners for the filter radio buttons
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

  if (url.includes("/favorite-ads.html")) {
    username = new URLSearchParams(window.location.search).get("username");
    sessionId = new URLSearchParams(window.location.search).get("sessionId");
    const res = await http.getMyServer(
      `favourites?username=${username}&sessionId=${sessionId}`
    );

    let favourites = res.data;
    let content = templates.favourites(favourites);
    let div = document.querySelector(".listings");
    div.innerHTML = content;
  }
};

// filterFavourites: Used to display a full/empty
function filterFavourites(favourites) {
  const favouriteIds = favourites.map((favourite) => favourite.id);
  const emptyHeart = document.querySelectorAll(".heart-empty");
  const fullHeart = document.querySelectorAll(".heart-full");

  for (let i = 0; i < emptyHeart.length; ++i) {
    if (favouriteIds.includes(emptyHeart[i].dataset.index)) {
      emptyHeart[i].hidden = true;
      fullHeart[i].hidden = false;
    } else {
      emptyHeart[i].hidden = false;
      fullHeart[i].hidden = true;
    }
  }
}

// used when a user attempts to log-in, in the category page
async function submitForm() {
  event.preventDefault();
  const name = document.getElementById("username-txt").value;
  const password = document.getElementById("password-txt").value;
  username = name;
  const data = { username, password };
  const response = await http.postMyServer("login", data);
  sessionId = response.sessionId;
  // display message
  const message = document.getElementById("message");
  message.innerHTML = response.message;
  // add class to message, depending on status code
  const status = response.code == 200 ? "success" : "error";
  if (status == "success") {
    const form = document.querySelector(".login");
    form.hidden = true;
    const btn = document.getElementById("favourites-btn");
    btn.hidden = false;
    btn.href += `?username=${username}&sessionId=${sessionId}`;

    // fetching the ads in the category provided, in order to provide the heart pic accordingly
    const ads = response.data;
    filterFavourites(ads);
  }
  message.classList.add(status);

  // remove message after 3 seconds
  setTimeout(() => {
    message.innerHTML = "";
    message.classList.remove(status);
  }, 3000);
}

// called when adding an ad to a user's favourites
async function addFavourite(ad) {
  const data = { ad, username, sessionId };
  const res = await http.putMyServer("favourites", data);
  if (res.code == 200) {
    filterFavourites(res.data);
  }
  setTimeout(() => {
    alert(res.message);
  }, 10);
}

// called when removing an ad from a user's favourites
async function removeFavourite(ad) {
  const data = { ad, username, sessionId };
  const res = await http.deleteMyServer("favourites", data);
  if (res.code == 200) {
    filterFavourites(res.data);
  }
  setTimeout(() => {
    alert(res.message);
  }, 10);
}

// called to add onclick listeners to the empty heart images
async function setEmptyHeartListener(event) {
  const id = event.target.dataset.index;
  const title = event.target.parentElement.querySelector("h3").innerHTML;
  const description =
    event.target.parentElement.querySelector("figcaption").innerHTML;
  const cost = event.target.parentElement.querySelector("dd").innerHTML;
  const image_url = event.target.parentElement.querySelector("figure>img").src;
  const ad = { id, title, description, cost, image_url };
  await addFavourite(ad);
}

// called to add onclick listeners to the full heart images
async function setFullHeartListener(event) {
  const id = event.target.dataset.index;
  const title = event.target.parentElement.querySelector("h3").innerHTML;
  const description =
    event.target.parentElement.querySelector("figcaption").innerHTML;
  const cost = event.target.parentElement.querySelector("dd").innerHTML;
  const image_url = event.target.parentElement.querySelector("figure>img").src;
  const ad = { id, title, description, cost, image_url };
  await removeFavourite(ad);
}
