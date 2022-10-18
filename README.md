# VicaSpace - Provides you with the world's most fancy places!

## Structure

| Codebase         | Description |
| :--------------- | :---------: |
| [banhmi](banhmi) |   Server    |
| [pho](pho)       |   Client    |

## Installation

Clone the project:

```bash
git clone git@github.com:VicaSpace/vicaspace.git
```

or

```bash
git clone https://github.com/VicaSpace/vicaspace.git
```

Navigate to the project directory:

```bash
cd vicaspace
```

Install yarn globally with npm:

```bash
npm i -g yarn
```

Install the dependencies:

```bash
yarn
```

**Notes**: You might encounter pip error while installing mediasoup.
Refer to [this answer](https://stackoverflow.com/a/73268521) to fix it.

Setup .env for server:

```bash
cp ./banhmi/.env.example ./banhmi/.env
```

Then update the necessary environmental variables.

## Run Locally

### Server

Go to the server directory:

```bash
cd banhmi
```

Run the migration scripts:

```bash
yarn migration
```

Transpile the TypeScript files to JavaScript:

```bash
yarn build
```

Run the transpiled JavaScript files:

```bash
yarn start
```

Or, you can run using nodemon during development:

```bash
yarn dev
```
