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
    console.log(`Prev: ${previousNumber}`)
    console.log(`Next: ${nextNumber}`)
    if(operator && nextNumber) calculate()

    operation = operator
    console.log(`After P: ${previousNumber}`)
    console.log(`After N: ${nextNumber}`)
}

function calculate(){
    let hourMinute = false
    if(previousNumber.includes(":") || nextNumber.includes(":")) hourMinute = true

    if(hourMinute){
        if(previousNumber.includes(":")){
            previousNumber = previousNumber.split(":")
            previousNumber = Number(previousNumber[0])*60 + Number(previousNumber[1])
        }

        if(nextNumber.includes(":")){
            nextNumber = nextNumber.split(":")
            nextNumber = Number(nextNumber[0])*60 + Number(nextNumber[1])
        } else{
            if(operation!== 'x' && operation!== '÷') nextNumber *= 60
        }
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

    if(hourMinute) previousNumber = `${Math.floor(previousNumber/60)}:${String(Math.floor(previousNumber%60)).padStart(2,"0")}`
    else previousNumber = `${Math.floor(previousNumber)}:${String(Math.floor(Number(previousNumber)%1*60)).padStart(2,"0")}`

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