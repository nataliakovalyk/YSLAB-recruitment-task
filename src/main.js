import "./styles/styles.styl";

const pageEl = document.querySelector("#page");
const queryEl = document.querySelector("#search");

function fetchData(params) {
  const twoWeeks = 1000 * 60 * 60 * 24 * 14;
  const fromDate = new Date(new Date() - twoWeeks);
  let url = `https://content.guardianapis.com/search?&page=${
    params.page
  }&from-date=${fromDate.getYear() + 1900}-${fromDate.getMonth() +
    1}-${fromDate.getDate()}&api-key=b09ab458-40e6-4912-bbcb-f82cc0433cab`;
  if (params.query) url += `&q=${params.query}`;

  fetch(url)
    .then(resp => resp.json())
    .then(api => {
      const resultsEl = document.querySelector("#results");
      const cards = api.response.results.map(article => {
        const date = new Date(article.webPublicationDate);

        return `
          <div class="card">
            <div class="card-body">
              <div class="flex-container">
                <h5 class="card-name">${article.sectionName}</h5>
                <h5 class="card-date">${date.getDate()}.${date.getMonth() +
          1}.${date.getYear() + 1900}</h5>
              </div>
              <p class="card-text">${article.webTitle}</p>
              <a href="${
                article.webUrl
              }" class="button" target="_blank">Read more</a>
            </div>
          </div>`;
      });

      resultsEl.innerHTML = cards.join("");

      let options = "";
      for (let i = 1; i <= api.response.pages; i++) {
        options += `<option value="${i}" ${
          api.response.currentPage === i ? "selected" : ""
        }>${i}</option>`;
      }

      pageEl.innerHTML = options;
    });
}

fetchData({ page: 1 });

pageEl.addEventListener("change", event =>
  fetchData({ page: event.target.value, query: queryEl.value })
);

document.querySelector("#search-form").addEventListener("submit", event => {
  event.preventDefault();
  fetchData({ page: 1, query: queryEl.value });
});
