const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
module.exports = {
	name: "Move",
	description: "Moves from one space to another!",
	usage: "<from> <to>",
	data: new SlashCommandBuilder()
		.setName('move')
		.setDescription('Moves the specified piece to the location')
		.addStringOption(option => option
			.setName('from')
			.setDescription('Where from?')
			.setRequired(true))
		.addStringOption(option => option
			.setName('to')
			.setDescription('Where to?')
			.setRequired(true)),
	async execute({ interaction, ChessEngine, functions }) {
		await interaction.deferReply();
		const players = JSON.parse(fs.readFileSync('./database/misc/players.json'));
		let matchID = players[interaction.user.id];
		let match = JSON.parse(fs.readFileSync(`./database/misc/${matchID}.json`));
		if (!players[interaction.user.id]) return interaction.editReply('You don\'t have a match ongoing yet! Start one with /create')
		if (match[match.board.turn] != interaction.user.id) return interaction.editReply(`It's not your turn yet dumbass`)
		let from = interaction.options.getString('from');
		let to = interaction.options.getString('to');
		let game = new ChessEngine.Game(match.board);
		try { game.move(from, to) } catch (e) { return interaction.editReply(`Your move from ${from} to ${to} failed\n${e.message}`) }
		match.board = game.exportJson()
		let board = await functions.drawBoard(match.board)
		fs.writeFileSync(`./database/misc/${matchID}.json`, JSON.stringify(match));
		interaction.editReply({ content: `You've moved from ${from} to ${to}! It's the other player's turn!`, files: [new AttachmentBuilder(board)] });
		if (match.board.isFinished) {
			delete players[match.white];
			delete players[match.black];
			fs.writeFileSync('./database/misc/players.json', JSON.stringify(players, null, 2));
			return interaction.editReply(`<@${match[match.board.turn]}> has won the game! Checkmate to y'all`)
		}
		return
	},
};