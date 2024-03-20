const Echo = {
	name: 'echo',
	description: 'mengembalikan value yang dimasukkan',
	alias: ['print', 'ec'],
	async execute(args) {
		const { messages, pesan, sendWithTyping } = args;
		const [_, ...kata] = pesan.split(' ');

		await sendWithTyping(args, { text: kata.join(' ') }, { quoted: messages });
	},
};

export default Echo;
