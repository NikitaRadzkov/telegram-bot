# Telegram Bot using Node.js and TypeScript

A simple Telegram bot created with Node.js and TypeScript using the Telegraf library.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:

  ```bash
   git clone https://github.com/NikitaRadzkov/telegram-bot.git
  ```

2. Navigate to the project directory:

  ```bash
   cd telegram-bot
  ```

3. Install dependencies:

  ```bash
  npm install
  ```

4. Create a .env file in the root directory and add your Telegram Bot Token:

  ```dotenv
  # Common
  BOT_TOKEN=***
  PORT=5500
  CURRENCY=soles

  # Cron
  DAILY_NOTIFICATION=0 */4 * * *

  # Links
  REGISTER_LINK=https://example.com

  MEXICO_BOT_LINK=t.me/@AlexramirezBot
  COLUMBIA_BOT_LINK=t.me/@AlexMartinezBot
  CHILE_BOT_LINK=t.me/@AlexblancoBot
  ECUADOR_BOT_LINK=t.me/@AlexfloresBot
  PERU_BOT_LINK=t.me/@AlexcortesBot

  MEXICO_TELEGRAM_CHANNEL=https://t.me/yourChannel
  COLUMBIA_TELEGRAM_CHANNEL=https://t.me/yourChannel
  CHILE_TELEGRAM_CHANNEL=https://t.me/yourChannel
  ECUADOR_TELEGRAM_CHANNEL=https://t.me/yourChannel
  PERU_TELEGRAM_CHANNEL=https://t.me/yourChannel
  ```

5. Start the bot:

  ```bash
    npm start
  ```

### Features

- Welcomes users with a start command.
- Action buttons for help.
- Cron notification if user doesn't complete register.


### License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.