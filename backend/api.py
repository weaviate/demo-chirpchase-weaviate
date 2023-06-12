import openai
import os
import json
from wasabi import msg

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.middleware.cors import CORSMiddleware
from docarray import DocumentArray  # type:ignore[import]
from pathlib import Path
from pydantic import BaseModel
from typing import List
from datetime import datetime

# Open AI API Key
openai.api_key = os.environ.get("OPENAI_API_KEY", "")
if openai.api_key != "":
    msg.good("Open AI API Key available")
else:
    msg.warn("Open AI API Key not available")

# Additional Prompt Features
promptFormat = """
Return the output in this specific JSON format: {"<TOPIC1>":"<RESULT1>", "<TOPIC2>":"<RESULT2>", "<TOPIC3>":"<RESULT3>"} , where <TOPIC> is the topic of the generated <RESULT>. 
Make sure that the TOPIC does not contain any characters that might break the JSON. Return at least five tweets which the character size limited to 280.
"""

security = HTTPBasic()

# FastAPI App
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Types
class Tweet(BaseModel):
    id: str
    user: str
    tweet: str
    likes: int
    date: str


class ProcessTweetsPayload(BaseModel):
    input_text: str
    tags: List[str]
    tweets: List[Tweet]


# Functions
def importData(datasetPath: Path) -> list[dict]:
    """This script imports the processed DocArray containing all Tweets
    @parameter datasetPath: Path - Path to the DocArraz.bin file
    """
    data = []
    if not datasetPath.exists():
        msg.warn(f"{datasetPath} does not exist. Using dummy_dataset.bin")
        return importData(Path("./data_api/dummy_dataset.bin"))

    docArray = DocumentArray.load_binary(datasetPath)
    for doc in docArray:
        data.append(
            {
                "id": doc.id,
                "user": doc.tags["user"],
                "tweet": doc.text.strip(),
                "date": doc.tags["date"][:10],
                "likes": doc.tags["likeCount"],
                "profileImage": doc.tags["profileImageURL"],
                "url": doc.tags["url"],
                "userTags": doc.tags["userTags"],
            }
        )
    msg.good(f"Imported {len(data)} Tweets")
    return data


def importPrompts(promptDir: Path) -> dict:
    """This script imports all *.txt files inside the prompt directory
    @parameter promptDir: Path - Path to the prompt directory containing all prompt.txt files
    """

    data = {}

    if not promptDir.exists():
        msg.warn(f"{promptDir} does not exist.")
        return

    for file in os.listdir(promptDir):
        filename = file.replace(".txt", "")
        with open(promptDir / file, "r") as reader:
            data[filename] = reader.read()
    msg.good(f"Imported {len(data)} Prompts")
    return data


def importContexts(contextDir: Path) -> dict:
    """This script imports all *.txt files inside the context directory
    @parameter contextDir: Path - Path to the context directory containing all contexts.txt files
    """

    data = {}

    if not contextDir.exists():
        msg.warn(f"{contextDir} does not exist.")
        return

    for file in os.listdir(contextDir):
        filename = file.replace(".txt", "")
        with open(contextDir / file, "r") as reader:
            data[filename] = reader.read()
    msg.good(f"Imported {len(data)} Contexts")
    return data


# Import Data
tweets = importData(Path("./data_api/dataset.bin"))
prompts = importPrompts(Path("./data_api/prompts/"))
contexts = importContexts(Path("./data_api/contexts/"))


# Endpoints
@app.get("/")
async def root():
    return {"message": len(tweets)}


@app.get("/health")
async def root():
    return {"message": "Alive!"}


@app.get("/tweets")
async def getTweets():
    return JSONResponse(content=tweets)


@app.get("/prompts")
async def getPrompts():
    return JSONResponse(content=prompts)


@app.get("/context")
async def getContext():
    return JSONResponse(content=contexts)


@app.post("/process_tweets")
async def process_tweets(payload: ProcessTweetsPayload):
    """Process the Payload sent by the Frontend, send API request to Open AI API, receive and format the results and send them back to the frontend
    @parameter payload : ProcessTweetsPayload - Payload sent by the frontend containing the prompt, tweets and context tags
    @returns JSONResponse - JSON containing the results
    """
    prompt = f"{payload.input_text} \n {promptFormat}"
    for tag in payload.tags:
        prompt += (
            "Please use these information as additional context when creating content: "
        )
        prompt += contexts[tag]

    # Showcase
    if openai.api_key == "":
        responseDict = {"✅ This is a showcase!": "Here are some dummy results..."}
        if payload.tags:
            responseDict["✨ Context"] = f"Including context {str(payload.tags)}"
        responseDict["🧠 Topic"] = "This is a generated Tweet"
        responseDict["📝 Prompt"] = prompt
        return JSONResponse(content=responseDict)

    # Production
    else:
        system_prompt = prompt
        user_message = str([tweet.tweet for tweet in payload.tweets])

        for i in range(3):
            try:
                response = openai.ChatCompletion.create(
                    model="gpt-4",
                    messages=[
                        {
                            "role": "system",
                            "content": system_prompt,
                        },
                        {
                            "role": "user",
                            "content": user_message,
                        },
                    ],
                )
            except Exception as e:
                responseDict = {"⚠️ Error occured": "Something went wrong!"}
                responseDict["Error"] = str(e)
                responseDict["Prompt"] = str(prompt)
                msg.warn(f"API failed at {i}")
                continue

            # Format results
            responseDict = {"✅ Loading done!": "Here are the results..."}

            if payload.tags:
                responseDict["✨ Context"] = f"Including context {str(payload.tags)}"

            contentJSON = None
            content = response["choices"][0]["message"]["content"]
            print(content)
            try:
                contentJSON = json.loads(str(content))
            except Exception as e:
                system_prompt += ". Your other job is to correct any given results if they dont match the output format"
                user_message = f"JSON Parsing failed {str(e)} please correct your provided result {content}"
                msg.warn(f"JSON Validation failed at {i}")
                continue
            if contentJSON:
                for topic in contentJSON:
                    if topic not in responseDict:
                        responseDict["🧠 " + topic] = contentJSON[topic]
            else:
                continue

            responseDict["📝 Prompt"] = prompt
            responseDict["📝 Input"] = user_message
            return JSONResponse(content=responseDict)

        responseDict = {"⚠️ Error occured": "Something went wrong!"}
        responseDict["Error"] = "Was not able to generate new content!"
        responseDict["Prompt"] = str(prompt)
        return JSONResponse(content=responseDict)
