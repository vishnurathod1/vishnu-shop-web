function handleSearch() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const resultContainer = document.getElementById("searchResults");
  resultContainer.innerHTML = "";

  if (!query.trim()) return;

  const allMenuproducts = JSON.parse(localStorage.getItem("allMenuproducts") || "[]");
  const filteredproducts = allproduts.filter(product => product.name.toLowerCase().includes(query));

  if (filteredItems.length > 0) {
  filteredItems.forEach(product => {
    resultContainer.innerHTML += `
      <div class="search-result-card d-flex align-items-center">
        <img src="${item.img}" width="80" height="80" class="mr-3 rounded">
        <div>
          <h5>${product.name}</h5>
          <p>₹${product.price}</p>
          <p>⭐ ${product.rating}</p>
          <small>${product.section}</small>
        </div>
        <button class="btn btn-sm btn-success ml-auto"
  onclick="addToCart('${product.name}', ${product.price}, '${product.img}', '${product.section}')">
  Add
</button>

      </div>
    `;
  });
} else {
  resultContainer.innerHTML = <div class="alert alert-warning">No matching products found.</div>;
}

}



