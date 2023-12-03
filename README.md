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
   BOT_TOKEN=your_bot_token_here
   DAILY_NOTIFICATION=0 0 * * *
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