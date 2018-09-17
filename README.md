# Get started with Qlik Core

This repository contains the source code and assets for the Hello Engine, Hello Data, and Hello Visualization examples.

Note that before you deploy, you must accept the [Qlik Core EULA](https://core.qlik.com/eula/) by setting the `ACCEPT_EULA` environment variable.

```sh
ACCEPT_EULA=yes docker-compose up -d
```

## Contents

- [hello-engine](./src/hello-engine/) - Hello Engine example source code
- [hello-data](./src/hello-data/) - Hello Data example source code
- [hello-visualization](./src/hello-visualization/) - Example source code for a line chart and a scatter plot visualization
- [test](./test) - Function tests for the examples (bash scripts)
- [data](./data) - The Movies data, used as user data in the examples

## Screenshot

![screenshot](./src/hello-visualization/resources/hello-viz.png)

## Contributing

We welcome and encourage contributions! Please read [Open Source at Qlik R&D](https://github.com/qlik-oss/open-source)
for more info on how to get involved.

## Found a bug?

Found a problem with the examples? Don't hesitate to submit an issue.
