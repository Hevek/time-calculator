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
    if(!previousNumber && operator!=='-') return

    if(operation==='-' && previousNumber.includes('-')){ previousNumber += operator; return updateScreen() }

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
}

function updateHistory(){
    while ($historyList.rows.length > 2) {$historyList.deleteRow(2)}

    if(!history.showOperations && !history.showResults) return

    for (let i = history.history.length - 1; i >= 0; i--) {
        // Skips if the index doesn't exist
        if(!history.history[i]) continue;

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
        const textContent = document.createTextNode(`${history.history[i].value}`);

        // Add icons to the new cell
        const deleteSpan = document.createElement('span');
        deleteSpan.classList.add('delete-icon');
        deleteSpan.addEventListener('click', () => {
            delete history.history[i]

            // Create message element
            const message = document.createElement('div');
            message.textContent = 'Deleted!';
            message.classList.add('delete-message');
            
            // Add message after icon
            deleteSpan.after(message);

            // Remove message after 0.75seg
            setTimeout(() => { message.remove(); updateHistory() }, 500);
        });

        const copySpan = document.createElement('span');
        copySpan.classList.add('copy-icon');
        copySpan.addEventListener('click', () => {
            navigator.clipboard.writeText(history.history[i].value)
            // Create message element
            const message = document.createElement('div');
            message.textContent = 'Copied!';
            message.classList.add('copy-message');
            
            // Add message after icon
            copySpan.after(message);
            
            // Remove message after 0.75seg
            setTimeout(() => { message.remove() }, 750);
        });

        newCell.appendChild(textContent);
        newCell.appendChild(deleteSpan);
        newCell.appendChild(copySpan);

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

function sanitizePaste(input) {
    const regex = /[^1234567890*/+\-:÷x.]/g
    input = input.replace("/", "÷")
    input = input.replace("*", "x")
    return input.replace(regex, '')
}

function copyScreenValue(){
    navigator.clipboard.writeText($screenDisplay.innerHTML)

    // Create message element
    const message = document.createElement('div')
    message.textContent = 'Copied!'
    message.classList.add('copy-message-screen')
    
    // Add message after screen
    $screenDisplay.after(message)
    
    // Remove message after 0.75seg
    setTimeout(() => { message.remove() }, 750)
}

function pasteScreenValue(){
    const regex = /[1234567890*/+\-:÷x.]/g;
    navigator.clipboard.readText().then(text => {
        // Return if there's not a valid value
        if(!text || !regex.test(text)) return
        text = sanitizePaste(text)
        $screenDisplay.innerHTML = text

        const operators = ['+', '-', 'x', '÷'];

        // Split the expression using the operator
        [previousNumber, nextNumber] = text.split(operators.find(op => text.includes(op)))

        operation = operators.find(op => text.includes(op))

        // Create message element
        const message = document.createElement('div')
        message.textContent = 'Pasted!'
        message.classList.add('paste-message-screen')
        
        // Add message after screen
        $screenDisplay.after(message)
        
        // Remove message after 0.75seg
        setTimeout(() => { message.remove() }, 750)
    })
}

// Getting HTML Elements and setting event listeners
const $screenDisplay = document.querySelector(".screen-display")
$screenDisplay.addEventListener('click', () => copyScreenValue())
$screenDisplay.addEventListener('contextmenu', (e) => { e.preventDefault(); pasteScreenValue() })

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
$revertNightReductionButton.addEventListener("click", () => {
    revertNightReduction()
    if(revNightRed) { $nightReductionButton.style.background = "#701c1c"; $revertNightReductionButton.style.background = "#701c1c" }
    else { $nightReductionButton.style.background = "#1c4870"; $revertNightReductionButton.style.background = "#1c4870" }
})

const $historyList = document.querySelector(".history")

const $history = document.querySelector(".history")

const $showHistoryResults = document.querySelector("[data-show-results]")
$showHistoryResults.addEventListener("click", ()=> { updateHistoryOptions('results') })

const $showHistoryOperations = document.querySelector("[data-show-operations]")
$showHistoryOperations.addEventListener("click", ()=> { updateHistoryOptions('operations') })

const $showHistory = document.querySelector(".show-history")
$showHistory.addEventListener("click", () => {$history.style.display = 'flex'; $showHistory.style.display = 'none'})

const $hideHistory = document.querySelector(".hide-history")
$hideHistory.addEventListener("click", () => {$history.style.display = 'none'; $showHistory.style.display = 'flex'})

const $utilityOptions = document.querySelector(".utility-options")

const $showUtilityOptions = document.querySelector(".show-utility-options")
$showUtilityOptions.addEventListener("click", () => {$utilityOptions.style.display = 'flex'; $showUtilityOptions.style.display = 'none'})

const $hideUtilityOptions = document.querySelector(".hide-utility-options")
$hideUtilityOptions.addEventListener("click", () => {$utilityOptions.style.display = 'none'; $showUtilityOptions.style.display = 'flex'})

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

const keyShiftUtils = {
    Digit8: () => {chooseOperation('x')},
    Equal: () => {chooseOperation("+")},
    Slash: () => {appendNumber(":")}
}

const keyCtrlUtils = {
    KeyC: () => {copyScreenValue()},
    KeyV: () => {pasteScreenValue()},
}

document.addEventListener("keydown", function(event) {
    const key = event.key
    const keyCode = event.code
    const shiftKey = event.shiftKey
    const controlKey = event.ctrlKey

    if(keyCode === 'Tab') event.preventDefault()

    if(key in keyNumbers) keyNumbers[key]()
    if(keyCode in keyOperators) keyOperators[keyCode]()
    if(keyCode in keyUtils) keyUtils[keyCode]()
    if(shiftKey && keyCode in keyShiftUtils) keyShiftUtils[keyCode]()
    if(controlKey && keyCode in keyCtrlUtils) keyCtrlUtils[keyCode]()
});