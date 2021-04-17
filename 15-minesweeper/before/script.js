// Display/UI

// 1. Populate board with tiles/mines
import {
    TILE_STATUSES,
    createBoard, 
    markTile, 
    revealTile,
    checkWin,
    checkLose
} from './minesweeper.js'

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 5

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector('.board');
const minesLeftText = document.querySelector('[data-mine-count]')
const subtext = document.querySelector('.subtext')

// console.table(board)
board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element)
        tile.element.addEventListener('click',() => {
            revealTile(board, tile)
            checkGameEnd()
        })
        tile.element.addEventListener('contextmenu',e => {
            e.preventDefault();
            markTile(tile);
            listMinesLeft()
        })
    })
})
boardElement.style.setProperty("--size", BOARD_SIZE)
minesLeftText.textContent = NUMBER_OF_MINES

function listMinesLeft() {
    const markedTileCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status == TILE_STATUSES.MARKED).length
    },0)
    minesLeftText.textContent = NUMBER_OF_MINES - markedTileCount
}

function checkGameEnd(){
    const win = checkWin(board)
    const lose = checkLose(board)

    if (win || lose) {
        // Désactiver la possibilité de cliquer sur les tuiles
        boardElement.addEventListener('click', stopProp, {capture : true})
        boardElement.addEventListener('contextMenu', stopProp, {capture : true})

        if (win) {
            subtext.textContent = 'You win!'
        } else {
            subtext.textContent = 'You lose!'
            board.forEach(row => {
                row.forEach(tile => {
                    if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
                    if (tile.mine) revealTile(board, tile)
                })
            })
        }
    }
}

function stopProp(e) {
    e.stopImmediatePropagation()
}

// 4. Check for win/lose

