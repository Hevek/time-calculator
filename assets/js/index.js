let previousNumber = ""
let nextNumber = ""
let operation = ""
let revNightRed = false
const history = {
    history: [],
    showResults: false,
    showOperations: false
}

function appendNumber(number){
    if(operation === ""){
        if(previousNumber.includes(":")){
            let [, lengthOfSexa] = previousNumber.split(":");
            if(lengthOfSexa.length === 2) return
            if(number === ":") return
        }

        previousNumber += number
    } else{
        if(nextNumber.includes(":")){
            let [, lengthOfSexa] = nextNumber.split(":")
            if(lengthOfSexa.length === 2) return
            if(number === ":") return
        }
        nextNumber += number
    }

    updateScreen()
}

function updateScreen(){
    if(!previousNumber && !nextNumber) return $screenDisplay.innerHTML = "0"

    if(operation === "") return $screenDisplay.innerHTML = previousNumber

    return $screenDisplay.innerHTML = `${previousNumber} ${operation} ${nextNumber}`
}

function chooseOperation(operator){
    if(!previousNumber) return
    if(operator && nextNumber) calculate()

    operation = operator

    updateScreen()
}

function calculate(){
    let hourMinute = false
    let hrMinByHrMin = false
    let prevHrMin = false
    let nextHrMin = false
    history.history.push({value: `${previousNumber}${operation}${nextNumber}`, type: 'operation'})

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
            if(!prevHrMin && nextHrMin) { previousNumber /= 60; hrMinByHrMin = false; hourMinute = true }

            previousNumber *= nextNumber
        break;
        case '÷':
            previousNumber /= nextNumber
        break;

        default:
        break;
    }

    if(!hrMinByHrMin){
        if(hourMinute) previousNumber = `${Math.floor(previousNumber/60)}:${String(Math.abs(Math.floor(previousNumber%60))).padStart(2,"0")}`
        else previousNumber = `${Math.floor(previousNumber)}:${String(Math.abs(Math.floor(Number(previousNumber)%1*60))).padStart(2,"0")}`
    } else previousNumber = Number(previousNumber).toFixed(2);

    previousNumber = String(previousNumber)
    history.history.push({value: `${previousNumber}`, type: 'result'})
    operation = ""
    nextNumber = ""

    updateScreen()
    updateHistory()
}

function clearAll(){
    previousNumber = ""
    nextNumber = ""
    operation = ""
    $screenDisplay.innerHTML = "0"
}

function deleteDigit(){
    let deleteDigit = false
    if(!operation) {previousNumber = previousNumber.slice(0, -1); deleteDigit = true}

    if(!deleteDigit && nextNumber) {nextNumber = nextNumber.slice(0, -1); deleteDigit = true}

    if(!deleteDigit && operation) operation = ""

    updateScreen()
}

function nightReduction(){
    let hourMinute = false
    let value = $screenDisplay.innerHTML

    if(value.includes(":")) {
        value = value.split(":")
        value = Number(value[0])*60 + Number(value[1])
        hourMinute = true
    }

    if(revNightRed) value *= 0.875
    else value /= 0.875

    if(hourMinute) value = `${Math.floor(value/60)}:${String(Math.floor(value%60)).padStart(2,"0")}`
    else value = `${Math.floor(value)}:${String(Math.floor(Number(value)%1*60)).padStart(2,"0")}`

    previousNumber = String(value)
    operation = ""
    nextNumber = ""

    updateScreen()
}

function revertNightReduction(){
    let nightRedActive = $revertNightReductionButton.dataset.revertNightReduction
    nightRedActive != 'false' ? revNightRed = false : revNightRed = true
    $revertNightReductionButton.dataset.revertNightReduction = revNightRed

    if(revNightRed) { $nightReductionButton.style.background = "#701c1c"; $revertNightReductionButton.style.background = "#8f3838" }
    else { $nightReductionButton.style.background = "#1c4870"; $revertNightReductionButton.style.background = "#3b3939" }
}

function updateHistory(){
    while ($historyList.rows.length > 2) {$historyList.deleteRow(2)}

    if(!history.showOperations && !history.showResults) return

    for (let i = history.history.length - 1; i >= 0; i--) {
        // Filter history case only one of the options is true
        if(!(history.showOperations && history.showResults)){
            if(history.showResults) if(history.history[i].type !== 'result') continue
            if(history.showOperations) if(history.history[i].type !== 'operation') continue
        }

        const originalIndex = history.history.length - 1 - i;
        // Insert a new row at the end of the table
        const newRow = $historyList.insertRow();

        // Insert a new cell in the new row
        const newCell = newRow.insertCell();

        // Add content to the new cell
        newCell.textContent = `${history.history[i].value}`;

        // Add a custom attribute to the new row
        newRow.setAttribute('data-history', `${originalIndex}`);
    }    
}

function updateHistoryOptions(option){
    if(option === 'operations'){
        if($showHistoryOperations.dataset.showOperations === 'true'){
            $showHistoryOperations.dataset.showOperations = 'false'
            $showHistoryOperations.style.background = "#3b4763"
            history.showOperations = false
        } else{
            $showHistoryOperations.dataset.showOperations = 'true'
            $showHistoryOperations.style.background = "#0b4f8f"
            history.showOperations = true
        }

        return updateHistory()
    }

    if($showHistoryResults.dataset.showResults === 'true'){
        $showHistoryResults.dataset.showResults = 'false'
        $showHistoryResults.style.background = "#3b4763"
        history.showResults = false
    } else{
        $showHistoryResults.dataset.showResults = 'true'
        $showHistoryResults.style.background = "#0b4f8f"
        history.showResults = true
    }

    return updateHistory()
}

// Getting HTML Elements and setting event listeners
const $screenDisplay = document.querySelector(".screen-display")

const $numberButtons = document.querySelectorAll("[data-number]")
$numberButtons.forEach(btn => btn.addEventListener("click", () => appendNumber(btn.dataset.number)))

const $operatorButtons = document.querySelectorAll("[data-operator]")
$operatorButtons.forEach(btn => btn.addEventListener("click", () => chooseOperation(btn.dataset.operator)))

const $equalButton = document.querySelector("[data-equal]")
$equalButton.addEventListener("click", () => calculate())

const $deleteButton = document.querySelector("[data-delete]")
$deleteButton.addEventListener("click", () => deleteDigit())

const $clearAllButton = document.querySelector("[data-clear-all]")
$clearAllButton.addEventListener("click", () => clearAll())

const $nightReductionButton = document.querySelector("[data-night-reduction]")
$nightReductionButton.addEventListener("click", () => nightReduction())

const $revertNightReductionButton = document.querySelector("[data-revert-night-reduction]")
$revertNightReductionButton.addEventListener("click", () => { revertNightReduction() })

const $historyList = document.querySelector(".history")

const $showHistoryResults = document.querySelector("[data-show-results]")
$showHistoryResults.addEventListener("click", ()=> { updateHistoryOptions('results') })

const $showHistoryOperations = document.querySelector("[data-show-operations]")
$showHistoryOperations.addEventListener("click", ()=> { updateHistoryOptions('operations') })

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
    Delete: () => {clearAll()},
    Tab: () => {revertNightReduction()},
    KeyR: () => {nightReduction()},
    NumpadComma: () => {appendNumber(".")},
    NumpadDecimal: () => {appendNumber(".")},
    Comma: () => {appendNumber(".")},
    Period: () => {appendNumber(".")}
}

const keyCommmandUtils = {
    Digit8: () => {chooseOperation('x')},
    Equal: () => {chooseOperation("+")},
    Slash: () => {appendNumber(":")}
}

document.addEventListener("keydown", function(event) {
    const key = event.key
    const keyCode = event.code
    const shiftKey = event.shiftKey

    if(keyCode === 'Tab') event.preventDefault()

    if(key in keyNumbers) keyNumbers[key]()
    if(keyCode in keyOperators) keyOperators[keyCode]()
    if(keyCode in keyUtils) keyUtils[keyCode]()
    if(shiftKey && keyCode in keyCommmandUtils) keyCommmandUtils[keyCode]()
});