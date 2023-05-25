source working_env/bin/activate
python data_scripts/scraping_script.py data_config.json data_scripts/data data_scripts/collection_local_script.py
python data_scripts/processing_script.py data_scripts/data/dataset.json data_api/ data_config.json
uvicorn main_app:app --reload