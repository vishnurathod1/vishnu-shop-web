 // Get product ID from URL
    const params = new URLSearchParams(window.location.search);
    const CategoryId = params.get("id");

    // Fetch all items from localStorage
    const allcategories = JSON.parse(localStorage.getItem("allcategories") || "[]");
    const Category = allcategories.find(item => Category.id == CategoryId);

    if (Category) {
      document.getElementById("categoryDetails").innerHTML = `
        <div class="card p-3">
          <img src="${Category.img}" alt="${Category.name}" class="mb-3" width="200">
          <h2>${product.name}</h2>
          <p><strong>Price:</strong> ₹${product.price}</p>
          <p><strong>Rating:</strong> ⭐ ${product.rating}</p>
          <p><strong>Category:</strong> ${product.section}</p>
          <p>${product.description || "No description available."}</p>
          <button class="btn btn-success" onclick="addToCart('${product.name}', ${product.price}, '${product.img}', '${product.section}')">
            🛒 Add to Cart
          </button>
        </div>
      `;
    } else {
      document.getElementById("categoryDetails").innerHTML = `<p>Product not found.</p>`;
    }
