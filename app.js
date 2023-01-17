const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    win: document.querySelector('.win'),
    start: document.querySelector('button'),
    controllers: document.querySelector('.start'),
    controls: document.querySelector(".controlscontainer"),
    time: document.querySelector("time"),
    popupOpen: document.querySelector(".container"),
    stats: document.querySelector(".stats")
}

let addPlayer = document.getElementById("addToDo");
let inputText = document.getElementById("inputText");
let paragraph = document.createElement("p");
paragraph.innerHTML = inputText.value;
let selectedvalue = document.getElementById("time").value;



const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 60,
    time: selectedvalue,
    loop: null
}


function start() {
    controls.classList.add("hide");
    controllers.classList.add("hide");
    controls.classList.remove("controls-container");
    controllers.classList.remove("button");
}



const shuffle = array => {
    const clonedArray = [...array]

    for (let i = clonedArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1))
        const original = clonedArray[i]

        clonedArray[i] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}

const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for (let i = 0; i < items; i++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        
        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}

const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension')  

    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.")
    }

    const alphabets = ['A', 'R', 'G', 'X', 'Z', 'W', 'L', 'V', 'T', 'Q', 'B',
     'C', 'D', 'E', 'Y', 'U', 'I', 'O', 'P', 'S', 'D', 'F', 'H', 'J', 'K', '&',
      'N', 'M', '0', '9', '1', '2', '3', '4', '5', '6', '7', '8']
    const picks = pickRandom(alphabets, (dimensions * dimensions) / 2) 
    const items = shuffle([...picks, ...picks])
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
       </div>
    `
    
    const parser = new DOMParser().parseFromString(cards, 'text/html')

    selectors.board.replaceWith(parser.querySelector('.board'))
}

function startGame() {
    state.gameStarted = true
    selectors.start.classList.add('disabled');
    selectors.start.classList.add('hide');
    selectors.controls.classList.add('hide');
    let selectedvalue = document.getElementById("time").value;
    state.loop = setInterval(() => {
    selectedvalue--

        selectors.moves.innerText = `Hamleler: ${state.totalFlips} `
        selectors.timer.innerText = `Kalan süre: ${selectedvalue} sn`
        if (selectedvalue == 0) {
            setTimeout(() => {
                selectors.popupOpen.style.visibility = "visible";
                
                clearInterval(state.loop)
            })
        }
    }, 1000)
        addPlayer.addEventListener("click", function(){
        selectors.boardContainer.classList.add('flipped')
        selectors.popupOpen.style.visibility = "hidden";
        selectors.stats.style.visibility = "hidden";
    
        let div = document.createElement("p");
        div.setAttribute('class', 'to-do-element');
    
        selectors.boardContainer.appendChild(div);

        let paragraph = document.createElement("p");
        paragraph.classList.add("hide");
        div.appendChild(paragraph);
        paragraph.innerHTML = inputText.value;
    
        inputText.value = "";
        selectors.win.innerHTML = `
            <span class="win-text">
            <table>
                <tr>
                    <th>Oyuncu</th>
                    <th>Kalan Süre</th>
                    <th>Hamleler</th>
                    <th>Skor</th>
                </tr>
                <tr>
                    <td>${paragraph.innerHTML}</td>
                    <td>${selectedvalue}</td>
                    <td>${state.totalFlips}</td>
                    <td>NaN</td>
                </tr>
            </table>
            </span>
        `
    })
}

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0
}

const flipCard = card => {
    state.flippedCards++
    state.totalFlips++

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.popupOpen.style.visibility = "visible";

            clearInterval(state.loop)
        }, 1000)
        
    }
}

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }
    })
}

generateGame()
attachEventListeners()