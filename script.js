// Initialize Swiper after the page and Swiper script load
window.addEventListener('load', () => {
  if (typeof Swiper !== 'undefined') {
    new Swiper('.mySwiper', {
      loop: true,
      navigation: {
        nextEl: '#next',
        prevEl: '#prev',
      },
    });
  }
});

    const cartIcon = document.querySelector(".cart-icon");
    const cartTab = document.querySelector(".cart-tab");
    const closeBtn = document.querySelector(".close-btn");
    const cardList = document.querySelector(".card-list");
    const cartList = document.querySelector(".cart-list");
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-navlist');
    

    cartIcon.addEventListener("click", () => {
      cartTab.classList.toggle("cart-tab-active");
    });

    // Mobile hamburger toggle
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        mobileNav.classList.toggle('mobile-navlist-active');
        document.body.classList.toggle('menu-open', mobileNav.classList.contains('mobile-navlist-active'));
      });

      // Close mobile nav on window resize to desktop
      window.addEventListener('resize', () => {
        if (window.innerWidth > 780) {
          mobileNav.classList.remove('mobile-navlist-active');
          document.body.classList.remove('menu-open');
        }
      });

      // Close mobile nav and allow smooth scroll on link click
      mobileNav.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) {
          mobileNav.classList.remove('mobile-navlist-active');
          document.body.classList.remove('menu-open');
        }
      });
    }

    closeBtn.addEventListener("click", () => {
      cartTab.classList.remove("cart-tab-active");
    });

    let productList = [];
    let cartProducts = [];

    const showCards = () => {
      const addToCart = (product) => {
        const existingProduct = cartProducts.find((item) => item.id === product.id);
        if (existingProduct) {
          alert('Product already in cart');
          return;
        }

        const cartItem = document.createElement('div');
        cartItem.classList.add('item');

        let quantity = 1;
        const cartProduct = { ...product, quantity };
        cartProducts.push(cartProduct);

        cartItem.innerHTML = `
        <div class="item-image">
            <img src="${product.image}">
        </div>
          <div class="detail">
             <h4>${product.name}</h4>
                <h4 class="item-total">${product.price}</h4>
          </div>
            <div class="flex">
              <a href="#" class="quantity-btn minus">
                <i class="fa-solid fa-minus"></i>
              </a>
                <h4 class="quantity-value">${quantity}</h4>
                  <a href="#" class="quantity-btn plus">
                    <i class="fa-solid fa-plus"></i>
                  </a>
          </div>
        `;

        cartList.appendChild(cartItem);

        const parsePrice = (priceStr) => parseFloat(String(priceStr).replace(/[^0-9.-]+/g, '')) || 0;

        const updateTotals = () => {
          const cartTotalEl = document.querySelector('.cart-total');
          const cartValueEl = document.querySelector('.cart-value');
          const total = cartProducts.reduce((sum, p) => sum + parsePrice(p.price) * (p.quantity || 0), 0);
          const count = cartProducts.reduce((sum, p) => sum + (p.quantity || 0), 0);
          if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;
          if (cartValueEl) cartValueEl.textContent = count;
        };

        const plusBtn = cartItem.querySelector('.plus');
        const minusBtn = cartItem.querySelector('.minus');
        const quantityValueEl = cartItem.querySelector('.quantity-value');
        const itemTotalEl = cartItem.querySelector('.item-total');

        if (plusBtn) {
          plusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cartProduct.quantity++;
            if (quantityValueEl) quantityValueEl.textContent = cartProduct.quantity;
            if (itemTotalEl) itemTotalEl.textContent = product.price;
            updateTotals();
          });
        }

        if (minusBtn) {
          minusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (cartProduct.quantity > 1) {
              cartProduct.quantity--;
              if (quantityValueEl) quantityValueEl.textContent = cartProduct.quantity;
              if (itemTotalEl) itemTotalEl.textContent = product.price;
              updateTotals();
            } else {
              // remove item
              const idx = cartProducts.findIndex((p) => p.id === cartProduct.id);
              if (idx > -1) cartProducts.splice(idx, 1);
              cartItem.remove();
              updateTotals();
            }
          });
        }

        updateTotals();
      }

      productList.forEach((product) => {
        const { id, name, price, image } = product;
        const orderCard = document.createElement("div");
        orderCard.classList.add("order-card");
        orderCard.innerHTML = `
          <img src="${image}" alt="${name}" class="card-image">
          <h3 class="card-name">${name}</h3>
          <p class="card-price">${price}</p>
          <a href="#" class="btn card-btn" id="$id">Add to Cart</a>
        `;
        cardList.appendChild(orderCard);

        const cardBtn = orderCard.querySelector(".card-btn");
        cardBtn.addEventListener("click", (e) => {
          e.preventDefault();
          addToCart(product);
        });
      });
    }

    const initApp = () => {
      fetch("product.json").then((response) => response.json()).then((data) => {
        productList = data;
        showCards();
      }
      )};

    initApp();