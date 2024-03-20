const RemoveNote = {
	name: 'remove_note',
	description: 'menghapus catatan',
	async execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database, coll_note, draft) {
		if (text.split(' ').length >= 3) {
			let subjek = text.split(' ')[2];
			const filter = { title: draft.title };
			const updated = {
				$pull: { notes: { subject: subjek } },
			};

			if (draft.notes.find((notes) => notes.subject == subjek)) {
				await coll_note.updateOne(filter, updated).then(() => {
					commands.get('reaction').execute(sock, messages, true);
				});
			} else {
				commands.get('reaction').execute(sock, messages, false);
			}
		} else {
			commands.get('reaction').execute(sock, messages, false);
		}
	},
};

export default RemoveNote;
