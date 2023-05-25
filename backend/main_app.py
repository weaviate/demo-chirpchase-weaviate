import openai
import os
import json
from termcolor import colored

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
    print(colored("Backend: Open AI API Key available", "green"))
else:
    print(colored("Backend: Open AI API Key not available", "yellow"))

# Additional Prompt Features
promptFormat = """
Please return the output in this specific JSON format: {"<TOPIC>":"<RESULT>"} , where <TOPIC> is the topic of the generated <RESULT>. Make sure that the TOPIC does not contain any characters that might break the JSON. Make sure it can be parsed.
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
        print(
            colored(
                f"Backend: {datasetPath} does not exist. Using dummy_dataset.bin",
                "yellow",
            )
        )
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
    print(colored(f"Backend: Imported {len(data)} Tweets", "green"))
    return data


def importPrompts(promptDir: Path) -> dict:
    """This script imports all *.txt files inside the prompt directory
    @parameter promptDir: Path - Path to the prompt directory containing all prompt.txt files
    """

    data = {}

    if not promptDir.exists():
        print(colored(f"Backend: {promptDir} does not exist.", "yellow"))
        return

    for file in os.listdir(promptDir):
        filename = file.replace(".txt", "")
        with open(promptDir / file, "r") as reader:
            data[filename] = reader.read()
    print(colored(f"Backend: Imported {len(data)} Prompts", "green"))
    return data


def importContexts(contextDir: Path) -> dict:
    """This script imports all *.txt files inside the context directory
    @parameter contextDir: Path - Path to the context directory containing all contexts.txt files
    """

    data = {}

    if not contextDir.exists():
        print(colored(f"Backend: {contextDir} does not exist.", "yellow"))
        return

    for file in os.listdir(contextDir):
        filename = file.replace(".txt", "")
        with open(contextDir / file, "r") as reader:
            data[filename] = reader.read()
    print(colored(f"Backend: Imported {len(data)} Contexts", "green"))
    return data


def saveResults(
    resultDir: Path, responseDict: dict, payload: ProcessTweetsPayload
) -> None:
    """This script saves the results produced by the LLM API locally and determines their filename based on the current datetime.
    @parameter resultDir: Path - Path to the context directory containing all contexts.txt files
    @parameter responseDict: dict - Constructed JSON sent to the Frontend containing all results from the LLM
    @parameter payload: ProcessTweetsPayload - Payload sent from the frontend containing all selected tweets and tags
    """
    now = datetime.now()

    saveDict = {
        "results": responseDict,
        "tweets": [tweet.tweet for tweet in payload.tweets],
        "tags": payload.tags,
    }

    if not resultDir.exists():
        resultDir.mkdir()
        print(colored(f"{resultDir} not found. Creating directory", "yellow"))

    dtString = now.strftime("%d%m%Y%H%M%S") + ".json"
    with open(resultDir / dtString, "w") as writer:
        json.dump(saveDict, writer)
    print(colored(f"Backend: Results saved in {resultDir / dtString}", "green"))


def authenticate_user(pw: str):
    correct_password = "rudiwella"
    if pw != correct_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return {"message": "Successful"}


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


@app.get("/refresh")
async def getRefreshedTweets():
    return JSONResponse(content=importData(Path("./data_api/dataset.bin")))


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

    # Showcase
    if openai.api_key == "":
        responseDict = {"✅ This is a showcase!": "Here are some dummy results..."}
        if payload.tags:
            responseDict["✨ Context"] = f"Including context {str(payload.tags)}"
            prompt += "Please use these information as additional context when creating content: "
            for tag in payload.tags:
                prompt += contexts[tag]
        responseDict[
            "🧠 Exploration vs Exploitation"
        ] = "Jina AI recognizes the importance of balancing exploration and exploitation in AI research. With a diverse ecosystem of resources and contributions, Jina encourages innovation while providing developers with efficient pipelines and methods to build reliable and effective AI applications."
        responseDict[
            "🧠 Flexible AI Framework"
        ] = "Jina AI offers flexibility in its approach to building AI applications. Users can develop their own data pipelines, models, and training loops while taking advantage of Jina's powerful ecosystem to create highly customized and performant applications."
        responseDict[
            "🧠 ChatGPT Engineering"
        ] = "Jina AI is always looking for exceptional talent to join our team and help develop advanced AI applications for multimodal search. If you possess exceptional skills, consider exploring careers at Jina AI to work on exciting projects, push the boundaries, and create powerful AI-powered solutions."
        responseDict["📝 Prompt"] = prompt
        return JSONResponse(content=responseDict)
    # Production
    else:
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": prompt,
                    },
                    {
                        "role": "user",
                        "content": str([tweet.tweet for tweet in payload.tweets]),
                    },
                ],
            )

            # Format results
            responseDict = {"✅ Loading done!": "Here are the results..."}

            if payload.tags:
                responseDict["✨ Context"] = f"Including context {str(payload.tags)}"
                prompt += "Please use these information as additional context when creating content: "
                for tag in payload.tags:
                    prompt += contexts[tag]

            for choice in response["choices"]:
                content = choice["message"]["content"]
                try:
                    contentJSON = json.loads(str(content))
                except Exception as e:
                    print(colored(str(e), "red"))
                    saveResults(Path("./data_api/outputs/"), responseDict, payload)
                    return {
                        "⚠️ error": "JSON Validation went wrong! ",
                        "⚠️ error_message": str(e),
                        "📝 results": str(content),
                    }
                if contentJSON:
                    for topic in contentJSON:
                        if topic not in responseDict:
                            responseDict["🧠 " + topic] = contentJSON[topic]

            responseDict["📝 Prompt"] = prompt

            saveResults(Path("./data_api/outputs/"), responseDict, payload)
            return JSONResponse(content=responseDict)

        except Exception as e:
            print(colored(str(e), "red"))
            return {"⚠️ error": "Something went wrong! ", "error_message": str(e)}


@app.get("/login")
async def login(request: Request):
    return authenticate_user(request.headers.get("password",""))

