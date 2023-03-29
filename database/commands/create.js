const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
module.exports = {
	name: "Create",
	description: "Creates a new match between you and your rival",
	usage: "<user>, <side>",
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Create a new match between you and your rival')
		.addUserOption(option => option
			.setName('user')
			.setDescription('Your rival to rival')
			.setRequired(true))
		.addStringOption(option => option
			.setName('side')
			.setDescription('Choose or have one choosed for you')
			.setChoices(
				{ name: "White", value: 'w' },
				{ name: "Black", value: 'b' },
				{ name: "Random", value: 'r' }
			)
			.setRequired(true)),
	async execute({ interaction, ChessEngine, functions }) {
		await interaction.deferReply();
		let user = interaction.options.getUser('user');
		let side = interaction.options.getString('side');
		let matchID = Math.floor((Math.random() * 10000000) + 9000000).toString(36)
		let isMatcherWhite = (side == 'r' ? (Math.round(Math.random()) == 1 ? true : false) : (side == 'w' ? true : false))
		let game = new ChessEngine.Game()
		//Randomizes the pieces so you have a board of 960 chess
		let possibleWhitePlaces = [
			'A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4',
			'A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'H3',
			'A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1'
		]
		let possibleBlackPlaces = [
			'A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5', 'H5',
			'A6', 'B6', 'C6', 'D6', 'E6', 'F6', 'G6', 'H6',
			'A8', 'B8', 'C8', 'D8', 'E8', 'F8', 'G8', 'H8'
		]
		//rook
		//bishop
		//knight
		let newMatch = {
			board: game.exportJson(),
			white: isMatcherWhite ? interaction.user.id : user.id,
			black: isMatcherWhite ? user.id : interaction.user.id
		}
		fs.writeFileSync(`./database/misc/${matchID}.json`, JSON.stringify(newMatch, null, 2))
		let board = await functions.drawBoard(game.exportJson())
		return interaction.editReply({ content: 'Match created!', files: [new AttachmentBuilder(board)] })
	},
};