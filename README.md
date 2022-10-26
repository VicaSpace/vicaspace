# VicaSpace - Provides you with the world's most fancy places!

## Structure

| Codebase         |     Description      |
| :--------------- | :------------------: |
| [banhmi](banhmi) |      API Server      |
| [buncha](buncha) | Communication Server |
| [pho](pho)       |        Client        |

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

Setup .env for client:

```bash
cp ./pho/.env.example ./pho/.env
```

Then update the necessary environmental variables.

## Run Locally

### API Server

Go to the server directory:

```bash
cd banhmi
```

Generate Prisma client:

```bash
yarn generate
```

Run the migration scripts:

```bash
yarn migration
```

Seed the data:

```bash
yarn seed
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

### Communication Server

Go to the server directory:

```bash
cd buncha
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

### Client

Go to the frontend directory:

```bash
cd pho
```

Run the React app in development mode:

```bash
yarn start
```

Please refer to [this README document](./pho/README.md) for more information.
