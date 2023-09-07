//Setting scrollbar
let scrollbar = document.querySelector('#password-scroll');
let password_value = document.querySelector('#password-value');
let password_show = document.querySelector('#password');
let copy_text = document.querySelector('.copy_text');
const indicator = document.querySelector("[data-indicator]");
console.log(scrollbar.value);

scrollbar.addEventListener('input', () => {
    let temp = scrollbar.value;
    password_value.textContent = temp;
    // console.log(temp);
    count_boxes_ticked();
})


async function copy_content() {
    try {
        await navigator.clipboard.writeText(password_show.value);
        console.log("Text copied")
    }
    catch (e) {
        console.log("Copy process failed")
    }
}
copy_text.addEventListener("click", copy_content);

//handling checkboxes
let all_boxes = document.querySelectorAll('input[type=checkbox]');
all_boxes.forEach((checkbox) => {
    checkbox.addEventListener('change', count_boxes_ticked);
})
let check_count = 0;
function count_boxes_ticked() {
    check_count = 0;
    all_boxes.forEach((checkbox) => {
        if (checkbox.checked) {
            check_count++;
        }
    })
    if (check_count > password_value.textContent) {
        scroll.value = check_count;
        scrollbar.value = check_count
        password_value.textContent = check_count;
    }
}

//random character generator
function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function get_random_integer() {
    return random(0, 9);
}

function get_lower_alphabet() {
    return String.fromCharCode(random(97, 123));
}
function get_upper_alphabet() {
    return String.fromCharCode(random(65, 91));
}

const symbols = '~`!@#$%^&*()_-+="{[}]|:;"<,>.?/<\>';

function get_random_symbol() {
    let temp = random(0, symbols.length);
    return symbols.charAt(temp);
}

let generate_password = document.querySelector('.generate-button');

let upper = document.querySelector('#upper');
let lower = document.querySelector('#lower');
let number = document.querySelector('#number');
let symbol = document.querySelector('#symbol');
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow - HW
}
function calcStrength(password) {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (upper.checked) hasUpper = true;
    if (lower.checked) hasLower = true;
    if (number.checked) hasNum = true;
    if (symbol.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && password.length >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        password.length >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

function shuffle(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
        const temp = Math.floor(Math.random() * (i + 1));
        const ele = arr[i];
        arr[i] = arr[temp];
        arr[temp] = ele;
    }
    let str = "";
    arr.forEach((ele) => {
        str += ele;
    });
    return str;
}
generate_password.addEventListener("click", () => {
    count_boxes_ticked();
    if (check_count == 0) {
        alert("Can't generate  password");
        return;
    }
    let password = "";
    let func = [];

    if (upper.checked) {
        func.push(get_upper_alphabet);
    }
    if (lower.checked) {
        func.push(get_lower_alphabet);
    }
    if (number.checked) {
        func.push(get_random_integer);
    }
    if (symbol.checked) {
        func.push(get_random_symbol);
    }

    for (let i = 0; i < func.length; i++) {
        password += func[i]();
    }

    for (let i = func.length; i < password_value.textContent; i++) {
        let temp = random(0, func.length);
        password += func[temp]();
    }
    password = shuffle(Array.from(password));
    password_show.value = password;
    calcStrength(parseInt(password));
})