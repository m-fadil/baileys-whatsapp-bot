import axios from "axios";

const Epic = {
	name: "epic",
	description: "ping",
	alias: ["epic-games", "free-games", "eg"],
	private: false,
	async execute(args) {
		const { sendWithTyping } = args;

		const freeGames = await axios({
			method: "get",
			url: "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions",
		}).then((cb) =>
			cb.data.data.Catalog.searchStore.elements.filter((game) => game.price.totalPrice.discountPrice == 0)
		);

		for (const game of freeGames) {
			await sendWithTyping(args, {
				image: { url: game.keyImages.find((img) => img.type == "Thumbnail").url },
				caption: `*${game.title}*\n\nLink:\nhttps://store.epicgames.com/en-US/p/${game.catalogNs.mappings[0].pageSlug}`,
			});
		}
	},
};

export default Epic;
