# Hello World
This example shows how to get the QIX Engine up and running in a docker container, and 
how to setup a simple communication.

## Step 1 - Get the QIX Engine up and running
In the first step we focus on getting the QIX Engine up and running. Run the `docker-compose up` command.

```bash
$ cd hello-world
$ docker-compose up
```
The QIX Engine is now running on Linux!

When running `docker-compose up`, it is good practice to run `docker-compose up -d`, where
the `-d` argument means detached mode, that is the container runs in the background.

```bash
$ docker-compose up -d
```

### What is actually happening
The [compose](docker-compose.yml) file is used to configure the service. In this first step the config is 
very simple, we only need to specify the QIX Engine image with vanilla config. When `docker-compose up` is executed,
the image is downloaded and built, and the docker image is run as a docker container using port `9076`. The port
is configurable in the [compose](docker-compose.yml) file with the ports tag, which maps the host port with 
the container port, HOST:CONTAINER. To view the image downloaded by docker, run the `docker images` command, which is the command for listing images.

```bash
$ docker images
```

When listing the docker containers, the newly created running container with the QIX Engine image should be listed.
The `-a` option means that all containers are shown, default is to show just the running containers.

```bash
$ docker ps -a
```

## Step 2 - Communicate with the QIX Engine
When the QIX Engine is up and running, it is time for some interaction. Connect to the QIX Engine
and do some basic communication in a Node.js application.

The angular 4.x typescript application consists of config files and *.ts files. 

[package.json](package.json) and [system.config.js](system.config.js) contains the relevant configs and the dependencies. 
To connect and communicate with the QIX Engine, a JavaScript library for consuming 
Qlik backend services, [enigma.js](https://github.com/qlik-oss/enigma.js), is used.
enigma.js needs to be configured, see [app/enigma-config.ts](app/enigma-config.ts). The port
number for the QIX Engine must be set in the enigma-config.ts file.

[app/app.module.ts](app/app.module.ts) is the application entrypoint. It loads the components which connect to the QIX Engine and asks for the
QIX Engine version, which is printed to the browser window.

Run `npm install` to download and install the node packages needed for the application (see [package.json](package.json)).

```bash
$ npm install
```

Execute `npm start` to start the application.

```bash
$ npm start
```

Look at the console output, the QIX Engine should have replied to your version question.

## Step 3 - Stop the docker container
Run `docker-compose down` to stop and remove the container.

```bash
$ docker-compose down
```

## Troubleshooting

- Error: connect ECONNREFUSED 127.0.0.1:9076.
A connection to the QIX Engine could not be established. Most probably the QIX Engine container is not
up and running. Bring the QIX Engine back up with `docker-compose up -d`.
Make sure that the port in the [compose](docker-compose.yml) file is the same as in the 
[app/enigma-config.ts](app/enigma-config.ts).


