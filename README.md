# Base64 Image/PDF panel plugin for Grafana

![Image Panel](https://raw.githubusercontent.com/volkovlabs/volkovlabs-image-panel/main/src/img/image-panel.png)

[![Grafana 9](https://img.shields.io/badge/Grafana-9-orange)](https://www.grafana.com)
[![Base64 Image](https://img.shields.io/badge/dynamic/json?color=blue&label=Base64%20Image%20Panel&query=%24.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fvolkovlabs-image-panel)](https://grafana.com/grafana/plugins/volkovlabs-image-panel)
![CI](https://github.com/volkovlabs/volkovlabs-image-panel/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/volkovlabs-image-panel/branch/main/graph/badge.svg?token=0m6f0ktUar)](https://codecov.io/gh/VolkovLabs/volkovlabs-image-panel)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/VolkovLabs/volkovlabs-image-panel.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/VolkovLabs/volkovlabs-image-panel/context:javascript)

## Introduction

The Base64 Image/PDF Panel is a plugin for Grafana that displays raw and Base64 encoded files in PNG, JPG, GIF, and PDF formats.

### Demo

Demo is available on [demo.volkovlabs.io](https://demo.volkovlabs.io):

- [Analyzing camera feed with AI dashboard](https://demo.volkovlabs.io/d/DtsbVE3Mk/analyzing-camera-feed-with-ai?orgId=1)

### Requirements

- **Grafana 9.0** is required for version 3.X.
- **Grafana 8.0** is required for version 2.X.
- **Grafana 7.1+** is required for version 1.X.

## Getting Started

Base64 Image/PDF panel can be installed from the Grafana Marketplace or use the `grafana-cli` tool to install from the command line:

```bash
grafana-cli plugins install volkovlabs-image-panel
```

![Grafana Marketplace](https://raw.githubusercontent.com/VolkovLabs/volkovlabs-image-panel/main/src/img/grafana-marketplace.png)

## Features

- The returned value can contain base64 with or without definition (`data:image/jpg;base64,XXX` or `data:application/pdf;base64,XXX`).
- The file type is determined automatically based on the first Base64 symbol if definition is not provided.
- If the data source returns more than one field with type `string`, you can select the **Field Name** in the panel's display options.
- If the data source returns multiple rows, the panel will display the image from the last row.
- Image height and width can be auto-adjusted to panel's size, kept original or customized base on the field's value or display's panel options.
- Allows to add URL with title to navigate to other dashboard when clicking on the image.

## Feedback

We love to hear from users, developers, and the whole community interested in this plugin. These are various ways to get in touch with us:

- Ask a question, request a new feature, and file a bug with [GitHub issues](https://github.com/volkovlabs/volkovlabs-image-panel/issues/new/choose).
- Star the repository to show your support.

## Contributing

- Fork the repository.
- Find an issue to work on and submit a pull request.
- Could not find an issue? Look for documentation, bugs, typos, and missing features.

## License

- Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/volkovlabs-image-panel/blob/main/LICENSE).
