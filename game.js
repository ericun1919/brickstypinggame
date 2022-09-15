// define the time limit
let TIME_LIMIT = 60;

// define quotes to be used
let quotes_array = [
"Failure is the condiment that gives success its flavor.\nWake up with determination. Go to bed with satisfaction.\nIt's going to be hard, but hard does not mean impossible.",
"Learning never exhausts the mind.\nThe only way to do great work is to love what you do.\nIn order to save time; in order to use time more efficiently; so that time can be used more efficiently."
];

// selecting required elements
let timer_text = document.querySelector(".curr_time");
let accuracy_text = document.querySelector(".curr_accuracy");
let error_text = document.querySelector(".curr_errors");
let cpm_text = document.querySelector(".curr_cpm");
let wpm_text = document.querySelector(".curr_wpm");
let input_area = document.querySelector(".input_area");
let restart_btn = document.querySelector(".restart_btn");
let cpm_group = document.querySelector(".cpm");
let wpm_group = document.querySelector(".wpm");
let error_group = document.querySelector(".errors");
let accuracy_group = document.querySelector(".accuracy");

let currentChar = 0; 
let timeLeft = TIME_LIMIT;
let timeElapsed = 0;
let total_errors = 0;
let errors = 0;
let accuracy = 0;
let characterTyped = 0;
let current_quote = "";
let quoteNo = 0;
let timer = null;

function generateParagraph() {

    input_area.textContent = null;
    current_quote = quotes_array[quoteNo];
    // separate each character and make an element
    // out of each of them to individually style them

    current_quote.split('').forEach(char => {
        const charSpan = document.createElement('span')
        charSpan.innerText = char
        input_area.appendChild(charSpan)
        if (charSpan.childElementCount == 1){
            charSpan.classList.add('enter');
            $('.enter').empty();
            input_area.appendChild(document.createElement('br'));
        }
    })
    currentChar = 0;
    input_area.getElementsByTagName('span')[currentChar].className += 'current';
    // roll over to the first quote
    if (quoteNo < quotes_array.length - 1)
        quoteNo++;
    else
        quoteNo = 0;
}

function processCurrentText(k) {

    let current = input_area.getElementsByTagName('span')[currentChar];
    let spanChar = current.innerText;

    current.classList.remove('current');

    if (k == spanChar) {
        current.classList.add('correct');

    } else {
        if (current.className == 'enter' && k == 'Enter'){
            current.classList.add('correct');
        } else {
            if (spanChar == ' '){
                current.classList.add('spaceIncorrect');
            } else{
                current.classList.add('incorrect');
            }
            
            errors++;
        }

    }

    if (currentChar == current_quote.length - 1){
        generateParagraph()
    } else {
        let next = input_area.getElementsByTagName('span')[currentChar + 1];
        next.classList.add('current');
        currentChar++;
    }
    
    characterTyped++;
    dataUpdate();
}

function undo() {

    let current = input_area.getElementsByTagName('span')[currentChar];
    let previous = input_area.getElementsByTagName('span')[currentChar - 1];
    let spanChar = current.innerText;

    current.classList.remove('current');
    console.log(previous.className);
    if (previous.className == 'incorrect' || previous.className == 'spaceIncorrect'){
        errors--;
    }
    previous.classList.remove('correct');
    previous.classList.remove ('incorrect');
    previous.classList.remove ('spaceIncorrect');
    previous.classList.add('current');
    characterTyped--;
    currentChar--;
    dataUpdate();
}

function dataUpdate(){
    // display the number of errors
    error_text.textContent = total_errors + errors;

    // update accuracy text
    let correctCharacters = (characterTyped - (total_errors + errors));
    let accuracyVal = ((correctCharacters / characterTyped) * 100);
    accuracy_text.textContent = Math.round(accuracyVal);
}
function startGame() {

    resetValues();
    generateParagraph();

    // clear old and start a new timer
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
    }
    
    function resetValues() {
    timeLeft = TIME_LIMIT;
    timeElapsed = 0;
    errors = 0;
    total_errors = 0;
    accuracy = 0;
    characterTyped = 0;
    quoteNo = 0;
    input_area.disabled = false;
    currentChar = 0;
    accuracy_text.textContent = 100;
    timer_text.textContent = timeLeft + 's';
    error_text.textContent = 0;
    restart_btn.style.display = "none";
    cpm_group.style.display = "none";
    wpm_group.style.display = "none";
    }

function updateTimer() {
    if (timeLeft > 0) {
        // decrease the current time left
        timeLeft--;
    
        // increase the time elapsed
        timeElapsed++;
    
        // update the timer text
        timer_text.textContent = timeLeft + "s";
    }
    else {
        // finish the game
        finishGame();
    }
    }

function finishGame() {
    // stop the timer
    clearInterval(timer);
    
    // disable the input area
    input_area.disabled = true;
    
    // display restart button
    restart_btn.style.display = "block";
    
    // calculate cpm and wpm
    cpm = Math.round(((characterTyped / timeElapsed) * 60));
    wpm = Math.round((((characterTyped / 5) / timeElapsed) * 60));
    
    // update cpm and wpm text
    cpm_text.textContent = cpm;
    wpm_text.textContent = wpm;
    
    // display the cpm and wpm
    cpm_group.style.display = "block";
    wpm_group.style.display = "block";
    }

startGame();        

document.addEventListener('keydown', function(event) {
    if (event.key != 'Shift'){
        if (event.key == 'Backspace'){
            if (currentChar > 0){
                undo();
            }
        }else{
            processCurrentText(event.key);
        }
    }
  });