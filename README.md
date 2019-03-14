# Token Factory UI

The UI micro-service for Token Factory

## Background
`dashboard` is the UI service for the entire `Token Factory` project. The project is built with [react](https://reactjs.org/), styled with [Carbon-Design-System](https://www.carbondesignsystem.com/), and connecting backend APIs using [Apollo Client](https://www.apollographql.com/docs/react/).


### Build

The following commands will install all dependencies and build the project
```
npm install; npm run build
```

### Start Development Server

With all pre-requirements set up correctly, run follwoing command to start project development
```
npm install; npm run start:development
```

### Start Production Server

The following commands will run the project in production mode, it requries a successful build as well as [serve](https://www.npmjs.com/package/serve) being installed locally. 
```
npm install; npm build; npm run start:production
```

### Testing
```
npm install; npm run test
```

## Design

The UI Platform is developed as an isomorphic react application. The following major components are used to build this service.

- NodeJS
- React
- Webpack 3
- Babel
- Apollo/GraphQL
- Carbon Design Systen
- Jest
- d3.js

### NPM Commands

The full list of npm scripts are described below.

| Command                     | Description                                  |
| --------------------------- | -------------------------------------------- |
| `npm start`                 | Starts the application in production mode    |
| `npm run start:development` | Starts development server                    |
| `npm run start:production`  | Starts production server                     |
| `npm run build`             | Perform clean build                          |
| `npm run build-server`      | Build server only                            |
| `npm run build:production`  | Build for production                         |
| `npm run clean`             | Clean all old builds                         |
| `npm test`                  | Runs jest tests                              |
| `npm run lint`              | Runs lint code style check                   |


### Resources

These are a few useful links that will help provide technical reference and best practices when developing for the platform.

- [Carbon Components](https://github.com/carbon-design-system/carbon-components)
- [Carbon React Components](https://github.com/carbon-design-system/carbon-components-react)
- [Webpack](https://webpack.js.org)
- [React Docs](https://facebook.github.io/react/docs/hello-world.html)
- [Thinking in React](https://facebook.github.io/react/docs/thinking-in-react.html)
- [React Best Practices](https://engineering.musefind.com/our-best-practices-for-writing-react-components-dec3eb5c3fc8)
- [Smart and Dumb Component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [Apollo Client for react](https://www.apollographql.com/docs/react/)
