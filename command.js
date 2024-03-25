import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import config from "./config.js";

class AI {
    /**
 * 
 * @param {Object} options 
 * @param {string} options.apiKey 
 * @param {string} options.model 
 */
    constructor() {
        this.gpt = new OpenAI({ apiKey: config.gpt })
        this.gemini = new GoogleGenerativeAI(config.gemini);
    }


    /**
 * 
 * @param {string} prompt 
 * @returns {Promise<string>}
 */
    async geminiText(prompt) {
        const model = this.gemini.getGenerativeModel({ model: "gemini-pro" })
        const result = await model.generateContent(prompt)
        const res = await result.response;
        const text = res.text();
        return text;
    }
    /**
 * 
 * @param {string} prompt 
 * @returns {Promise<string>}
 */
    async gptText(prompt) {
        const chat = await this.gpt.chat.completions.create({
            messages: [
                { role: 'system', content: "Selalu balas percakapan dalam bahasa indonesia" },
                { role: 'user', content: prompt }
            ],
            temperature: 0.5,
            model: 'gpt-3.5-turbo-16k-0613'
        })
        return chat.choices[0].message.content
    }

}

export default new AI()