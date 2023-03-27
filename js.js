"use strict";

const account1 = {
  owner: "Dmitrii Fokeev",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
  
};

const account2 = {
  owner: "Anna Filimonova",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Polina Filimonova",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Stanislav Ivanchenko",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1.0,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

function addMovements(movements){
  containerMovements.innerHTML = "";
  movements.forEach((value, i)=> { 
    const type = value >= 0 ? "deposit" : "withdrawal";
    const sms = value >= 0 ? "Зарахування" : "Зняття"
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${sms}</div>
      <div class="movements__date">24/01/2037</div>
      <div class="movements__value">${value}</div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html)
  })
}


function createLogin(accs) {
  accs.forEach((acc)=> {
    acc.login = acc.owner
      .toLowerCase()
      .split(" ")
      .map((value) => {
        return value[0];
      }).join("")
  })
}

createLogin(accounts)

function addAllBalance(ac){
  ac.balance = ac.movements.reduce((acc, val)=> {
    return acc + val
  })
  return labelBalance.textContent = `${ac.balance} UA`
}



function sumAll(movements){
  const comeIn = movements
      .filter((el)=> el > 0)
      .reduce((acc, el) => acc + el, 0)
  labelSumIn.textContent = `${comeIn} UA`

  const comeOut = movements
      .filter((el)=> el < 0)
      .reduce((acc, el) => el + acc)
  labelSumOut.textContent = `${Math.abs(comeOut)} UA`

  const sum = comeIn + comeOut
  labelSumInterest.textContent = `${sum} UA`
  
}

function update(acc) {
  addMovements(acc.movements);
  addAllBalance(acc);
  sumAll(acc.movements);
};

let currentAccount;

btnLogin.addEventListener('click', (e) => {
  e.preventDefault()
  currentAccount = accounts.find(function(acc) {
    return acc.login === inputLoginUsername.value;
  });
  if(currentAccount && currentAccount.pin === Number(inputLoginPin.value)){
    console.log("ONE")
    containerApp.style.opacity = 100;
    inputLoginPin.value = inputLoginUsername.value = "";
     update(currentAccount)
  }
})

btnTransfer.addEventListener("click", function(e) {
  e.preventDefault();
  const recivAc = accounts.find(function(ac) {
    return ac.login === inputTransferTo.value;
  })
  const amount = Number(inputTransferAmount.value);
  if(
    recivAc &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    recivAc.login !== currentAccount.login
  ){
    currentAccount.movements.push(-amount)
    recivAc.movements.push(amount)
    update(currentAccount)
  }
});