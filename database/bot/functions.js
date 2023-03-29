const Canvas = require('canvas');
const fs = require('fs');
exports.subStrBetweenChar = subStrBetweenChar
exports.randomColor = randomColor
exports.shortenText = shortenText
exports.exportBoard = exportBoard
exports.drawBoard = drawBoard

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
async function exportBoard(configuration, canvas) {
	let context = canvas.getContext('2d');
	context.fillStyle = '#000000';
	context.font = '30px Arial';
	var piecesConfig = configuration.pieces;
	const pieces = {
		'k': 'kb',
		'q': 'qb',
		'r': 'rb',
		'b': 'bb',
		'n': 'nb',
		'p': 'pb',
		'K': 'kw',
		'Q': 'qw',
		'R': 'rw',
		'B': 'bw',
		'N': 'nw',
		'P': 'pw'
	}
	var columns = {
		'A': 0,
		'B': 30,
		'C': 60,
		'D': 90,
		'E': 120,
		'F': 150,
		'G': 180,
		'H': 210
	}
	var rows = {
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
		let pieceToLoad = await Canvas.loadImage('./database/assets/' + pieces[piece] + '.png')
		await context.drawImage(pieceToLoad, columns[letter], rows[number] - 30, 30, 30)
	}
	// fs.writeFileSync('test.png', canvas.toBuffer('image/png'))
	return canvas.toBuffer('image/png')
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
	return await exportBoard(configuration, canvas)
}