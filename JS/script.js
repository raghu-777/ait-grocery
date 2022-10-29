
// Opening and CLosing Login Form 


const openFormBtn = document.querySelector('#show-login');
const pwdReset = document.getElementById('pwdReset');
const closeFormBtn = document.querySelector('.close-btn'); //Closing Button on Login Page
const openRegPage = document.querySelector('#registerPage'); //Disappear Login Page When Open Registration Page
const closeRegForm = document.querySelector('.form-header button');
const closeResetForm = document.querySelector('.reset-header button');

function openForm() {
    document.querySelector('#loginForm').style.display = 'block';
    document.getElementById('cartPage').style.display = "none";
    
}
openFormBtn.addEventListener('click', openForm);


closeRegForm.addEventListener('click',() => {
    document.getElementById('registraion-form').style.display = "none";
})


function closeForm() {
    document.querySelector('#loginForm').style.display = 'none';
    document.getElementById('btn').style.display = "block";
    checkEmail.value = "";
    checkPwd.value = "";
    emailError.innerHTML = "";
    pwdError.innerHTML = "";
    clearSignUpForm();
}

closeFormBtn.addEventListener('click', closeForm);
openRegPage.addEventListener('click', () => {
    document.getElementById('registraion-form').style.display = "block";
    document.getElementById('resetPassword').style.display = 'none';
    document.querySelector('#loginForm').style.display = 'none';
    document.getElementById('btn').style.display = "block";
    document.getElementById('name').style.display = "block";
    document.getElementById('email').style.display = "block";
    document.getElementById('reset-email').style.display = "none";
    document.querySelector('#registraion-form h5').innerHTML = "REGISTRATION FORM";
    checkEmail.value = "";
    checkPwd.value = "";
    emailError.innerHTML = "";
    pwdError.innerHTML = "";
    clearSignUpForm();
});

pwdReset.addEventListener('click', () => {
    document.getElementById('resetPassword').style.display = 'block';
    document.querySelector('#loginForm').style.display = 'none';
    document.getElementById('registraion-form').style.display = "none";
});

closeResetForm.addEventListener('click', () => {
    document.getElementById('resetPassword').style.display = 'none';
})


//Ending Code of Opening and CLosing Login Form


// Add to Cart Code 
// Opening and Closing Cart Block 
const closeCartBtn = document.querySelector('.close-cart-btn');
const openCartBtn = document.querySelector('.cart-open-btn');
const cartIcon = document.querySelector('#result');

function openCart() {
    document.getElementById('cartPage').style.display = "block";
    document.querySelector('#loginForm').style.display = 'none';
}

openCartBtn.addEventListener('click', openCart);

function closeCart() {
    document.getElementById('cartPage').style.display = "none";
}

closeCartBtn.addEventListener('click', closeCart);

// Ending of Opening and Closing Cart Block 

//Object to Store User Entered Data Tempararily
let userDetails = new Object();
userDetails.Name = "";
userDetails.Email = "";
userDetails.Password = "";


//Cart Logic

class CartItem {
    constructor(name, img, price) {
        this.name = name
        this.img = img
        this.price = price
        this.quantity = 1
    }
}

class LocalCart {
    static key = "cartItems"

    static getLocalCartItems() {
        let cartMap = new Map()
        const cart = localStorage.getItem(LocalCart.key)
        if (cart === null || cart.length === 0) return cartMap
        return new Map(Object.entries(JSON.parse(cart)))
    }

    static addItemToLocalCart(id, item) {
        let cart = LocalCart.getLocalCartItems()
        if (cart.has(id)) {
            let mapItem = cart.get(id)
            mapItem.quantity += 1
            cart.set(id, mapItem)
        }
        else
            cart.set(id, item)
        localStorage.setItem(LocalCart.key, JSON.stringify(Object.fromEntries(cart)))
        updateCartUI()

    }

    static removeItemFromCart(id) {
        let cart = LocalCart.getLocalCartItems()
        if (cart.has(id)) {
            let mapItem = cart.get(id)
            if (mapItem.quantity > 1) {
                mapItem.quantity -= 1
                cart.set(id, mapItem)
            }
            else
                cart.delete(id)
        }
        if (cart.length === 0)
            localStorage.clear()
        else
            localStorage.setItem(LocalCart.key, JSON.stringify(Object.fromEntries(cart)))
        updateCartUI()
    }
}

const wholeCartWindow = document.querySelector('.cart-wrapper')
wholeCartWindow.inWindow = 0
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn')
addToCartBtns.forEach((btn) => {
    btn.addEventListener('click', addItemFunction)
})

function addItemFunction(e) {
        const id = e.target.parentElement.parentElement.getAttribute('data-id');
        const img = e.target.parentElement.previousElementSibling.src;
        const name = e.target.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        let price = e.target.previousElementSibling.previousElementSibling.textContent;
        price = price.replace('4.99/- -  ', '');
        price = price.replace('/-', '');
        const item = new CartItem(name, img, price)
        LocalCart.addItemToLocalCart(id, item)
}

function updateCartUI() {
    const cartWrapper = document.querySelector('.cart-wrapper')
    cartWrapper.innerHTML = ""
    const items = LocalCart.getLocalCartItems()
    if (items === null) return
    let count = 0
    let total = 0
    for (const [key, value] of items.entries()) {
        const cartItem = document.createElement('div')
        cartItem.classList.add('cart-item')
        let price = value.price * value.quantity
        price = Math.round(price * 100) / 100
        count += 1
        total += price
        total = Math.round(total * 100) / 100
        cartItem.innerHTML =
            `
        <div><img src="${value.img}" alt=""></div>
            <div class="title-price">
                <h6>${value.name}</h6>
                <p><i class="fa-solid fa-indian-rupee-sign"></i> ${price}</p>
            </div>
            <div class="quantity">
                <h6>Quantity</h6>
                <span>${value.quantity}</span>
            </div>
            <div class="cancel"><i class="fa-solid fa-trash"></i></div>
        `
        cartItem.lastElementChild.addEventListener('click', () => {
            LocalCart.removeItemFromCart(key)
        })
        cartWrapper.appendChild(cartItem)
    }

    if (count > 0) {
        cartIcon.classList.add('non-empty');
        const resultIcon = document.getElementById('result');
        resultIcon.style.display = "block";
        resultIcon.innerHTML = count;
        const subtotal = document.querySelector('.subtotal');
        subtotal.innerHTML =
            `
        (${count} items) : <i class="fa-solid fa-indian-rupee-sign"></i> ${total}
        `
    } else {
        cartIcon.classList.remove('non-empty');
        const resultIcon = document.getElementById('result');
        resultIcon.style.display = "none";
        resultIcon.innerHTML = 0;
        const subtotal = document.querySelector('.subtotal');
        subtotal.innerHTML =
            `
        (${count} items) : <i class="fa-solid fa-indian-rupee-sign"></i> ${total}
        `
        const emptyMsg = document.createElement('div');
        emptyMsg.classList.add('empty-msg');
        emptyMsg.innerHTML = "Cart is Empty <i class='fa-regular fa-face-frown-open'></i>";
        cartWrapper.append(emptyMsg);
    }
}
document.addEventListener('DOMContentLoaded', () => { updateCartUI() })


//End Of Add to Cart Code Section


// Form Validation 

const Name = document.getElementById('name-value')
const Email = document.getElementById('email-value');
const Password = document.getElementById('pwd-value');
const confirmPassword = document.getElementById('pwd-confirm');

const nameErrorLogo = document.getElementById('nameField');
const emailErrorLogo = document.getElementById('emailField');
const pwdErrorLogo = document.getElementById('pwdField');
const pwdConfirmErrorLogo = document.getElementById('pwdConfirmField');

const pwdShowButton = document.getElementById('pwdShow');
const pwdConfirmShowButton = document.getElementById('pwdConfirmShow');

const submitButton = document.getElementById('btn');


//Name Field Check Function

function nameCheck() {
    let nameValue = Name.value;
    nameValue = nameValue.trim();

    if (!nameValue.match(/^[A-Za-z]{3,}\s?[a-zA-z]*\s?[a-zA-Z]*\s?[a-zA-Z]*\s?[a-zA-Z]*\s?[a-zA-Z]*$/) || nameValue.length == 0) {
        nameErrorLogo.innerHTML = "<i class='fa-solid fa-circle-exclamation'></i>";
        document.getElementById('nameError').innerHTML = "Enter Your Name";
        document.getElementById('nameError').style.color = "red";
        Name.style.border = "2px solid red";
        submitButton.disabled = true;
        submitButton.style.backgroundColor = "#b68978";
        submitButton.style.color = "#dba9a9";
        return false;
    }

    nameErrorLogo.innerHTML = "<i class='fa-solid fa-circle-check'></i>";
    document.getElementById('nameError').innerHTML = "";
    Name.style.border = "2px solid green";
    submitButton.disabled = false;
    submitButton.style.backgroundColor = "orangered";
    submitButton.style.color = "white";
    return true;
}

Name.addEventListener('keyup', nameCheck);
Name.addEventListener('blur', nameCheck);

//Email Field Check Function

function emailCheck() {
    let emailValue = Email.value;
    emailValue = emailValue.trim();

    if (!emailValue.match(/^[A-Z]+[0-9]*[\._\-]?[A-Za-z0-9]@(gmail|yahoo|outlook|protonmail|aol|icloud|gmx|tcs)\.(com|org|co.in|net|in)$/i) || emailValue.length == 0) {
        emailErrorLogo.innerHTML = "<i class='fa-solid fa-circle-exclamation'></i>";
        document.getElementById('emailError').innerHTML = "Enter Valid Email";
        document.getElementById('emailError').style.color = "red";
        Email.style.border = "2px solid red";
        submitButton.disabled = true;
        submitButton.style.backgroundColor = "#b68978";
        submitButton.style.color = "#dba9a9";
        return false;
    }

    emailErrorLogo.innerHTML = "<i class='fa-solid fa-circle-check'></i>";
    document.getElementById('emailError').innerHTML = "";
    Email.style.border = "2px solid green";
    submitButton.disabled = false;
    submitButton.style.backgroundColor = "orangered";
    submitButton.style.color = "white";
    return true;

}

Email.addEventListener('keyup', emailCheck);
Email.addEventListener('blur', emailCheck);


//Password Field Check Function

const passwordButton = document.querySelectorAll("#password #pwdShow .fa-solid");

const passwordContains = document.querySelectorAll('#password #pwdRules span');

function passwordError() {
    pwdErrorLogo.innerHTML = "<i class='fa-solid fa-circle-exclamation'></i>";
    document.getElementById('pwdError').style.color = "red";
    Password.style.border = "2px solid red";
    submitButton.disabled = true;
    submitButton.style.backgroundColor = "#b68978";
    submitButton.style.color = "#dba9a9";
    confirmPassword.disabled = true;
}


function pwdCheck() {
    let pwdValue = Password.value;
    pwdValue = pwdValue.trim();
    if (pwdValue.length == 0) {
        passwordError();
        passwordButton[0].style.visibility = "hidden";
        document.getElementById('pwdError').innerHTML = "Enter Password";
        document.getElementById('pwdRules').style.display = "none";
        confirmPassword.style.border = "2px solid red";
        return false;
    }

    if (pwdValue.length != 0) {
        passwordButton[0].style.visibility = "visible";
        document.getElementById('pwdRules').style.display = "block";
        passwordContains[0].style.display = "block";
        passwordContains[1].style.display = "block";
        passwordContains[2].style.display = "block";
        passwordContains[3].style.display = "block";
        passwordContains[4].style.display = "block";
    }

    if (pwdValue.length >= 8) {
        passwordContains[0].style.display = "none";

    }


    if (!pwdValue.match(/^[\w\@\#\$\%\&\_]{8,}\s{0}$/)) {
        passwordError();
        document.getElementById('pwdError').innerHTML = "Password Not Valid";
        passwordButton[0].style.visibility = "visible";
        return false;
    }

    if (pwdValue.match(/^[^A-Z]+$/)) {
        passwordError();
        return false;

    } else {
        passwordContains[1].style.display = "none";
    }

    if (pwdValue.match(/^[^a-z]+$/)) {
        passwordError();
        return false;

    } else {
        passwordContains[2].style.display = "none";
    }

    if (pwdValue.match(/^[^0-9]+$/)) {
        passwordError();
        return false;

    } else {
        passwordContains[3].style.display = "none";
    }

    if (pwdValue.match(/^[^\@\#\$\%\&|_]+$/)) {
        passwordError();
        return false;

    } else {
        passwordContains[4].style.display = "none";
    }

    if (pwdValue.match(/^[^\s]{0}$/)) {
        passwordError();
        return false;

    } else {
        passwordContains[5].style.display = "none";
    }


    pwdErrorLogo.innerHTML = "<i class='fa-solid fa-circle-check'></i>";
    document.getElementById('pwdError').innerHTML = "";
    Password.style.border = "2px solid green";
    submitButton.disabled = false;
    submitButton.style.backgroundColor = "orangered";
    submitButton.style.color = "white";
    confirmPassword.disabled = false;
    return true;
}

Password.addEventListener('keyup', pwdCheck);
Password.addEventListener('blur', pwdCheck);

// //Confirm Password Field Check Function

const passworConfirmdButton = document.querySelectorAll("#confirmPassword #pwdConfirmShow .fa-solid");

function pwdConfirmCheck() {
    let pwdValue = Password.value;
    let pwdConfirmValue = confirmPassword.value;

    pwdValue = pwdValue.trim();
    pwdConfirmValue = pwdConfirmValue.trim();

    if (pwdConfirmValue.length == 0) {
        pwdConfirmErrorLogo.innerHTML = "<i class='fa-solid fa-circle-exclamation'></i>";
        passworConfirmdButton[0].style.visibility = "hidden";
        document.getElementById('pwdConfirmError').innerHTML = "Enter Confirm Password";
        document.getElementById('pwdConfirmError').style.color = "red";
        confirmPassword.style.border = "2px solid red";
        submitButton.disabled = true;
        submitButton.style.backgroundColor = "#b68978";
        submitButton.style.color = "#dba9a9";
        return false;
    }

    if (pwdConfirmValue.length > 0) {
        passworConfirmdButton[0].style.visibility = "visible";
        document.getElementById('pwdConfirmError').innerHTML = "";
    }

    if (pwdConfirmValue != pwdValue) {
        pwdConfirmErrorLogo.innerHTML = "<i class='fa-solid fa-circle-exclamation'></i>";
        document.getElementById('pwdConfirmError').innerHTML = "Password Not Match";
        document.getElementById('pwdConfirmError').style.color = "red";
        confirmPassword.style.border = "2px solid red";
        submitButton.disabled = true;
        submitButton.style.backgroundColor = "#b68978";
        submitButton.style.color = "#dba9a9";
        return false;
    }

    pwdConfirmErrorLogo.innerHTML = "<i class='fa-solid fa-circle-check'></i>";
    document.getElementById('pwdConfirmError').innerHTML = "";
    confirmPassword.style.border = "2px solid green";
    submitButton.disabled = false;
    submitButton.style.backgroundColor = "orangered";
    submitButton.style.color = "white";
    return true;
}

confirmPassword.addEventListener('keyup', pwdConfirmCheck);
confirmPassword.addEventListener('blur', pwdConfirmCheck);

function submitForm(e) {
    e.preventDefault();
    if (Name.value.length == 0 || Email.value.length == 0 || Password.value.length == 0 || confirmPassword.value.length == 0) {
        nameCheck();
        emailCheck();
        pwdCheck();
        pwdConfirmCheck();
        return false;
    } else {
        userDetails.Name = Name.value;
        userDetails.Email = Email.value;
        userDetails.Password = confirmPassword.value;
        console.log(userDetails);
        alert("Sign Up Successful");
        document.getElementById('registraion-form').style.display = "none";
        document.querySelector('#loginForm').style.display = 'block';
        checkEmail.value = "";
        checkPwd.value = "";
        emailError.innerHTML = "";
        pwdError.innerHTML = "";
        clearSignUpForm();
        return true;
    }
}

submitButton.addEventListener('click', submitForm);

//Clear SignUp form after Cancel or Submit Success.



function clearSignUpForm() {
    Name.value = "";
    Email.value = "";
    Password.value = "";
    confirmPassword.value = "";
    nameErrorLogo.innerHTML = "";
    emailErrorLogo.innerHTML = "";
    pwdErrorLogo.innerHTML = "";
    pwdConfirmErrorLogo.innerHTML = "";
    passwordButton[0].style.visibility = "hidden";
    passwordButton[1].style.visibility = "hidden";
    passworConfirmdButton[0].style.visibility = "hidden";
    passworConfirmdButton[1].style.visibility = "hidden";
    document.getElementById('pwdError').innerHTML = "";
    document.getElementById('nameError').innerHTML = "";
    document.getElementById('emailError').innerHTML = "";
    document.getElementById('pwdRules').style.display = "none";
    document.getElementById('pwdConfirmError').innerHTML = "";
    Name.style.border = "1px solid rgb(134, 126, 117)";
    Email.style.border = "1px solid rgb(134, 126, 117)";
    Password.style.border = "1px solid rgb(134, 126, 117)";
    confirmPassword.style.border = "1px solid rgb(134, 126, 117)";
    submitButton.disabled = false;
    submitButton.style.backgroundColor = "orangered";
    submitButton.style.color = "white";
}

// closeFormBtn.addEventListener('click',clearSignUpForm);


//Code for Show Password 

function pwdShowFun() {
    Password.setAttribute('type', 'text');
    passwordButton[0].style.visibility = "hidden";
    passwordButton[1].style.visibility = "visible";
}

function pwdHideFun() {
    Password.setAttribute('type', 'password');
    passwordButton[0].style.visibility = "visible";
    passwordButton[1].style.visibility = "hidden";
}

passwordButton[0].addEventListener('click', pwdShowFun);
passwordButton[1].addEventListener('click', pwdHideFun);

//Code for Show Confirm Password 

function pwdConfirmShowFun() {
    confirmPassword.setAttribute('type', 'text');
    passworConfirmdButton[0].style.visibility = "hidden";
    passworConfirmdButton[1].style.visibility = "visible";
}

function pwdConfirmHideFun() {
    confirmPassword.setAttribute('type', 'password');
    passworConfirmdButton[0].style.visibility = "visible";
    passworConfirmdButton[1].style.visibility = "hidden";
}



passworConfirmdButton[0].addEventListener('click', pwdConfirmShowFun);
passworConfirmdButton[1].addEventListener('click', pwdConfirmHideFun);


//Login Form Validation

const checkEmail = document.getElementById('verify-email-value');
const checkPwd = document.getElementById('verify-pwd-value');

const emailError = document.getElementById("emailCheckError");
const pwdError = document.getElementById("pwdCheckError");

const checkButton = document.getElementById('Login');

function loginEmailCheck() {

    if (checkEmail.value.length == 0) {
        emailError.innerHTML = "Enter email";
        return false;
    }

    if (checkEmail.value.length > 0) {
        emailError.innerHTML = "";
        return false;
    }

    else {
        return true;
    }
}

checkEmail.addEventListener('click', loginEmailCheck);
checkEmail.addEventListener('blur', loginEmailCheck);

function loginPasswordCheck() {

    if (checkPwd.value.length == 0) {
        pwdError.innerHTML = "Enter Password";
        return false;
    }

    if (checkPwd.value.length > 0) {
        pwdError.innerHTML = "";
        return false;
    }

    else {
        return true;
    }

}

checkPwd.addEventListener('click', loginPasswordCheck);
checkPwd.addEventListener('blur', loginPasswordCheck);


checkButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (checkEmail.value.length == 0 || checkPwd.value.length == 0) {
        loginEmailCheck();
        loginPasswordCheck();
        return false;
    }

    if (userDetails.Email != checkEmail.value) {
        emailError.innerHTML = "Email is Wrong";
    }

    if (userDetails.Password != checkPwd.value) {
        pwdError.innerHTML = "Password is Wrong";
    }

    if (userDetails.Email == checkEmail.value && userDetails.Password == checkPwd.value) {
        alert("Login Successful");
        alert("Purchase Items Now")
        document.getElementById('Login').innerHTML = 'Login SuccessFull';
        document.getElementById('Login').disabled = "true";
        checkEmail.value = "";
        checkPwd.value = "";
        emailError.innerHTML = "";
        pwdError.innerHTML = "";
        document.querySelector('#loginForm').style.display = 'none';
        return true;
    }
})



//Reset Password 

const verifyEmailButton = document.getElementById('verifyEmailBtn');
const verifyResetEmail = document.getElementById('verify-reset-email');
const verifyResetEmailError = document.getElementById('emailResetError');

document.querySelector('#resetPassword .fa-xmark').addEventListener('click', () => {
    verifyResetEmail.value = "";
    verifyResetEmailError.innerHTML = "";
})

verifyEmailButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (verifyResetEmail.value.length == 0) {
        verifyResetEmailError.innerHTML = "Enter email";
        return false;
    }

    if (userDetails.Email != verifyResetEmail.value) {
        verifyResetEmailError.innerHTML = "Email is Wrong";
        return false;
    } 
    if ((userDetails.Email == verifyResetEmail.value)) {
        alert("Email Verified..! Reset Password Now");
        document.getElementById('resetPassword').style.display = "none";
        document.getElementById('registraion-form').style.display = "block";
        document.getElementById('name').style.display = "none";
        document.getElementById('email').style.display = "none";
        document.getElementById('reset-email').style.display = "block";
        document.getElementById('btn').style.display = "none";
        document.querySelector('#registraion-form h5').innerHTML = "Reset Password";
        verifyResetEmail.value = "";
        verifyResetEmailError.innerHTML = "";
        return true;
    }


})

const resetPasswordNow = document.getElementById('reset-email');

resetPasswordNow.addEventListener('click', (e) => {
    e.preventDefault();

    if(confirmPassword.value.length != 0) {
        userDetails.Password = confirmPassword.value;
        console.log(userDetails);
        alert("Password Updated");
        document.getElementById('registraion-form').style.display = "none";
        pwdErrorLogo.innerHTML = "";
        pwdConfirmErrorLogo.innerHTML = "";
        pwdShowButton.innerHTML = "";
        pwdConfirmShowButton.innerHTML = "";
        confirmPassword.style.border = "none";
        Password.style.border = "none";
        checkEmail.value = "";
        checkPwd.value = ""
        emailError.innerHTML = "";
        pwdError.innerHTML = "";
        return true;
    }
})








