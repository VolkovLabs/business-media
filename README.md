# Base64 Image/PDF panel plugin for Grafana

![Image Panel](https://raw.githubusercontent.com/volkovlabs/grafana-image-panel/main/src/img/image-panel.png)

[![Grafana 7](https://img.shields.io/badge/Grafana-7-orange)](https://www.grafana.com)
![CI](https://github.com/volkovlabs/grafana-image-panel/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/grafana-image-panel/branch/main/graph/badge.svg?token=0m6f0ktUar)](https://codecov.io/gh/VolkovLabs/grafana-image-panel)

## Summary

- [**Introduction**](#introduction)
- [**Getting Started**](#getting-started)
- [**Feedback**](#feedback)
- [**Contributing**](#contributing)
- [**License**](#license)

## Introduction

The Base 64 Image/PDF Panel is a plugin for Grafana that displays raw and Base64 encoded files in PNG, JPG, GIF, and PDF formats.

### Requirements

Only **Grafana 7.1+** is supported.

## Getting Started

Use the `grafana-cli` tool to install from the command line:

```bash
grafana-cli plugins install volkovlabs-image-panel
```

## Features

- The returned value can contain base64 with or without definition like `data:image/jpg;base64,XXX` or `data:application/pdf;base64,XXX`.
- The file type is determined automatically based on the first Base64 symbol if definition is not provided.
- If the data source returns more than one field with type `string`, you can specify the **Field Name** in the panel's display options.
- If the data source returns multiple rows, the panel will display the image from the last row.

## Feedback

We love to hear from users, developers, and the whole community interested in this plugin. These are various ways to get in touch with us:

- Ask a question, request a new feature, and file a bug with [GitHub issues](https://github.com/volkovlabs/grafana-image-panel/issues/new/choose).
- Star the repository to show your support.

## Contributing

- Fork the repository.
- Find an issue to work on and submit a pull request.
- Could not find an issue? Look for documentation, bugs, typos, and missing features.

## License

- Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/grafana-image-panel/blob/main/LICENSE).
