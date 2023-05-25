# 🦤 ChirpChase Backend Documentation

### 🔧 Installation

Create a new python environment and install all dependencies specified in the `requirements.txt` file.

`pip install -r requirements.txt`

### ✨ Getting started!

You can run `sh data_workflow.sh` command to run the whole data workflow.

> Make sure that you specified your python environment in the script.

After the data was generated you can use `uvicorn main_app:app --reload` to start the FastAPI app!

### ⚙️ **Data Scripts** (./data_scripts)

The following scripts are used to extract and process the data for the ChirpChase App.

- `scraping_script.py` scrapes Twitter for tweets based on specific settings in a configuration file, saves the tweets in JSONL format, and then uses a collection script to merge them into one single JSON file. The script uses the snscrape tool, which is a Python package for scraping data from social media platforms.

- `collection_local_script.py` merges the extracted tweets saved in separate JSONL files into a single JSON file. The script takes two arguments: dataPath, the path to the directory containing the scraped files, and datasetPath, the path to the JSON file that will be saved at the end.

- `processing_script.py` preprocesses a dataset of tweets by selecting specific features, filtering based on certain criteria (e.g., minimum tweet size, minimum like count), and converting the selected tweets to a DocArray for further processing. The script takes three arguments: datasetPath, which is the path to the JSON file containing the dataset; outputPath, which is the path to the directory where the output binary file will be saved; and dataConfigPath, which is the path to the data configuration file.

Run `sh data_workflow.sh` to run the whole data workflow.

### ⚙️ **API**

The FastAPI app serves as a backend for the frontend application. It provides endpoints for getting tweets, prompts, and contexts, and for processing tweets using OpenAI's GPT-4 model. The processed tweets are returned to the frontend application in a JSON format.

Endpoints:

- **GET** `/`: Returns the number of imported tweets.
- **GET** `/tweets`: Returns a JSON list of all imported tweets.
- **GET** `/prompts`: Returns a JSON dictionary of imported prompts.
- **GET** `/context`: Returns a JSON dictionary of imported contexts.
- **POST** `/process_tweets`: Accepts a JSON payload containing a prompt, a list of selected tweets, and context tags. The selected tweets are passed to OpenAI's GPT-4 model for processing using the provided prompt and context tags. The results are returned to the frontend in a JSON format.

Run `uvicorn main_app:app --reload` to start the API

### 🧪 Typing, Formatting and Testing

This project uses:

- `mypy` for type checking
- `black` for formatting
- `pytest` for testing
