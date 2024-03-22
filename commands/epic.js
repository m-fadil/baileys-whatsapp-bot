import axios from 'axios';

const Epic = {
	name: 'epic',
	description: 'ping',
	alias: ['epic-games', 'free-games', 'eg'],
	async execute(args) {
		const { sendWithTyping } = args;

		const freeGames = await axios({
			method: 'get',
			url: 'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions',
		}).then((cb) =>
			cb.data.data.Catalog.searchStore.elements.filter((game) => game.price.totalPrice.discountPrice == 0),
		);

		for (const game of freeGames) {
			const date = new Date(game.promotions.promotionalOffers[0].promotionalOffers[0].endDate)
			const tanggal = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
			const jam = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

			const caption = `*${game.title}*\n\nGratis hingga ${tanggal}, ${jam} WIB\n\nLink:\nhttps://store.epicgames.com/en-US/p/${game.catalogNs.mappings[0].pageSlug}`;

			await sendWithTyping(args, {
				image: { url: game.keyImages.find((img) => img.type == 'Thumbnail').url },
				caption,
			});
		}
	},
};

export default Epic;
