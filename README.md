# Heatly WebGL Tech Test - World Data Visualiser

## Table of Contents

- [Notes](#notes)
- [Installation](#installation)
- [Running Locally](#Running Locally)

###

![alt text](/public/demo.png "Title")

## Notes

I have created a world data visualiser that shows

- population
- GDP
- Area
- Average Elevation

This has been created with vanilla WebGL, not using any WebGL Libraries such as three.js. as such it is a little more basic than I would have liked, however most of my time went into learning vanilla WebGL.

Features I would liked to have added

- Animate View
- Animate bar height changing when selecting different category to view
- Display labels over the bars with the actual number

I have tried to keep chat GPT usage to a minimum, the only issue I had where I needed it's help was I was having an issue with depth buffers appearing out of order when displaying the cylinders and the map.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/willmadd/heatly-tech-test
```

Navigate to the project directory:

```bash
cd heatly-tech-test
```

```bash
yarn install
```

## Running Locally

To start the development server run

```bash
yarn dev
```

You will then be able to see the project run locally, normally at

```bash
http://localhost:5174/
```
