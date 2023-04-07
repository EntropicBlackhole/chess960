const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
module.exports = {
	name: "Surrender",
	description: "Surrender against the enemy. Will you?",
	usage: "<username>",
	data: new SlashCommandBuilder()
		.setName('surrender')
		.setDescription('Surrenders to your opponent')
		.addStringOption(option => option
			.setName('username')
			.setDescription('Write your exact usernam, to confirm that you want to surrender')
			.setRequired(true)),
	async execute({ interaction, functions }) {
		await interaction.deferReply();
		const players = JSON.parse(fs.readFileSync('./database/misc/players.json'));
		let matchID = players[interaction.user.id];
		let match = JSON.parse(fs.readFileSync(`./database/misc/${matchID}.json`));
		if (!players[interaction.user.id]) return interaction.editReply('You don\'t have a match ongoing yet! Start one with /create')
		let username = interaction.options.getString('username');
		if (username !== interaction.user.username) return interaction.editReply(`The username does not match exactly your username, please confirm you want to surrender`);
		delete players[match.white];
		delete players[match.black];
		fs.writeFileSync('./database/misc/players.json', JSON.stringify(players, null, 2));
		try { fs.unlinkSync(`./database/misc/${matchID}.json`) } catch (e) { console.error(e.message) }
		return interaction.editReply({ content: `You have surrendered to the enemy, so game over`, files: [new AttachmentBuilder(await functions.drawBoard(match.board))] })
	},
};