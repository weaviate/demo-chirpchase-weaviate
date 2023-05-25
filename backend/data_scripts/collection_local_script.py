import typer
import json

from pathlib import Path
from datetime import datetime
from termcolor import colored


def main(data_path: Path, dataset_path: Path) -> None:
    """
    This script merges the extracted tweets and saves them in a local JSON file. The script takes two arguments: dataPath, the path to the directory
    containing the scraped files, and datasetPath, the path to the JSON file that will be saved at the end.

    @parameters data_path : Path - Path to the directory of the scraped files
    @parameters dataset_path : Path) - Path to dataset.json
    """
    print(colored("Collection Started", "blue"))
    files: dict[str, list[dict]] = {}
    # Check if data_path is dir or file
    if not data_path.exists():
        print(colored(f"{data_path} does not exist! Skipping entry", "red"))
        return
    elif data_path.is_file():
        # Loading File
        with open(data_path) as file:
            for line in file:
                jsonLine = json.loads(line)
                userName = jsonLine["user"]["username"]
                if userName not in files:
                    files[userName] = []
                files[userName].append(jsonLine)
            print(colored(f"{data_path} loaded", "green"))

    # Load dataset file
    if (dataset_path).exists():
        with open(dataset_path, "r") as file:
            dataset = json.load(file)
            print(colored(f"Dataset.json loaded", "green"))
    else:
        print(colored(f"No Dataset.json detected. Creating new one", "yellow"))
        dataset = {"twitter": {"users": {}, "total_tweets": 0, "last_run": None}}

    # Update time
    currentDate = datetime.now()
    dtString = currentDate.strftime("%d/%m/%Y %H:%M:%S")
    dataset["twitter"]["last_run"] = dtString

    # Insert posts to dataset.json
    for user in files:
        if user not in dataset["twitter"]["users"]:
            dataset["twitter"]["users"][user] = {}
        for post in files[user]:
            if post["id"] not in dataset["twitter"]["users"][user]:
                dataset["twitter"]["users"][user][str(post["id"])] = post

    # Update total post count
    dataset["twitter"]["total_tweets"] = sum(
        [len(dataset["twitter"]["users"][user]) for user in dataset["twitter"]["users"]]
    )

    # Save dataset.json
    with open(dataset_path, "w") as file:
        json.dump(dataset, file)
        print(
            colored(
                f"Dataset.json with {dataset['twitter']['total_tweets']} entries saved",
                "blue",
            )
        )


if __name__ == "__main__":
    typer.run(main)
