const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const functions = require('../bot/functions');
module.exports = {
	name: "Board",
	description: "Lets your view your current match's board",
	usage: "None",
	data: new SlashCommandBuilder()
		.setName('board')
		.setDescription('Shows your current board!'),
	async execute({ interaction }) {
		const players = JSON.parse(fs.readFileSync('./database/misc/players.json'));
		if (!players[interaction.user.id]) return interaction.reply('You don\'t have a match ongoing yet! Start one with /create')
		let matchID = players[interaction.user.id];
		let match = JSON.parse(fs.readFileSync(`./database/misc/${matchID}.json`));
		let board = await functions.drawBoard(match.board);
		return interaction.reply({ content: "This is your board!", files: [new AttachmentBuilder(board)] })

	},
};