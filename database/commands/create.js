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

		let players = JSON.parse(fs.readFileSync('./database/misc/players.json'));
		let user = interaction.options.getUser('user');
		let side = interaction.options.getString('side');

		if (players[interaction.user.id]) return interaction.editReply('You\'ve a match already! Check it with /board');
		if (players[user.id]) return interaction.editReply('You\'ve a match already! Check it with /board');

		let matchID = Math.floor((Math.random() * 10000000) + 9000000).toString(36)
		let isMatcherWhite = (side == 'r' ? (Math.round(Math.random() + 1) == 1 ? true : false) : (side == 'w' ? true : false))
		let game = new ChessEngine.Game()

		let randPos = functions.randomizePositions()
		for (let pos in randPos) {
			randPos[pos]
			game.setPiece(pos, randPos[pos])
		}
		// console.log(game.exportJson())
		//rook
		//bishop
		//knight
		let newMatch = {
			board: game.exportJson(),
			white: isMatcherWhite ? interaction.user.id : user.id,
			black: isMatcherWhite ? user.id : interaction.user.id
		}

		players[interaction.user.id] = matchID;
		players[user.id] = matchID;

		fs.writeFileSync(`./database/misc/${matchID}.json`, JSON.stringify(newMatch, null, 2))
		fs.writeFileSync(`./database/misc/players.json`, JSON.stringify(players, null, 2));

		let board = await functions.drawBoard(game.exportJson())
		return interaction.editReply({ content: `Match created! You're ${isMatcherWhite ? 'white' : 'black'}, <@${user.id}> is ${!isMatcherWhite ? 'white' : 'black'}!`, files: [new AttachmentBuilder(board)] })
	},
};