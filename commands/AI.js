import { GoogleGenerativeAI } from "@google/generative-ai"

const Ai = {
    name: "AI",
    description: "chat dengan AI",
    alias: ["ai"],
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database) {
        const genAI = new GoogleGenerativeAI(process.env.palmApiKey);

        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        const prompt = text

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = response.text();

        await sock.sendMessage(
            senderNumber,
            {text: answer},
            {quoted: messages[0]},
            1000
        )
    },
}

export default Ai