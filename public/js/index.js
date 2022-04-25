/* eslint-disable */

// TODO starting info
const port = 8000;
const host = '127.0.0.1';

// TODO showing alerts.
// type is 'success' or 'error'
const showAlert = (type, msg) => {
    hideAlert();
    const markup = `<div class="c-alert c-alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    setTimeout(hideAlert, 5000);
};
const hideAlert = () => {
    const el = document.querySelector('.c-alert');
    if (el) el.classList.add('hide');
    setTimeout(() => {
        if (el) el.parentElement.removeChild(el);
    }, 1000);
};

// TODO logging in.

const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `http://${host}:${port}/api/v1/users/login`,
            data: {
                email,
                password,
            },
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
};
const form = document.querySelector('.form__login');
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        login(email, password);
    });
}

// TODO logging out.
const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: `http://${host}:${port}/api/v1/users/logout`,
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Logged out successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }
    } catch (error) {
        showAlert(
            'error',
            'Error logging out! please try again or contact us!'
        );
    }
};

const logoutBtn = document.querySelector('.nav__el--logout');

if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}

// TODO sign up.

const signup = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `http://${host}:${port}/api/v1/users/signup`,
            data,
        });
        if (res.data.status === 'success') {
            showAlert('success', 'signed up successfully');
            window.setTimeout(() => {
                location.assign('/me');
            }, 4000);
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
};

const signupForm = document.querySelector('.form__signup');
if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const passwordConfirm =
            document.querySelector('#passwordConfirm').value;
        signup({ name, email, password, passwordConfirm });
    });
}

// TODO update settings

// type is 'password' or 'data'
const updateSettings = async (data, type) => {
    try {
        const url = type === 'password' ? 'updateMyPassword' : 'updateMe';
        const res = await axios({
            method: 'PATCH',
            url: `http://${host}:${port}/api/v1/users/${url}`,
            data,
        });
        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfuly`);
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
};

const userDataForm = document.querySelector('.form-user-data');

if (userDataForm) {
    userDataForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append(
            'phone_number',
            document.getElementById('phone_number').value
        );
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        updateSettings(form, 'data');
    });
}

const userSettingsForm = document.querySelector('.form-user-settings');

if (userSettingsForm) {
    userSettingsForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent =
            'Updating...';
        const pass = document.getElementById('password');
        const passCurr = document.getElementById('password-current');
        const passConf = document.getElementById('password-confirm');

        const password = pass.value;
        const passwordCurrent = passCurr.value;
        const passwordConfirm = passConf.value;
        await updateSettings(
            { passwordCurrent, password, passwordConfirm },
            'password'
        );

        pass.value = '';
        passCurr.value = '';
        passConf.value = '';
        document.querySelector('.btn--save-password').textContent =
            'save password ';
    });
}

const table = document.querySelector('.table-container');

if (table) {
    table.addEventListener('click', (e) => {
        const dataKind = e.target.getAttribute('data-kind');
        const dataClass = e.target.getAttribute('class');
        const dataId = e.target.getAttribute('data-id');
        const dataItem = e.target.getAttribute('data-item');
        if (dataKind == 'btn') {
            if (dataClass == 'delete_item_btn') {
                deleteItem(dataId, dataItem);
            }
            if (dataClass == 'edit_item_btn') {
                if (dataItem == 'product')
                    location.assign(`/edit_product/${dataId}`);
            }
            if (dataClass == 'show_item_btn') {
                if (dataItem == 'product')
                    location.assign(`/show_product/${dataId}`);
                if (dataItem == 'order')
                    location.assign(`/show_order/${dataId}`);
                if (dataItem == 'review')
                    location.assign(`/show_review/${dataId}`);
            }
        }
    });
}
const deleteItem = async (id, kind) => {
    try {
        const ans = confirm(
            `Are you sure that you what to delete this ${kind} ?`
        );
        if (ans) {
            const res = await axios({
                method: 'DELETE',
                url: `http://${host}:${port}/api/v1/${kind}s/${id}`,
            });
            if (res.status === 204) {
                showAlert('success', `${kind} deleted successfully`);
                window.setTimeout(() => {
                    location.assign(`/manage_${kind}s`);
                }, 1000);
            }
        }
    } catch (error) {
        showAlert('error', error);
    }
};

const formCreateProduct = document.querySelector('.form-create-product');

if (formCreateProduct) {
    formCreateProduct.addEventListener('submit', function (e) {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('product_name').value);
        form.append('category', document.getElementById('category').value);
        form.append('quality', document.getElementById('quality').value);
        form.append('price', document.getElementById('price').value);
        form.append('slug', document.getElementById('slug').value);
        form.append(
            'price_discount',
            document.getElementById('price_discount').value
        );
        form.append('weight', document.getElementById('weight').value);
        form.append('summary', document.getElementById('summary').value);
        if (document.getElementById('image').files[0])
            form.append('image', document.getElementById('image').files[0]);
        else form.append('image', 'default.jpg');
        createProduct(form);
    });
}

const createProduct = async (data) => {
    try {
        document.querySelector('.create_product_btn').textContent =
            'Creating...';
        const res = await axios({
            method: 'POST',
            url: `http://${host}:${port}/api/v1/products`,
            data,
        });
        if (res.data.status === 'success') {
            showAlert('success', `Product created successfuly`);
        }
        window.setTimeout(() => {
            location.assign(`/manage_products`);
        }, 1000);
    } catch (error) {
        document.querySelector('.create_product_btn').textContent =
            'Create Product';
        showAlert('error', error.response.data.message);
    }
};

const formEditProduct = document.querySelector('.form-edit-product');

if (formEditProduct) {
    formEditProduct.addEventListener('submit', function (e) {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('product_name').value);
        form.append('category', document.getElementById('category').value);
        form.append('quality', document.getElementById('quality').value);
        form.append('price', document.getElementById('price').value);
        form.append('slug', document.getElementById('slug').value);
        form.append(
            'price_discount',
            document.getElementById('price_discount').value
        );
        form.append('weight', document.getElementById('weight').value);
        form.append('summary', document.getElementById('summary').value);
        if (document.getElementById('image').files[0])
            form.append('image', document.getElementById('image').files[0]);
        editProduct(form);
    });
}

const editProduct = async (data) => {
    try {
        const id = document
            .querySelector('.edit_product_btn')
            .getAttribute('data-id');
        document.querySelector('.edit_product_btn').textContent = 'Updating...';
        const res = await axios({
            method: 'PATCH',
            url: `http://${host}:${port}/api/v1/products/${id}`,
            data,
        });
        if (res.data.status === 'success') {
            showAlert('success', `Product Updated successfuly`);
        }
        window.setTimeout(() => {
            location.assign(`/manage_products`);
        }, 1000);
    } catch (error) {
        document.querySelector('.edit_product_btn').textContent =
            'Update Product';
        showAlert('error', error.response.data.message);
    }
};

// Change Navbar Color in about page
const aboutPage = document.querySelector('#graay');
if (aboutPage) {
    document.querySelector('.navbar').style.backgroundColor = '#f8f6f3';
}

const getBestProducts = async function (container) {
    try {
        const res = await axios({
            method: 'GET',
            url: `http://${host}:${port}/api/v1/products/top-5-best-selling`,
        });
        const { data } = res.data;
        container.innerHTML = '';
        data.forEach((p) => {
            const html = `
                        <div class='col-lg-3 col-md-4 col-sm-6 col-12'>
                            <div class='main-product'>
                                <div class='productBestImg'>
                                    <img src='/img/products/${p.image}' alt=''>
                                </div>
                                <div class='productName'>
                                    <h2> ${p.name}</h2>
                                </div>
                                <div class='product-footer'>
                                    <a class="btn btn-2" href='/product' > Click here </a>
                                </div>
                            </div>
                        </div>`;
            container.insertAdjacentHTML('beforeEnd', html);
        });
    } catch (error) {
        howAlert('error', error.response.data.message);
    }
};
const bestSellingProductsContainer = document.querySelector('.best-seller-row');

if (bestSellingProductsContainer) {
    getBestProducts(bestSellingProductsContainer);
}

const accordion = document.getElementsByClassName('accordion');

if (accordion) {
    let i;
    for (i = 0; i < accordion.length; i++) {
        accordion[i].addEventListener('click', function () {
            /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
            this.classList.toggle('active');

            /* Toggle between hiding and showing the active panel */
            var panel = this.nextElementSibling;
            if (panel.style.display === 'block') {
                panel.style.display = 'none';
            } else {
                panel.style.display = 'block';
            }
        });
    }
}

const product_addIfon_btn = document.querySelector('#ad-info-btn');
if (product_addIfon_btn) {
    product_addIfon_btn.addEventListener('click', (e) => {
        openCity(e, 'ad-info');
    });
}
const product_reviews_btn = document.querySelector('#reviews-btn');
if (product_reviews_btn) {
    product_reviews_btn.addEventListener('click', (e) => {
        openCity(e, 'reviews');
    });
}
function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '');
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = 'block';
    evt.currentTarget.className += ' active';
}

const cartPushForm = document.querySelector('.formToCart');
if (cartPushForm) {
    cartPushForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.querySelector('#nameOfCart').value;
        const price = document.querySelector('#priceOfCart').value;
        const img = document.querySelector('#imgOfCart').value;
        const count = document.querySelector('#count').value;
        const addToCartHtml = `
            <div class="addToCartMessage">
                <div class="row">
                    <div class="col-10 addToCartMessage-left">
                        <i class="icofont-ui-check c-main"></i>
                        " ${name}" has been added to your cart 
                    </div>
                    <div class="col-2">
                        <button class="btn-2"> 
                            <a href="/cart" > view cart </a>
                        </button>
                    </div>
                </div>
            </div>`;
        document
            .querySelector('.product-section .container')
            .insertAdjacentHTML('afterbegin', addToCartHtml);
        setTimeout(() => {
            document.querySelector('.addToCartMessage').remove();
        } , 3000)
        // Check if cart is empty
        if (localStorage.getItem('cart')) {
            let cart = JSON.parse(localStorage.getItem('cart'));
            let b = 0;
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].name == name) {
                    cart[i].count = +cart[i].count + +count;
                    b = 1;
                }
            }
            if (b == 0) cart.push({ name, price, img, count });
            localStorage.setItem('cart', JSON.stringify(cart));
        } else {
            let cart = [{ name, price, img, count }];
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        modifyCartNumber();
    });
}

const displayCartPage = document.querySelector('#page_cart');
if (displayCartPage) {
    const c = JSON.parse(localStorage.getItem('cart'));
    if (c && c.length) {
        const productsContainer = document.querySelector('.products-container');
        productsContainer.innerHTML = '';
        let ps = '';
        const cart = JSON.parse(localStorage.getItem('cart'));
        let total = 0;
        const subtotals = [];
        for (let i = 0; i < cart.length; i++) {
            let subtotal = cart[i].count * cart[i].price;
            subtotals.push(subtotal);
            total += subtotal;
            ps += `
            <tr>
                    <td>
                        <button>
                            <i class="icofont-close removeOfCart" data-remove="ROC~${i}"></i>
                        </button>
                        </td>
                    <td> 
                        <img src="/img/products/${cart[i].img}" alt="product image">
                    </td>
                    <td>${cart[i].name}</td>
                    <td>${cart[i].price} EGP</td>
                    <td>
                    <input class="countCart" type="number" name="count"  min="1" value="${cart[i].count}">
                        </td>
                    <td>${subtotal} EGP</td>
                </tr>`;
        }
        const aHtml = `
                <div class="table-container">
                <table>
                        <thead>
                            <tr>
                                <th>  </th>
                                <th>  </th>
                                <th> Product </th>
                                <th> Price </th>
                                <th> Quantity </th>
                                <th> Subtotal </th>
                                </tr>
                        </thead>
                        <tbody>
                        ${ps}
                        </tbody>
                        <tfoot> 
                            <tr>
                                <td colspan="5"> 
                                <form class="couponForm">
                                        <input name="code" type="text" placeholder="Coupon code">
                                        <input class="btn-2" name"submit" type="submit" value="Apply coupon">
                                        </form>
                                </td> 
                                <td> 
                                <button class="btn-2 updateOFCart"> Update cart</button>
                                </td> 
                            </tr>
                            </tfoot> 
                    <table>
                    </div>
        `;
        const bHtml = `
        <div class="row">
                <div class="col-6">
                
                </div>
                <div class="table-container col-6">
                    <table>
                    <thead>
                            <tr>
                            <th> Cart totals </th>
                                <th>  </th>
                                <th>  </th>
                            </tr>
                            </thead>
                        <tbody>
                        <tr>
                                <td> Subtotal</td>
                                <td colspan="2"> ${total} EGP</td>
                            </tr>
                            <tr>
                                <td> Shipping</td>
                                <td> Free Shipping in Cairo</td>
                                </tr>
                            <tr>
                            <td> Total</td>
                                <td> ${total} EGP</td>
                            </tr>
                        </tbody>
                        <tfoot> 
                            <tr>
                            <td colspan="2" class="proceedToCheckout-btn"> 
                                    <button class="btn-2"> 
                                    <a href="/checkout"> Proceed to checkout</a>
                                    </button> 
                                    </td>
                            </tr>
                            </tfoot> 
                    <table>
                    </div>
            </div>
            `;
        productsContainer.insertAdjacentHTML('afterbegin', bHtml);
        productsContainer.insertAdjacentHTML('afterbegin', aHtml);
    }
    document
        .querySelector('.products-container')
        .addEventListener('click', (e) => {
            if (e.target.classList.contains('removeOfCart')) {
                const index = e.target.getAttribute('data-remove').slice(-1);
                const cart = JSON.parse(localStorage.getItem('cart'));
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                setTimeout(() => {
                    location.reload();
                }, 500);
            }
            if (e.target.classList.contains('updateOFCart')) {
                const cart = JSON.parse(localStorage.getItem('cart'));
                const counts = [...document.querySelectorAll('.countCart')];
                for (let i = 0; i < cart.length; i++) {
                    cart[i].count = counts[i].value;
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                setTimeout(() => {
                    location.reload();
                }, 500);
            }
        });
}
const modifyCartNumber = function () {
    const cartValue = document.querySelector('.cartValue');
    if (localStorage.getItem('cart') == '')
        cartValue.innerHTML = 0;
    else
        cartValue.innerHTML = JSON.parse(localStorage.getItem('cart')).length || 0;
};
modifyCartNumber();

const displayCheckoutPage = document.querySelector('#page_checkout');
if (displayCheckoutPage) {
    const placeOrderBtn = document.querySelector('.btn-place-order');
    const products = JSON.parse(localStorage.getItem('cart'));
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', (e) => {
            const name = document.querySelector('#userName');
            if (checkIfIt_is_there(name, 'name')) return;
            const email = document.querySelector('#userEmail');
            if (checkIfIt_is_there(email, 'email')) return;
            const phone = document.querySelector('#userPhone');
            if (checkIfIt_is_there(phone, 'phone')) return;
            const state = document.querySelector('#userState');
            if (checkIfIt_is_there(state, 'state')) return;
            const city = document.querySelector('#userCity');
            if (checkIfIt_is_there(city, 'city')) return;
            const addInfo = document.querySelector('#userNotes');
            sendOrder(placeOrderBtn, {
                name: name.value,
                email: email.value,
                phone: phone.value,
                state: state.value,
                city: city.value,
                addInfo: addInfo.value,
                products,
            });
        });
    } 
    if (products){
        const tbody = document.querySelector('#tableBody');
        let h = '';
        for ( let i = 0 ; i < products.length ; i++ ) {
            h += `
                <tr>
                    <td>subtotal</td>
                    <td>${products[i].price * products[i].count}</td>
                </tr>
            `;
        }
        tbody.insertAdjacentHTML("afterbegin", h);
    }
}

const sendOrder = async (btn, data) => {
    try {
        btn.textContent = 'Sending...';
        const res = await axios({
            method: 'POST',
            url: `http://${host}:${port}/api/v1/orders`,
            data,
        });
        if (res.data.status === 'success') {
            showAlert('success', `Order send out successfuly`);
        }
        window.setTimeout(() => {
            location.assign(`/`);
        }, 3000);
        localStorage.setItem('cart' , '');
    } catch (error) {
        btn.textContent =
            'Place order';
        showAlert('error', error.response.data.message);
    }
};

const checkIfIt_is_there = (el, a) => {
    if (el.value == '') {
        document.querySelector('.orderMessageContainer').innerHTML =
            '<span class="alert alert-danger">' +
            el.name +
            ' is empty pleace fill it' +
            '</span>';
        setTimeout(() => {
            document.querySelector('.orderMessageContainer').innerHTML =
                'Billing details';
        }, 2000);
        return 1;
    } else return 0;
};

const displayProductPage = document.querySelector('#product_page');
if (displayProductPage){
    const ratingBar = document.querySelector('#rating_bar');
    if (ratingBar){
        ratingBar.addEventListener('click' , e => {
            const stars = [...document.querySelectorAll('.star')];
            if (e.target.id.startsWith('rate')){
                const index = e.target.id.slice(-1);
                document.querySelector('#userRating').value = index;
                for (let i = 0; i < 5; i++) {
                    stars[i].classList.remove('cs');
                }
                for (let i = 0; i < index; i++) {
                    stars[i].classList.add('cs');
                }
            }
            // if (e.target.id)
        })
    }
    const addReviewBtn = document.querySelector('#addReview-btn');
    if (addReviewBtn) {
        addReviewBtn.addEventListener('click' , e => {
            e.preventDefault();
            const name = document.querySelector('#userName').value;
            const email = document.querySelector('#userEmail').value;
            const rating = document.querySelector('#userRating').value;
            const review = document.querySelector('#userReview').value;
            const product = document.querySelector('#getIID').value;
            console.log(name);
            console.log(email);
            console.log(rating);
            console.log(review);
            sendReview(addReviewBtn, {
                publisher: name,
                publisher_email: email,
                rating,
                review,
                product,
            });
        });
    }
}


const sendReview = async (btn, data) => {
    try {
        btn.textContent = 'Sending...';
        const res = await axios({
            method: 'POST',
            url: `http://${host}:${port}/api/v1/reviews`,
            data,
        });
        if (res.data.status === 'success') {
            showAlert('success', `Review submited successfuly`);
        }
        window.setTimeout(() => {
            location.reload();
        }, 1000);
    } catch (error) {
        btn.textContent = 'Submit';
        showAlert('error', error.response.data.message);
    }
};