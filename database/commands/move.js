const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "",
	description: "",
	usage: "None",
	data: new SlashCommandBuilder()
		.setName('move')
		.setDescription('Moves the specified piece to the location'),
	async execute({ interaction, client }) {
		await interaction.deferReply();
	},
};