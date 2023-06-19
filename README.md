# Base64 Image/Video/Audio/PDF panel for Grafana

![Image Panel](https://raw.githubusercontent.com/volkovlabs/volkovlabs-image-panel/main/src/img/image-panel.png)

![Grafana 10](https://img.shields.io/badge/Grafana-10.0.0-orange)
![CI](https://github.com/volkovlabs/volkovlabs-image-panel/workflows/CI/badge.svg)
![E2E](https://github.com/volkovlabs/volkovlabs-image-panel/workflows/E2E/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/volkovlabs-image-panel/branch/main/graph/badge.svg?token=0m6f0ktUar)](https://codecov.io/gh/VolkovLabs/volkovlabs-image-panel)
[![CodeQL](https://github.com/VolkovLabs/volkovlabs-image-panel/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/volkovlabs-image-panel/actions/workflows/codeql-analysis.yml)

## Introduction

The Base64 Image/Video/Audio/PDF visualization panel is a plugin for Grafana that displays Base64 encoded files in PNG, JPG, GIF, MP4, WEBM, MP3, OGG, PDF formats.

[![Images, PDFs, Video, Live Camera Feed on Grafana Dashboard! You will need Base64 Image/PDF Plugin](https://raw.githubusercontent.com/volkovlabs/volkovlabs-image-panel/main/img/video.png)](https://youtu.be/1_bgLSehjhg)

### Requirements

- **Grafana 8.5+**, **Grafana 9.0+** is required for major version 3.
- **Grafana 8.0+** is required for major version 2.
- **Grafana 7.1+** is required for major version 1.

## Getting Started

Base64 Image/Video/Audio/PDF visualization panel can be installed from the [Grafana Catalog](https://grafana.com/grafana/plugins/volkovlabs-image-panel/) or utilizing the Grafana command line tool.

For the latter, use the following command.

```bash
grafana-cli plugins install volkovlabs-image-panel
```

## Highlights

- The returned value can contain base64 with or without definition (`data:image/jpg;base64,ENCODED-CONTENT` or `data:application/pdf;base64,ENCODED-CONTENT`).
- The file type is determined automatically based on the first Base64 symbol if the definition is not provided.
- If the data source returns more than one field with a type `string`, you can select the **Field Name** in the panel's display options.
- If the data source returns multiple rows, the panel will display the image from the last row.
- Image height and width can be auto-adjusted to the panel's size, kept original or customized base on the field's value.
- Allows adding URL with title to navigate to other dashboards when clicking on the image. URL supports dashboard variables.
- Support MP4, WEBM video files with definition (`data:video/mp4;base64,ENCODED-CONTENT` and `data:video/webm;base64,ENCODED-CONTENT`)
- Support MP3, OGG audio files with definition (`data:audio/mp3;base64,ENCODED-CONTENT` and `data:audio/ogg;base64,ENCODED-CONTENT`)
- Provides a toolbar to download, zoom and navigate between multiple images.

## Documentation

| Section                      | Description                                                         |
| ---------------------------- | ------------------------------------------------------------------- |
| [Supported formats](https://volkovlabs.io/plugins/volkovlabs-image-panel/formats/) | Explains what formats are supported and how to display media files. |
| [Features](https://volkovlabs.io/plugins/volkovlabs-image-panel/features/)         | Demonstrates panel features.                                        |
| [Release Notes](https://volkovlabs.io/plugins/volkovlabs-image-panel/release/)     | Stay up to date with the latest features and updates.               |

## Feedback

We love to hear from you. There are various ways to get in touch with us.

- Ask a question, request a new feature, and file a bug with [GitHub issues](https://github.com/volkovlabs/volkovlabs-image-panel/issues/new/choose).
- Subscribe to our [YouTube Channel](https://www.youtube.com/@volkovlabs) and add a comment.
- Sponsor our open-source plugins for Grafana with [GitHub Sponsor](https://github.com/sponsors/VolkovLabs).
- Star the repository to show your support.

## License

Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/volkovlabs-image-panel/blob/main/LICENSE).
