import typer
import requests
import os
import json
import time

from wasabi import msg
from pathlib import Path

# (GET) /2/users/by/username/:username


def main(config_path: Path, output_dir: Path) -> None:
    bearer_token = os.getenv("TWITTER_API_BEARER")
    headers = {"Authorization": f"Bearer {bearer_token}"}

    dataset = {}

    def get_user_by_id(user_name):
        params = {
            "user.fields": "description,profile_image_url,public_metrics,verified,url"
        }
        response = requests.get(
            f"https://api.twitter.com/2/users/by/username/{user_name}",
            headers=headers,
            params=params,
        )
        if response.status_code != 200:
            raise Exception(response.status_code, response.text)
        return response.json()

    def get_user_tweets(user_id, max_results):
        params = {
            "max_results": max_results,
            "exclude": "retweets,replies",
            "expansions": "attachments.media_keys",
            "media.fields": "preview_image_url,url,public_metrics",
            "tweet.fields": "public_metrics,created_at",
        }
        response = requests.get(
            f"https://api.twitter.com/2/users/{user_id}/tweets",
            headers=headers,
            params=params,
        )
        if response.status_code != 200:
            raise Exception(response.status_code, response.text)
        return response.json()

    try:
        # Load config.json
        with open(config_path, "r") as file:
            cfg = json.load(file)
            users = cfg["twitter"]["users"]
            max_results = cfg["twitter"]["max_tweets"]
            msg.good(f"✔ Imported config.json with {len(users)}")

        if not output_dir.exists():
            msg.warn(f"{output_dir} does not exist. Creating directory.")
            output_dir.mkdir()
    except Exception as e:
        msg.fail("Loading data failed")
        msg.info(str(e))
        return

    msg.divider("Starting API Retrieval")
    sleep_time = 1
    for i, user in enumerate(users):
        while True:
            msg.info(f"({i}/{len(users)}) Scraping {user}({max_results})")
            try:
                user_info = get_user_by_id(user)
                user_id = user_info["data"]["id"]
                user_tweets = get_user_tweets(user_id, max_results)
                user_info["user_tweets"] = user_tweets
                if user_id not in dataset:
                    dataset[user_id] = user_info
                break

            except Exception as e:
                msg.warn(f"Retrieving information from user {user} failed")
                msg.info(str(e))
                time.sleep(sleep_time)
                sleep_time += 1
                pass

    # Save dataset.json
    with open(output_dir / Path("dataset.json"), "w") as file:
        json.dump(dataset, file)
        msg.good(f"Dataset.json saved")


if __name__ == "__main__":
    typer.run(main)
