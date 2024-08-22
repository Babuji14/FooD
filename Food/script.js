document.addEventListener("DOMContentLoaded", () => {
    
    // Scroll functionality for Veg and Non-Veg sections
    const scrollRowVeg = document.getElementById('scroll-row');
    const leftArrowVeg = document.getElementById('left-arrow');
    const rightArrowVeg = document.getElementById('right-arrow');

    const scrollRowNonVeg = document.getElementById('scroll-row-nonveg');
    const leftArrowNonVeg = document.getElementById('left');
    const rightArrowNonVeg = document.getElementById('right');

    let activeScrollContainer = scrollRowVeg;

    // Event listeners for Veg section scrolling
    rightArrowVeg.addEventListener('click', () => {
        scrollRowVeg.scrollBy({ left: 300, behavior: 'smooth' });
        activeScrollContainer = scrollRowVeg;
    });

    leftArrowVeg.addEventListener('click', () => {
        scrollRowVeg.scrollBy({ left: -300, behavior: 'smooth' });
        activeScrollContainer = scrollRowVeg;
    });

    // Event listeners for Non-Veg section scrolling
    rightArrowNonVeg.addEventListener('click', () => {
        scrollRowNonVeg.scrollBy({ left: 300, behavior: 'smooth' });
        activeScrollContainer = scrollRowNonVeg;
    });

    leftArrowNonVeg.addEventListener('click', () => {
        scrollRowNonVeg.scrollBy({ left: -300, behavior: 'smooth' });
        activeScrollContainer = scrollRowNonVeg;
    });

    // Keyboard arrow key event listener
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            activeScrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
        } else if (event.key === 'ArrowLeft') {
            activeScrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
        }
    });

    // Switch active scroll container based on mouse hover
    scrollRowVeg.addEventListener('mouseenter', () => {
        activeScrollContainer = scrollRowVeg;
    });

    scrollRowNonVeg.addEventListener('mouseenter', () => {
        activeScrollContainer = scrollRowNonVeg;
    });

    // Enable horizontal scrolling using the mouse wheel in both sections
    scrollRowVeg.addEventListener('wheel', (event) => {
        event.preventDefault();
        scrollRowVeg.scrollBy({ left: event.deltaY > 0 ? 300 : -300, behavior: 'smooth' });
    });

    scrollRowNonVeg.addEventListener('wheel', (event) => {
        event.preventDefault();
        scrollRowNonVeg.scrollBy({ left: event.deltaY > 0 ? 300 : -300, behavior: 'smooth' });
    });

    // Add hover effect to team members
    document.querySelectorAll('.team-member').forEach(member => {
        member.addEventListener('mouseover', () => {
            member.style.transform = 'scale(1.05)';
            member.style.transition = '0.3s';
        });

        member.addEventListener('mouseout', () => {
            member.style.transform = 'scale(1)';
        });
    });
     
    loadFood();
});

const btncart = document.querySelector('#cart-icon');
const cart = document.querySelector('.carts');
const btnClose = document.querySelector('#cart-close');
const cartCountElement = document.querySelector('.cart-count'); // Select cart count element

btncart.addEventListener('click', () => {
    cart.classList.add('cart-active');
});

btnClose.addEventListener('click', () => {
    cart.classList.remove('cart-active');
});

let itemList = [];

function loadFood() {
    loadContent();
}

function loadContent() {
    //Remove Food Items From Cart
    let btnRemove = document.querySelectorAll('.fa-trash');
    btnRemove.forEach((btn) => {
        btn.addEventListener('click', removeItem);
    });

    //Product Item Change Event
    let qtyElements = document.querySelectorAll('.cart-quantity');
    qtyElements.forEach((input) => {
        input.addEventListener('change', changeQty);
    });

    //Product Cart
    let cartBtns = document.querySelectorAll('.cart');
    cartBtns.forEach(btn => {
        btn.addEventListener('click', addCart);
    });
}

// Remove Items
function removeItem() {
    if (confirm("Are You Sure to Remove")) {
        let title = this.parentElement.querySelector('.cart-food-title').innerHTML;
        itemList = itemList.filter(el => el.foodTitle != title);
        this.parentElement.remove();
        updateCartCount();  // Update cart count after removal
        updateCartTotal();  // Update the total price
    }
}

// Change Quantity
function changeQty() {
    if (isNaN(this.value) || this.value < 1) {
        this.value = 1;
    }

    const cartBox = this.closest('.cart-box');
    const priceElement = cartBox.querySelector('.cart-price');
    const amtElement = cartBox.querySelector('.cart-amt');

    const price = parseFloat(priceElement.innerText.replace('$', ''));
    const quantity = parseInt(this.value);

    // Update the amount for the individual item
    amtElement.innerText = `$${(price * quantity).toFixed(2)}`;

    updateCartTotal(); // Update the total price
}

// Add to Cart
function addCart() {
    let food = this.closest('.scroll-column');
    let foodTitle = food.querySelector('.food-title').innerText;
    let foodPrice = food.querySelector('.food-price').innerText;
    let foodImgSrc = food.querySelector('.food-img').src;

    // Check if the product is already in the cart
    if (itemList.find((el) => el.foodTitle === foodTitle)) {
        alert("Product Already Added In Cart");
        return;
    }

    // Add new item to the cart
    let newProduct = { foodTitle, foodPrice, foodImgSrc };
    itemList.push(newProduct);

    let newProductElement = createCartProduct(foodTitle, foodPrice, foodImgSrc);
    let cartBasket = document.querySelector('.cart-content');
    cartBasket.insertAdjacentHTML('beforeend', newProductElement);

    updateCartCount();  // Update the cart count after adding
    updateCartTotal();  // Update the total price
    loadContent(); // Reload event listeners after adding a new item
}

// Create Cart Product Element
function createCartProduct(foodTitle, foodPrice, foodImgSrc) {
    return `
    <div class="cart-box">
        <img src="${foodImgSrc}" alt="${foodTitle}" class="cart-img">
        <div class="detail-box">
            <div class="cart-food-title">${foodTitle}</div>
            <div class="price-box">
                <div class="cart-price">${foodPrice}</div>
                <div class="cart-amt">${foodPrice}</div>
            </div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <i class="fa-solid fa-trash" name="trash"></i>
    </div>
    `;
}

// Update Cart Total
function updateCartTotal() {
    const cartBoxes = document.querySelectorAll('.cart-box');
    let total = 0;

    cartBoxes.forEach(cartBox => {
        const priceElement = cartBox.querySelector('.cart-price');
        const quantityElement = cartBox.querySelector('.cart-quantity');
        const price = parseFloat(priceElement.innerText.replace('$', ''));
        const quantity = parseInt(quantityElement.value);
        total += price * quantity;
    });

    document.querySelector('.total-price').innerText = `$${total.toFixed(2)}`;
}

// Update Cart Count
function updateCartCount() {
    cartCountElement.innerText = itemList.length; // Update cart count to reflect the number of items
}
