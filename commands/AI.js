import { GoogleGenerativeAI } from "@google/generative-ai"

const Ai = {
    name: "AI",
    description: "chat dengan AI",
    alias: ["ai"],
    async execute(args) {
        const { sock, messages, remoteJid, pesan } = args

        const genAI = new GoogleGenerativeAI(process.env.palmApiKey);

        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        const prompt = pesan

        const result = await model.generateContent(prompt);
        const response = result.response;
        const answer = response.text();

        await sendTyping(args).then(async () => {
            await sock.sendMessage(
                remoteJid,
                {text: answer},
                {quoted: messages}
            )
        })
    },
}

export default Ai