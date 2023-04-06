const Canvas = require('canvas');
const fs = require('fs');

exports.subStrBetweenChar = subStrBetweenChar
exports.randomColor = randomColor
exports.shortenText = shortenText
exports.drawBoard = drawBoard
exports.randomizePositions = randomizePositions

function subStrBetweenChar(string, start, end) {
	return string.split(start)[1].split(end)[0]
}
function randomColor() {
	return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
function shortenText(text, delimiter, max) {
	if (text.length <= max) return text;
	else {
		newText = text.toString().split(delimiter.toString())
		newText.pop();
		return shortenText(newText.join(delimiter), delimiter, max);
	}
}
async function drawBoard(configuration) {
	let canvas = Canvas.createCanvas(240, 240);
	let context = canvas.getContext('2d');
	for (i = 0; i < 8; i++) {
		for (j = 0; j < 8; j++) {
			if ((i + j) % 2 == 0) {
				context.fillStyle = '#EEEED2';
			} else {
				context.fillStyle = '#769656';
			}
			context.fillRect(i * 30, j * 30, 30, 30);
		}
	}
	context.fillStyle = '#000000';
	context.font = '30px Arial';
	let piecesConfig = configuration.pieces;
	let colrows = {
		'A': 0,
		'B': 30,
		'C': 60,
		'D': 90,
		'E': 120,
		'F': 150,
		'G': 180,
		'H': 210,
		'8': 30,
		'7': 60,
		'6': 90,
		'5': 120,
		'4': 150,
		'3': 180,
		'2': 210,
		'1': 240
	}
	for (i in piecesConfig) {
		let piece = piecesConfig[i]
		let letter = i.substr(0, 1)
		let number = i.substr(1, 1)
		let pieceToLoad = await loadPiece(piece)
		context.drawImage(pieceToLoad, colrows[letter], colrows[number] - 30, 30, 30)
	}
	context.fillStyle = '#000000';
	context.font = '12px Arial';
	context.fillText('8', 2, 10)
	context.fillText('7', 2, 40)
	context.fillText('6', 2, 70)
	context.fillText('5', 2, 100)
	context.fillText('4', 2, 130)
	context.fillText('3', 2, 160)
	context.fillText('2', 2, 190)
	context.fillText('1', 2, 220)
	context.fillText('A', 20, 238)
	context.fillText('B', 50, 238)
	context.fillText('C', 80, 238)
	context.fillText('D', 110, 238)
	context.fillText('E', 140, 238)
	context.fillText('F', 170, 238)
	context.fillText('G', 200, 238)
	context.fillText('H', 230, 238)
	return canvas.toBuffer('image/png')
}

async function loadPiece(piece) {
	let pieceCanvas = Canvas.createCanvas(30, 30)
	let pieceCtx = pieceCanvas.getContext('2d')
	let piecePallete = {
		'r': [0, 0],
		'n': [125, 0],
		'b': [250, 0],
		'p': [0, 125],
		'k': [125, 125],
		'q': [250, 125],
		'P': [0, 250],
		'K': [125, 250],
		'Q': [250, 250],
		'R': [0, 375],
		'N': [125, 375],
		'B': [250, 375],
	}
	let pieceToLoad = await Canvas.loadImage('./database/assets/chess_pallete.png') 
	pieceCtx.drawImage(pieceToLoad, piecePallete[piece][0], piecePallete[piece][1], 125, 125, 0, 0, 30, 30)
	return pieceCanvas
}

function randomizePositions() {
	let totalSpaces = ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1"]
	let newRow = {
		"A1": "",
		"B1": "",
		"C1": "",
		"D1": "",
		"E1": "",
		"F1": "",
		"G1": "",
		"H1": ""
	};
	let Bl = ["B1", "D1", "F1", "H1"]
	let Bd = ["A1", "C1", "E1", "G1"]

	let Blpos = Bl[Math.floor(Math.random() * Bl.length)];
	totalSpaces.splice(totalSpaces.indexOf(Blpos), 1);
	let Bdpos = Bd[Math.floor(Math.random() * Bd.length)];
	totalSpaces.splice(totalSpaces.indexOf(Bdpos), 1);
	let queenPos = totalSpaces[Math.floor(Math.random() * totalSpaces.length)];
	totalSpaces.splice(totalSpaces.indexOf(queenPos), 1);
	let k1 = totalSpaces[Math.floor(Math.random() * totalSpaces.length)];
	totalSpaces.splice(totalSpaces.indexOf(k1), 1);
	let k2 = totalSpaces[Math.floor(Math.random() * totalSpaces.length)];
	totalSpaces.splice(totalSpaces.indexOf(k2), 1);

	newRow[Blpos] = 'B'
	newRow[Bdpos] = 'B'
	newRow[queenPos] = "Q"
	newRow[k1] = 'N'
	newRow[k2] = 'N'

	for (let pos in newRow) if (newRow[pos] == '') { newRow[pos] = 'R'; break }
	for (let pos in newRow) if (newRow[pos] == '') { newRow[pos] = 'K'; break }
	for (let pos in newRow) if (newRow[pos] == '') { newRow[pos] = 'R'; break }
	newRow["A8"] = newRow["A1"].toLowerCase()
	newRow["B8"] = newRow["B1"].toLowerCase()
	newRow["C8"] = newRow["C1"].toLowerCase()
	newRow["D8"] = newRow["D1"].toLowerCase()
	newRow["E8"] = newRow["E1"].toLowerCase()
	newRow["F8"] = newRow["F1"].toLowerCase()
	newRow["G8"] = newRow["G1"].toLowerCase()
	newRow["H8"] = newRow["H1"].toLowerCase()
	return newRow
}