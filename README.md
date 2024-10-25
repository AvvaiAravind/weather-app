# webpack-template-repository

Template repository created using the learning from webpack Odin lesson

It contains the following folders

- dist
- node_modules
- src

It contains the following files

- .gitgnore
- package-lock.json
- package.json
- README.md
- webpack.dev.js
- webpack.prod.js

If your using this repo as template, you don't need to use npx instead you can use npm because we've already inserted the necessary lines in package.json under the "scripts" property which contains object within the object we have the necessary property "test", "build", "dev", "deploy". we also have the necessary dependency to run the webpack smoothly.

# instruction

- First make new directory in this case we already in that directory which is webpack-template-repo
- run `npm init-y`
- run `npm install --save-dev webpack webpack-cli` / `npm i -D webpack webpack-cli`

* webpack - module bundler that compiles js files and other assests into a single bundle, optimizing the app for production
* webpack-cli - command line interface to interact with webpack directly from the terminal

-After this node_modules folder and package-lock.json and package.json files are automatically created

- make new directory and create files with index.js, style.css, template.html
- `mkdir src && touch src/index.js src/style.css src/template.html`
- make new file webpack.dev.js and webpack.prod.js
  - dev - for development mode
  - prod - for production mode
- `touch webpack.dev.js webpack.prod.js`

  - webpack.dev.js contains following codes

```javascript
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/template.html"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
      filename: "index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
```

- webpack.prod.js contains following codes

```javascript
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devtool: "source-map", // Use source maps for production
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
      filename: "index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};

```

- next run ` npm install --save-dev html-webpack-plugin`
- for installing html-webpack-plugin
- already configured this plugin using plugins: property both in dev and prod.js
- for handling css we install style-loader and css-loader
- note: css-loader should be last at the array
- `npm install --save-dev style-loader css-loader`
- for handling images run `npm install --save-dev html-loader`
- and necessary commands in dev and prod .js as object with test and loader
- finally install `npm install --save-dev webpack-dev-server`
- for handling webpack server

- in scripts(package.json) we are going to use following codes run npm directly without the need to use npx

  ```javascript
   "build": "webpack --config webpack.prod.js",
    "dev": "webpack serve --config webpack.dev.js",
    "deploy": "git subtree push --prefix dist origin gh-pages"
  ```

- for live server
  `npm run dev`
- for build
  `npm run build`
  for deploying
  `npm run deploy`

- to create new branch from the main to deploy

`git branch gh-pages` note: we only need to use this command while creating new branch for the first time

- to move to the gh-pages branch
  `git checkout gh-pages && git merge main --no-edit`

- run build command
  `npm run build`

- few more commands
  `git add dist -f && git commit -m "Deployment commit"`
  `git subtree push --prefix dist origin gh-pages` note: instead of this we use `npm run deploy`
  `git checkout main`

now we can see the new gh-pages in our github from there we can host the website.
now run `npm install` it will install all the dependencies in the package.json

- newly added file loader for loading images
