let previousNumber = ""
let nextNumber = ""
let operation = ""
let history = []

function appendNumber(number){
    if(operation === ""){
        if(previousNumber.includes(".") && number === ".") return

        previousNumber += number
    } else{
        if(nextNumber.includes(".") && number === ".") return
        nextNumber += number
    }
}

function updateScreen(){
    if(!previousNumber && !nextNumber) return $screenDisplay.innerHTML = "0"
    if(operation === ""){
        return $screenDisplay.innerHTML = previousNumber
    }

    return $screenDisplay.innerHTML = `${previousNumber} ${operation} ${nextNumber}`
}

function chooseOperation(operator){
    if(operator && nextNumber) calculate()

    operation = operator
}

function calculate(){
    
    previousNumber = Number(previousNumber)
    nextNumber = Number(nextNumber)
    history.push(`${previousNumber}${operation}${nextNumber}`)
    console.log(history)

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

    previousNumber = String(previousNumber)
    nextNumber = String(nextNumber)

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