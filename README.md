🦤 ChirpChase
========================

👤 Author: Edward (**Developer Growth Team** 💐)

🎯 Overview
-----------

### Analyzing and leveraging content creation

ChirpChase is meant to be an internal tool for generating content leveraged by the use of LLM and content pipelines. The tool allows you to browse through social media content, create own content and combine them to create new content based on different topics, personas, and context.

🔧 Project Structure
---------------------

The demo is built in two parts:

1. A FastAPI endpoint that communicates with the LLM provider and Weaviate (WIP).
2. An interactive React frontend for displaying and creating content.

📚 Getting Started
-------------------

To get started with the Health Search Demo, please refer to the READMEs in the `Frontend` and `Backend` folders:

- [Frontend README](./frontend/README.md)
- [Backend README](./Backend/README.md)

💡 Usage
--------

1. Set up the FastAPI backend and the React frontend by following the instructions in their respective READMEs.
2. Launch the backend server and the frontend application.
3. Use the frontend to drag-and-drop tweets into the dropzone to generate new content based on them
4. Try out different Persona prompts and the use of context to change the style of content generation