# @supeffective/dataset

Pokémon JSON dataset for SuperEffective.gg based on Showdown's data.

It also includes a JavaScript HTTP client, data types and Zod schema validators.

## Installation

```bash
npm install @supeffective/dataset
# or
yarn add @supeffective/dataset
# or
pnpm add @supeffective/dataset
# or
bun add @supeffective/dataset
```

## Dev Server

This project includes a development server, to serve the `data`
folder as a JSON API.

Optionally, it can also serve a directory of assets, such as 
images (e.g `../supereffective-assets/assets`).

You can configure the server using the environment variables
from the `.env.example` file.

To start the server, run `pnpm dev`, which will also rebuild
the JS dist files whenever you change the TS files.

## Adding new data

Here's a quick guide on how to add new data to the dataset for each data type.
When you are finished, run `pnpm build` to rebuild the generated and the JS dist files.

The `-index.json` data files will be rebuilt automatically, using the data from the individual JSON files.

### Adding new Pokémon

- Add the Pokémon to `data/pokemon-index.json` (the `id` and `region` are enough)
- Add the Pokémon JSON to `data/pokemon/{region}/{pokemonId}.json` (replace `{region}` and `{pokemonId}` with the actual values)
- You can use any other as a template: `data/pokemon/kanto/bulbasaur.json`

## Documentation

- Repository: http://github.com/supeffective/dataset
- API Reference: https://www.jsdocs.io/package/@supeffective/dataset
