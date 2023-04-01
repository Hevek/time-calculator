let previousNumber = ""
let nextNumber = ""
let operation = ""

function appendNumber(number){
    if(operation === ""){
        if(previousNumber.includes(":") && number === ":") return

        previousNumber += number
    } else{
        if(nextNumber.includes(":") && number === ":") return
        nextNumber += number
    }
}

function updateScreen(){
    if(!previousNumber && !nextNumber) return $screenDisplay.innerHTML = "0"

    if(operation === "") return $screenDisplay.innerHTML = previousNumber

    return $screenDisplay.innerHTML = `${previousNumber} ${operation} ${nextNumber}`
}

function chooseOperation(operator){
    if(operator && nextNumber) calculate()

    operation = operator
}

function calculate(){
    let hourMinute = false
    let hrMinByHrMin = false
    let prevHrMin = false
    let nextHrMin = false

    if(previousNumber.includes(":") || nextNumber.includes(":")) hourMinute = true

    if(hourMinute){
        if(previousNumber.includes(":")){
            prevHrMin = true
            previousNumber = previousNumber.split(":")
            previousNumber = Number(previousNumber[0])*60 + Number(previousNumber[1])
        } else previousNumber *= 60

        if(nextNumber.includes(":")){
            nextHrMin = true
            if(operation === 'x' || operation === '÷'){ hrMinByHrMin = true; hourMinute = false }
            nextNumber = nextNumber.split(":")
            nextNumber = Number(nextNumber[0])*60 + Number(nextNumber[1])
        } else{
            if(operation!== 'x' && operation!== '÷') nextNumber *= 60
        }

        if(!prevHrMin && nextHrMin) { previousNumber /= 60; hrMinByHrMin = false; hourMinute = true }
    }

    previousNumber = Number(previousNumber)
    nextNumber = Number(nextNumber)

    switch(operation){
        case '+':
            previousNumber += nextNumber
        break;
        case '-':
            previousNumber -= nextNumber
        break;
        case 'x':
            previousNumber *= nextNumber
        break;
        case '÷':
            previousNumber /= nextNumber
        break;

        default:
        break;
    }

    if(!hrMinByHrMin){
        if(hourMinute) previousNumber = `${Math.floor(previousNumber/60)}:${String(Math.floor(previousNumber%60)).padStart(2,"0")}`
        else previousNumber = `${Math.floor(previousNumber)}:${String(Math.floor(Number(previousNumber)%1*60)).padStart(2,"0")}`
    } else previousNumber = Number(previousNumber).toFixed(2);

    previousNumber = String(previousNumber)
    operation = ""
    nextNumber = ""
}

function clearAll(){
    previousNumber = ""
    nextNumber = ""
    operation = ""
    $screenDisplay.innerHTML = "0"
}

function deleteDigit(){
    if(!operation) return previousNumber = previousNumber.slice(0, -1)

    if(nextNumber) return nextNumber = nextNumber.slice(0, -1)

    if(operation) return operation = ""
}

function nightReduction(){
    let hourMinute = false
    let value = $screenDisplay.innerHTML

    if(value.includes(":")) {
        value = value.split(":")
        value = Number(value[0])*60 + Number(value[1])
        hourMinute = true
    }

    value /= 0.875

    if(hourMinute) value = `${Math.floor(value/60)}:${String(Math.floor(value%60)).padStart(2,"0")}`
    else value = `${Math.floor(value)}:${String(Math.floor(Number(value)%1*60)).padStart(2,"0")}`

    return $screenDisplay.innerHTML = value
}

// Getting HTML Elements and setting event listeners
const $numberButtons = document.querySelectorAll("[data-number]")
$numberButtons.forEach(btn => btn.addEventListener("click", () => {appendNumber(btn.dataset.number); updateScreen()}))

const $screenDisplay = document.querySelector(".screen-display")

const $operatorButtons = document.querySelectorAll("[data-operator]")
$operatorButtons.forEach(btn => btn.addEventListener("click", () => {chooseOperation(btn.dataset.operator); updateScreen()}))

const $equalButton = document.querySelector("[data-equal]")
$equalButton.addEventListener("click", () => {calculate(); updateScreen()})

const $clearAllButton = document.querySelector("[data-clear-all]")
$clearAllButton.addEventListener("click", () => clearAll())

const $deleteButton = document.querySelector("[data-delete]")
$deleteButton.addEventListener("click", () => {deleteDigit(); updateScreen()})

const $nightReductionButton = document.querySelector("[data-night-reduction]")
$nightReductionButton.addEventListener("click", () => nightReduction())

// Setting event handlers for numbers on keyboard
const keyNumbers = {}
for(i = 0; i <= 9; i++){ const n = i; keyNumbers[i.toString()] = () => {appendNumber(n)} }

// Setting event handlers for operations on keyboard
const keyOperators = {
    NumpadSubtract: () => {chooseOperation('-')},
    Minus: () => {chooseOperation('-')},
    IntlRo: () => {chooseOperation('÷')},
    NumpadDivide: () => {chooseOperation('÷')},
    NumpadMultiply: () => {chooseOperation('x')},
    NumpadAdd: () => {chooseOperation('+')},
}

const keyUtils = {
    Equal: () => {calculate()},
    Enter: () => {calculate()},
    NumpadEnter: () => {calculate()},
    Backspace: () => {deleteDigit()},
    Delete: () => {clearAll()}
}

const keyCommmandUtils = {
    Digit8: () => {chooseOperation('x')},
    Equal: () => {calculate()},
    Slash: () => {appendNumber(":")}
}

document.addEventListener("keydown", function(event) {
    const key = event.key
    const keyCode = event.code
    const shiftKey = event.shiftKey

    if(key in keyNumbers) keyNumbers[key]()
    if(keyCode in keyOperators) keyOperators[keyCode]()
    if(keyCode in keyUtils) keyUtils[keyCode]()
    if(shiftKey && keyCode in keyCommmandUtils) keyCommmandUtils[keyCode]()
    updateScreen()
});