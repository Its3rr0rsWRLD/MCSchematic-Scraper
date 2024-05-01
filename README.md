# MCSchematic-Scraper

MCSchematic-Scraper is a Node.js tool designed to automatically download top-rated Minecraft schematics from the `minecraft-schematics.com` website. It handles the extraction of schematic details and downloads files to the local filesystem, renaming them appropriately to avoid conflicts and ensuring that downloads are managed safely with authentication via cookies.

I made this because I wanted to install a bunch of schematics for my world but it was ***slow*** and it ***didn't*** have the names of the schematic so it was confusing to know what schematic did what. Yeah thats basically it lol

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v14.x or newer recommended)
- npm (typically comes with Node.js)

## Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/MCSchematic-Scraper.git
cd MCSchematic-Scraper
```

Install the necessary packages:

```bash
npm install
```

## Configuration

You need to set up environment variables to store your authentication cookies. Follow these steps:

1. Create an account or log into [minecraft-schematics.com](https://www.minecraft-schematics.com).
2. Once logged in, inspect your browser cookies for the site.
3. Create a `.env` file in the root directory of this project.
4. Fill in your cookie values like this:

```plaintext
# .env file
PHPSESSID=your_phpsessid_value_here
cf_clearance=your_cf_clearance_value_here
uid=your_uid_value_here
ukey=your_ukey_value_here
utoken=your_utoken_value_here
```

Replace `your_phpsessid_value_here`, `your_cf_clearance_value_here`, etc., with the actual cookie values from your browser.

## Usage

To run the scraper, use the following command:

```bash
node index.js
```

This will start the scraping process, and downloaded schematic files will be saved to the project directory or a subdirectory if specified in the script.

## Features

- Downloads top-rated Minecraft schematics.
- Automatically handles file naming to prevent overwriting.
- Uses environment variables for secure cookie management.

## Contributing to MCSchematic-Scraper

To contribute to MCSchematic-Scraper, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin MCSchematic-Scraper/<location>`
5. Create the pull request.

Alternatively, see the GitHub documentation on [creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

## Contributors

Thanks to the following people who have contributed to this project:

- [@Its3rr0rsWRLD](https://github.com/Its3rr0rsWRLD) (creator)

## Contact

If you want to contact me you can reach me at discord - Its3rr0rsWRLD