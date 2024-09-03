# Business Media for Grafana

![Media](https://raw.githubusercontent.com/volkovlabs/business-media/main/src/img/image-panel.png)

![Grafana](https://img.shields.io/badge/Grafana-11.2-orange)
![CI](https://github.com/volkovlabs/business-media/workflows/CI/badge.svg)
![E2E](https://github.com/volkovlabs/business-media/workflows/E2E/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/business-media/branch/main/graph/badge.svg)](https://codecov.io/gh/VolkovLabs/business-media)
[![CodeQL](https://github.com/VolkovLabs/business-media/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/business-media/actions/workflows/codeql-analysis.yml)

## Introduction

Business Media panel is a Grafana plugin that renders PNG, JPG, GIF, MP4, WEBM, MP3, OGG, and PDF files encoded in the Base64 format and provided using URL.

[![Display images and PDF on Grafana using Business Media panel](https://raw.githubusercontent.com/volkovlabs/business-media/main/img/overview.png)](https://youtu.be/hLMtsCWPOg8)

## Requirements

The Business Media panel version requirements for Grafana are as follows:

- Business Media panel 5.X requires **Grafana 10** or **Grafana 11**.
- Base64 panel 4.X requires **Grafana 9** or **Grafana 10**.
- Base64 panel 3.X requires **Grafana 8.5** or **Grafana 9**.
- Base64 panel 2.X requires **Grafana 8**.
- Base64 panel 1.X requires **Grafana 7.1**.

## Getting Started

You can install the Business Media Panel from the [Grafana Plugins [catalog](https://grafana.com/grafana/plugins/volkovlabs-image-panel/) or use the Grafana command line tool.

For the latter, please use the following command.

```bash
grafana-cli plugins install volkovlabs-image-panel
```

## Highlights

- The returned value can include base64 encoded content with or without a specified definition. The formats for the definition can look like `data:image/jpg;base64,ENCODED-CONTENT` or `data:application/pdf;base64,ENCODED-CONTENT`.
- The file type is automatically determined based on the first Base64 symbol if no definition is provided.
- If the data source returns more than one field of the `string` type, you can select the Field Name in the panel's display options.
- You can fit image dimensions to the panel size, keep the original values, or adjust dimensions based on the manually supplied values.
- Allows adding a URL with a title to navigate to other dashboards when clicking the image. URL supports dashboard variables.
- Support for MP4 and WEBM video files with the definitions (`data:video/mp4;base64,ENCODED-CONTENT` and `data:video/webm;base64,ENCODED-CONTENT`)
- Support for MP3 and OGG audio files with the definitions (`data:audio/mp3;base64,ENCODED-CONTENT` and `data:audio/ogg;base64,ENCODED-CONTENT`)
- Provides a toolbar to download, zoom, and navigate between multiple images.

## Documentation

| Section                                                                    | Description                                                         |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [Supported formats](https://volkovlabs.io/plugins/business-media/formats/) | Explains what formats are supported and how to display media files. |
| [Features](https://volkovlabs.io/plugins/business-media/features/)         | Demonstrates panel capabilities.                                    |
| [Release Notes](https://volkovlabs.io/plugins/business-media/release/)     | Stay up to date with the latest features and updates.               |

## Business Suite for Grafana

The Business Suite is a collection of open source plugins created and actively maintained by Volkov Labs.

The collection aims to solve the most frequent business tasks by providing an intuitive interface with detailed written documentation, examples, and video tutorials.

[![Business Suite for Grafana](https://raw.githubusercontent.com/VolkovLabs/.github/main/business.png)](https://volkovlabs.io/plugins/)

## Feedback

We're looking forward to hearing from you. You can use different ways to get in touch with us.

- Ask a question, request a new feature, or report an issue at [GitHub issues](https://github.com/volkovlabs/business-media/issues/).
- Subscribe to our [YouTube Channel](https://www.youtube.com/@volkovlabs) and leave your comments.
- Sponsor our open-source plugins for Grafana at [GitHub Sponsor](https://github.com/sponsors/VolkovLabs).
- Support our project by starring the repository.

## License

Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/business-media/blob/main/LICENSE).
