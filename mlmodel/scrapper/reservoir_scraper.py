from playwright.sync_api import sync_playwright
import pandas as pd
from datetime import datetime
import os

URL = "https://water.karnataka.gov.in/ReservoirPublic"

OUTPUT_FILE = "../data/reservoir_levels.csv"


def scrape_reservoir_data():

    with sync_playwright() as p:

        browser = p.chromium.launch(headless=True)

        page = browser.new_page()

        page.goto(URL, timeout=60000)

        page.wait_for_timeout(5000)

        content = page.content()

        # Extract visible text
        text = page.locator("body").inner_text()

        browser.close()

    reservoirs = [
        "K.R.S",
        "Kabini",
        "Hemavathi",
        "Harangi"
    ]

    extracted_data = []

    lines = text.split("\n")

    for i, line in enumerate(lines):

        for reservoir in reservoirs:

            if reservoir in line:

                try:
                    value = lines[i + 1]

                    extracted_data.append({
                        "date": datetime.now().strftime("%Y-%m-%d"),
                        "reservoir": reservoir,
                        "value": value
                    })

                except:
                    pass

    df = pd.DataFrame(extracted_data)

    os.makedirs("../data/raw", exist_ok=True)

    if os.path.exists(OUTPUT_FILE):

        old_df = pd.read_csv(OUTPUT_FILE)

        df = pd.concat([old_df, df])

    df.to_csv(OUTPUT_FILE, index=False)

    print(df)


if __name__ == "__main__":
    scrape_reservoir_data()