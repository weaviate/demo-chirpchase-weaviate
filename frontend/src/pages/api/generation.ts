import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from 'openai';
import os from 'os';
import { Tweet } from "../../components/dropzone";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (OPENAI_API_KEY) {
  console.log("Open AI API Key available");
} else {
  console.log("Open AI API Key not available");
}

const promptFormat = `
Return your output in this specific JSON format: {TOPIC:CONTENT, TOPIC2:CONTENT2} , where TOPIC is the topic of the generated CONTENT. Make sure that the TOPIC does not contain any characters that might break the JSON. Generate at least ten new different content snippets.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const payload = req.body;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  let prompt = `${payload.input_text} \n ${promptFormat}`;
  for (const tag of payload.tags) {
    prompt += "Please use these information as additional context when creating content: ";
    prompt += payload.contexts[tag];
  }

  const system_prompt = prompt;
  const user_message = payload.tweets.map((tweet: Tweet) => tweet.tweet).join(", ");

  for (let i = 0; i < 3; i++) {
    let cache_id = "";
    let responseDict: { [key: string]: string } = {};

    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: system_prompt },
          { role: 'user', content: user_message }
        ],
        model: 'gpt-4',
      });

      responseDict["✅ Loading done!"] = "Here are the results...";

      if (payload.tags) {
        responseDict["✨ Context"] = `Including context ${payload.tags.join(', ')}`;
      }

      const content = chatCompletion.choices[0]?.message?.content;

      let contentJSON;
      try {
        contentJSON = JSON.parse(content ? content : "");
      } catch (e) {
        console.warn(`JSON Validation failed at ${i}`);
        continue;
      }

      if (contentJSON) {
        for (let topic in contentJSON) {
          if (!responseDict[topic]) {
            let formatted_topic = topic.replace("_", " ");
            responseDict["🧠 " + formatted_topic] = contentJSON[topic];
          }
        }
      } else {
        console.warn(`JSON Validation failed at ${i}`);
        continue;
      }

      responseDict["📝 Prompt"] = prompt;
      responseDict["📝 Input"] = user_message;

      const formatted_datetime = new Date().toISOString().split('.')[0];
      cache_id = `${payload.prompt} ${formatted_datetime}`;
      return res.status(200).json(responseDict);

    } catch (error) {
      const errMsg = (error as Error).message || "Unknown error";
      responseDict = {
        "⚠️ Error occured": "Something went wrong!",
        "Error": errMsg,
        "Prompt": prompt,
      };
    };
    continue;
  }

  const finalResponse = {
    "⚠️ Error occured": "Something went wrong!",
    "Error": "Was not able to generate new content!",
    "Prompt": prompt,
  };

  return res.status(500).json(finalResponse);
}
