import typer
import requests
import os

# (GET) /2/users/by/username/:username


def main() -> None:
    bearer_token = os.getenv("TWITTER_API_BEARER")
    headers = {"Authorization": "Bearer {}".format(bearer_token)}

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
            "tweet.fields": "public_metrics",
        }
        response = requests.get(
            f"https://api.twitter.com/2/users/{user_id}/tweets",
            headers=headers,
            params=params,
        )
        if response.status_code != 200:
            raise Exception(response.status_code, response.text)
        return response.json()

    user_name = "aestheticedwar1"
    user_info = get_user_by_id(user_name)
    user_id = user_info["data"]["id"]
    user_tweets = get_user_tweets(user_id, 5)

    print(user_info)
    print("")
    print(user_tweets)


if __name__ == "__main__":
    typer.run(main)
