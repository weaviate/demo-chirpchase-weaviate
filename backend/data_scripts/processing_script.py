import json
import typer
from docarray import Document, DocumentArray  # type:ignore[import]
from pathlib import Path
from termcolor import colored

# Select desired features from the scraped tweets
FEATURES_SELECTION = [
    "date",
    "url",
    "rawContent",
    "replyCount",
    "retweetCount",
    "likeCount",
    "quoteCount",
]
MIN_TWEET_SIZE = 30  # Minimum size of the tweet
MIN_LIKE_COUNT = 10  # Minimum like count of the tweet


def main(dataset_path: Path, output_path: Path, data_config_path: Path) -> None:
    """
    This script preprocesses the dataset of tweetsand converts it to a DocArray for further processing.
    The script takes two arguments: datasetPath which is the path to the JSON file containing
    the dataset, and output_path which is the path to the output file.

    @parameter dataset_path: Path - The Path to the Dataset.json file.
    @parameter output_path: Path - The Path to the output file.
    @parameter data_config_path: Path - The Path to the data config file.
    """
    print(colored("Processing Started", "blue"))
    # Get dataset file
    if not (dataset_path).exists():
        print(colored("Dataset.json not found", "red"))
        return
    if not (output_path).exists():
        output_path.mkdir()
        print(colored(f"{output_path} not found. Creating directory", "yellow"))

    with open(dataset_path, "r") as file:
        dataset = json.load(file)
        print(
            colored(
                f"Dataset.json loaded with {dataset['twitter']['total_tweets']} tweets",
                "green",
            )
        )

    # Load config.json
    with open(data_config_path, "r") as file:
        cfg = json.load(file)
        users = cfg["twitter"]["users"]
        print(colored(f"✔ Imported config.json with {len(users)}", "green"))

    # Feature Selection & Filtering
    print(colored("Feature Selection started", "blue"))
    docList = []
    for user in dataset["twitter"]["users"]:
        for tweetID in dataset["twitter"]["users"][user]:
            tweet = processTweet(dataset["twitter"]["users"][user][tweetID])
            tweet["user"] = user
            tweet["userTags"] = users[user]["tags"]
            # Filtering
            if (
                len(tweet["rawContent"]) >= MIN_TWEET_SIZE
                and int(tweet["likeCount"]) >= MIN_LIKE_COUNT
            ):
                document = Document(
                    text=tweet["rawContent"], tags=tweet, id=user + "-" + tweetID
                )
                docList.append(document)

    # Create and Save DocArray
    docArray = DocumentArray(docList)
    docArray.save_binary(output_path / "dataset.bin")
    print(
        colored(
            f"Dataset.bin saved at {output_path} with {len(docList)} entries", "green"
        )
    )


def processTweet(tweet: dict) -> dict:
    """Process raw tweets by filter and selecting specified features

    @parameter tweet (dict) - A tweet in json format
    @returns dict - Processed tweet in json format with the desired features
    """
    processedTweet = {}
    for feature in FEATURES_SELECTION:
        if feature in tweet:
            processedTweet[feature] = tweet[feature]
    # Cherry-Picked Features
    processedTweet["followers"] = tweet["user"]["followersCount"]
    processedTweet["profileImageURL"] = tweet["user"]["profileImageUrl"]
    processedTweet["url"] = tweet["url"]
    return processedTweet


if __name__ == "__main__":
    typer.run(main)
