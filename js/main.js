function createCellGrid(){
    rows = 25
    columns = 80

    size = 40
    elements = []
    cells = [] 
    dead = 0
    alive = 1
    liveCells = 0
    currentStep = 0
    runing = false
    interval = null
    const table = document.getElementById('grid')
    for (let i = 0; i < rows; i++) {
       let tr = document.createElement('tr')
       let tds = []
       cells.push(new Array(columns).fill(dead))
       elements.push(tds)
       table.appendChild(tr)
       for(let i = 0; i < columns; i++) {
        let td = document.createElement('td')
        tds.push(td)
        tr.appendChild(td)
       }
        
    }
}
function draw(){
    for (let i = 0; i < rows; i++) {
       for (let j = 0; j < columns; j++) {
         elements[i][j].setAttribute('class','cell '+ (cells[i][j]==1? 'live' : 'dead'))
         elements[i][j].setAttribute('data-position', [i]+'-'+[j])
       }
        
    }
}

function neigbour(x,y){
    let count = 0
    let currentrow = cells[x]
    let toprow = cells[x - 1] || []
    let downrow = cells[x + 1] || []

    for(let i = y-1; i <= y+1; i++){
        if(toprow[i]){
            if(toprow[i] == alive){
                count++;
            }
        }
        if(downrow[i]){
            if(downrow[i] == alive){
                count++;
            }
        }
    }
    if(currentrow[y-1] == alive){
        count++;
    } 
    if(currentrow[y+1] == alive){
        count++;
    } 
    return count
}

function newGen(){
     let newCells = []
     for (let i = 0; i < rows; i++) {
       newCells.push(new Array(columns).fill(dead)) 
     }
     for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let neigbours = neigbour(i,j)
            
            
            if(cells[i][j] == alive && neigbours < 2){
                newCells[i][j] = dead
            }
            if(cells[i][j] == alive && (neigbours == 2 || neigbours == 3)){
                newCells[i][j] = alive
            }
            if(cells[i][j] == alive && neigbours > 3){
                newCells[i][j] = dead
            }
            if(cells[i][j] == dead && neigbours == 3){
                newCells[i][j] = alive
            }
        }
        
     }
     cells = newCells
     liveCells = countLiveCells()
     document.querySelector('.livecells').innerHTML = `Live Cells:<strong>  ${liveCells}</strong> `
     document.querySelector('.step').innerHTML = `Steps: <strong> ${currentStep++}</strong> `
     draw()
}


function start(){
    let cellcount =  countLiveCells()
    if(cellcount == 0) return
    if(runing) return
   interval = setInterval(()=>{
    newGen()
   },500)
    runing = true
   
}

// count live cells
function countLiveCells() {
count = 0
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
        if(cells[i][j] == alive) count ++
     }      
}
return count
}

// stop/pause 
function stop(){
if(!runing) return
clearInterval(interval)
runing = false
}

// clear
function clearGrid(){
let newCells = []
     for (let i = 0; i < rows; i++) {
       newCells.push(new Array(columns).fill(dead)) 
 }
 cells = newCells
 stop()
 draw()
 liveCells = 0
 currentStep = 0
 document.querySelector('.livecells').innerHTML = `Live Cells:<strong>  ${0}</strong> `
 document.querySelector('.step').innerHTML = `Steps: <strong> ${0}</strong> `

}
// next 
function next(){
    let cellcount =  countLiveCells()
    if(cellcount == 0) return
    if(runing) return
    newGen()
}







// kill or give live to cells
function setStatus(){
   let pos = this.dataset.position.split('-')
   cells[pos[0]][pos[1]] = cells[pos[0]][pos[1]] == 1?0:1
   draw()
}

document.querySelector('.start').addEventListener('click', start)
document.querySelector('.stop').addEventListener('click', stop)
document.querySelector('.next').addEventListener('click', next)
document.querySelector('.clear').addEventListener('click', clearGrid)


// initialize cells
function initializeCells(){
    createCellGrid();
    draw();
    document.querySelectorAll('.cell').forEach(elm=>elm.addEventListener('click',setStatus))
}
initializeCells()