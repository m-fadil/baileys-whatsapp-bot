import { GoogleGenerativeAI } from "@google/generative-ai"

const Ai = {
    name: "AI",
    description: "chat dengan AI",
    alias: ["ai"],
    async execute(args) {
        const { messages, pesan, sendWithTyping } = args

        const genAI = new GoogleGenerativeAI(process.env.palmApiKey);

        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        const prompt = pesan

        const result = await model.generateContent(prompt);
        const response = result.response;
        const answer = response.text();

        await sendWithTyping(
            args,
            {text: answer},
            {quoted: messages}
        )
    },
}

export default Ai