const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "",
	description: "",
	usage: "None",
	data: new SlashCommandBuilder()
		.setName('surrender')
		.setDescription('Surrenders to your opponent'),
	async execute({ interaction, client }) {
		await interaction.deferReply();
	},
};