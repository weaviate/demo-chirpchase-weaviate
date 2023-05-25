import json
import typer
import time

from subprocess import PIPE, Popen
from pathlib import Path
from termcolor import colored


def main(config: Path, output_dir: Path, collection_script: Path) -> None:
    """
    This script uses the snscrape tool to scrape tweets from Twitter based on settings specified in the data_config.json file.
    The tweets are saved to a JSONL file and then processed with a collection script merge all tweets into one single JSON file.

    @parameter config :Path - The Path to the config.json
    @parameter output_dir : Path - The Path to output directoriy
    @parameter collection_script : Path - The Path to collection script to save the scraped files into one .json
    """
    try:
        start_time = time.time()
        print(colored("Scraping Started", "blue"))
        # Load config.json
        with open(config, "r") as file:
            cfg = json.load(file)
            users = cfg["twitter"]["users"]
            max_results = cfg["twitter"]["max_tweets"]
            print(colored(f"✔ Imported config.json with {len(users)}", "green"))

        if not output_dir.exists():
            print(
                colored(f"{output_dir} does not exist. Creating directory.", "yellow")
            )
            output_dir.mkdir()

        # Iterate through users and scrape tweets based on max_results
        for i, user in enumerate(users):
            iteration_start = time.time()
            print(colored(f"({i}/{len(users)}) Scraping {user}({max_results})", "blue"))
            cmd_str = f"snscrape --jsonl --progress --max-results {max_results} twitter-user {user} > {output_dir / f'{user}.jsonl'}; python {collection_script} {output_dir / f'{user}.jsonl'} {output_dir / 'dataset.json'}"
            print(colored(f"Running: {cmd_str}", "green"))
            with Popen(cmd_str, stdout=PIPE, stderr=None, shell=True) as process:
                output = process.communicate()[0].decode("utf-8")
                print(colored(f"{output}", "yellow"))
            iteration_time = time.time() - iteration_start
            print(
                colored(
                    f"({i}/{len(users)}) {user} finished in {iteration_time:.5f}s (est. {((len(users)-i)*iteration_time):.5f}s remaining) ",
                    "green",
                )
            )
        total_time = time.time() - start_time
        print(colored(f"Scraping finished in {total_time:.5f}s", "green"))

    except Exception as e:
        print(colored(str(e), "red"))


if __name__ == "__main__":
    typer.run(main)
