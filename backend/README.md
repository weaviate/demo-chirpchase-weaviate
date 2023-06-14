# 🦤 ChirpChase Backend Documentation

📚 Documentation
-----------------

This is the documentation for the Backend part of the ChirpChase Demo.

🗃️ Dataset
-----------

The folder [data_api](./data_api/) contains the `dummy_dataset.bin` which is a dummy dataset for showcase. Creating a workflow for scraping tweets and other social media and ingesting them to a Weaviate cluster is currently WIP.

📦 Requirements
----------------

1. Create a new virtual environment

- ```python3 -m venv env```
- ```source env/bin/activate```

2. Install all dependencies specified in the `requirements.txt` file

- `pip install -r requirements.txt`

3. Set the variable `OPENAI_API_KEY` (your OpenAI key needs access to the GPT-4 model):

4. Start the FastAPI app by running:

- ```uvicorn api:app --reload```

🚨 Note
-------

The other scripts in `Backend` folder have been used for retrieving and preprocessing data but are currently still in progress. They are not needed to run the demo or the API.

🔗 Useful Resources
--------------------

- [Weaviate Documentation](https://weaviate.io/developers/weaviate)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)