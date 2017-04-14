# Hello Chart
This example loads data into the QIX Engine, and visualizes it in a simple UI.

## Step 1 - Get the QIX Engine up and running
In this example, two different data sources are used:
* a local CSV file
* web data loaded inline

When using local data files, for example CSV files, the data files must be mounted into the docker container running the QIX Engine.

This is done by defining the data volumes in the [docker-compose file](docker-compose.yml). If you are running Docker for Windows, you
need to share the drive where your project is located. This is done in the Docker for Windows settings, see 
the [troubleshooting](#troubleshooting) section for more information. To bring the QIX Engine up and running in 
a container with mounted data, run docker-compose up.

```bash
$ cd hello-chart
$ docker-compose up -d
```

## Step 2 - Load data and add a simple visualization
This example uses Node.js and AngularJS to create a simple web application.

For data loading, the [halyard.js](https://github.com/qlik-oss/halyard.js) library is used, 
a JavaScript library that makes loading data into the QIX Engine more convenient. 
[enigma.js](https://github.com/qlik-oss/enigma.js) is used for the QIX Engine communication, and 
[d3](https://github.com/d3/d3) is used to create visualizations of the data.

In [app.js](src/app.js), the magic happens client side when the page is initialized. Information
about __what__ data to load and __where__ to fetch the data is put into [halyard.js](https://github.com/qlik-oss/halyard.js).
This information is used to create a session app in the QIX Engine. A session app only live as long as the session is alive.

The visualization is created in [scatterplot.js](src/scatterplot.js)

Install the dependencies (see [package.json](package.json)) and run the app with:

```bash
$ npm install
$ npm run start
```

Open your browser and navigate to [http://localhost:8080](http://localhost:8080).

## Troubleshooting

- Error: connect ECONNREFUSED 127.0.0.1:9076.
A connection to the QIX Engine could not be established. Most probably the QIX Engine container is not
up and running. Bring the QIX Engine back up with `docker-compose up -d`.
Make sure that the port in the [compose](docker-compose.yml) file is the same as in the enigma config that 
is created in the config object in [app.js](src/app.js).

-  Error: for engine. Cannot create container for service engine: X: drive is not shared. Please share it in Docker for Windows Settings
Shared drives are required for volume mounting Linux containers, and you need to share the drive where your project is 
located (i.e., where the Dockerfile and volume are located). Go to Settings -> Shared Drives and share the drive.

Previous example [Hello World](../hello-world/README.md).
