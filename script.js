let items = document.querySelectorAll('.grid-item')
let resetScreen = document.querySelector('#reset')
let aiButton = document.querySelector('#ai-button')
let aiMode = document.querySelector('#aimode')
let isDisplayed = false
let ai
//console.log(items)
let winner=null;
const Player = (mark,name)=>{
    return {mark,name}
}
const playerOne = Player('X','playerOne');
const playerTwo = Player('O','playerTwo');

let currPlayer = playerOne;

let gameBoard = (()=>{
    let turns = 0
    let state = ['','','','','','','','','']
    //console.log(state)
    const updateState = (num)=>{
        turns++
        state[num]=currPlayer.mark
        let val
        //console.log(state)
        if(turns>=5){
            val = checkState()
            if(val!="tie" && val!=null){
                setWinner(val)
                return
            }
            if(val=="tie"){
                winner="tie"
                setWinner(null)
                return
            }
        }
    }
    function nextMove(){
        let i=bestMove();
        state[i]=playerTwo.mark;
        //console.log(state)
        if(winner!="tie")
            items[dataset=`${i}`].click();
    }
    function bestMove(){
        let index,score;
        let bestScore = -1000;
        for(let i=0;i<9;i++){
            if(state[i]==''){
                state[i] = playerTwo.mark
                turns++
                score = minimax(0,false)
                state[i]=''
                turns--
                if(score>bestScore){
                    bestScore = score
                    index = i;
                }
            }
        }
        return index;
    }
    function minimax(depth, isMaximizing){
        let result = checkState();
        winner = null
        if(result==playerOne){
            return -10
        }
        else if(result==playerTwo){
            return 10;
        }
        else if(result=="tie"){
            return 0
        }
        else{
            if(isMaximizing==true){
                let bestScoreMax = -1000
                let scoreMax
                for(let i=0;i<9;i++){
                    if(state[i]==''){
                        state[i]=playerTwo.mark
                        turns++
                        scoreMax = minimax(depth+1,false)
                        state[i]=''
                        turns--
                        if(scoreMax>bestScoreMax){
                            bestScoreMax = scoreMax
                        }
                    }
                }
                return bestScoreMax
            }
            else if(isMaximizing==false){
                let bestScoreMin = 1000;
                let scoreMin;
                for(let i=0;i<9;i++){
                    if(state[i]==''){
                        state[i] = playerOne.mark
                        turns++
                        scoreMin = minimax(depth+1,true)
                        state[i]=''
                        turns--
                        if(scoreMin<bestScoreMin){
                            bestScoreMin = scoreMin
                        }
                    }
                }
                return bestScoreMin
            }
        }
    }
    const resetState = () => {
        state = ['','','','','','','','','']
        winner = null
        turns=0
    }
    const checkState = () => {
        if((state[0]=='X' && state[1]=='X' && state[2]=='X') ||
        (state[3]=='X' && state[4]=='X' && state[5]=='X') ||
        (state[6]=='X' && state[7]=='X' && state[8]=='X') ||
        (state[0]=='X' && state[3]=='X' && state[6]=='X') ||
        (state[1]=='X' && state[4]=='X' && state[7]=='X') ||
        (state[2]=='X' && state[5]=='X' && state[8]=='X') ||
        (state[0]=='X' && state[4]=='X' && state[8]=='X') ||
        (state[2]=='X' && state[4]=='X' && state[6]=='X')){
            winner = playerOne
            return playerOne
            
        }
        if((state[0]=='O' && state[1]=='O' && state[2]=='O') ||
        (state[3]=='O' && state[4]=='O' && state[5]=='O') ||
        (state[6]=='O' && state[7]=='O' && state[8]=='O') ||
        (state[0]=='O' && state[3]=='O' && state[6]=='O') ||
        (state[1]=='O' && state[4]=='O' && state[7]=='O') ||
        (state[2]=='O' && state[5]=='O' && state[8]=='O') ||
        (state[0]=='O' && state[4]=='O' && state[8]=='O') ||
        (state[2]=='O' && state[4]=='O' && state[6]=='O')){
            winner = playerTwo
            return playerTwo
            
        }
        if(winner==null && turns==9){
            return "tie"
        }
        else
            return null
    }
    const setWinner = (player) => {
        isDisplayed=true
        if(player==null){
            let image = document.createElement('img');
            image.setAttribute('src','./tie.png');
            image.setAttribute('width','80')
            image.setAttribute('height','80')
            resetScreen.children[0].textContent = '';
            resetScreen.children[0].appendChild(image)
            resetScreen.children[1].textContent = 'Draw!';
            resetScreen.classList.toggle('active');
            return
        }
        resetScreen.classList.toggle('active');
        resetScreen.children[0].textContent = player.mark;
        resetScreen.children[1].textContent = player.name+ ' wins!';
    }
    return {
        updateState,resetState,nextMove
    }
})()



function reset(){
    isDisplayed = false
    if(resetScreen.children[0].textContent==''){
        resetScreen.children[0].children[0].remove();
    }
    resetScreen.classList.toggle('active');
    winner=null;
    gameBoard.resetState();
    currPlayer = playerOne
    items.forEach(item => {
        item.textContent=''
    })
    
}

aiButton.addEventListener('click',()=>{
    aiButton.classList.toggle('active')
    gameBoard.resetState()
    currPlayer = playerOne
    items.forEach(item => {
        item.textContent=''
    })
    aiMode.classList.toggle('active')
    if(ai==true)
        ai=false
    else
        ai=true
})

items.forEach(item =>{
    item.addEventListener('click',()=>{
        if(item.textContent=='' && winner==null && isDisplayed==false){
            //console.log(item)
            gameBoard.updateState(item.dataset.num)
            item.textContent = currPlayer.mark;
            if(currPlayer==playerOne)
                currPlayer=playerTwo
            else
                currPlayer=playerOne
            
        }
        if(currPlayer==playerTwo && winner==null && ai==true){
            gameBoard.nextMove()
        }
    })
})