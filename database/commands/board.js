const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "",
	description: "",
	usage: "None",
	data: new SlashCommandBuilder()
		.setName('board')
		.setDescription('Shows your current board!'),
	async execute({ interaction, client }) {
		await interaction.deferReply();
	},
};