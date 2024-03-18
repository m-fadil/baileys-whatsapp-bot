async function getCollection(args) {
    const { sock, database, messages } = args
    const remoteJid = messages.key.remoteJid

	const grup = await sock.groupMetadata(remoteJid);
    const coll_tag = database.collection("tag");
    const tags = await coll_tag.findOne({ title: grup.id }).then(async (result) => {
        if (!result) {
            const data = {
                title: grup.id,
                roles: [],
            };
            await coll_tag.insertOne(data);
        }
        return await coll_tag.findOne({ title: grup.id });
    });
    const roles = tags.roles.map((role) => role.name);

    return { coll_tag, tags, roles, grup }
}

export default getCollection