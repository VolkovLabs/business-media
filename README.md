# Base64 Image/Video/Audio/PDF panel for Grafana

![Image Panel](https://raw.githubusercontent.com/volkovlabs/volkovlabs-image-panel/main/src/img/image-panel.png)

[![Grafana 9](https://img.shields.io/badge/Grafana-9.3.2-orange)](https://www.grafana.com)
[![YouTube](https://img.shields.io/badge/YouTube-Playlist-red)](https://youtube.com/playlist?list=PLPow72ygztmQjZ19D7wKHc_6VG3dCjkwo)
![CI](https://github.com/volkovlabs/volkovlabs-image-panel/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/volkovlabs-image-panel/branch/main/graph/badge.svg?token=0m6f0ktUar)](https://codecov.io/gh/VolkovLabs/volkovlabs-image-panel)
[![CodeQL](https://github.com/VolkovLabs/volkovlabs-image-panel/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/volkovlabs-image-panel/actions/workflows/codeql-analysis.yml)

## Introduction

The Base64 Image/Video/Audio/PDF visualization panel is a plugin for Grafana that displays Base64 encoded files in PNG, JPG, GIF, MP4, WEBM, MP3, OGG, PDF formats.

[![Images, PDFs, Video, Live Camera Feed on Grafana Dashboard! You will need Base64 Image/PDF Plugin](https://raw.githubusercontent.com/volkovlabs/volkovlabs-image-panel/main/img/video.png)](https://youtu.be/1_bgLSehjhg)

### Requirements

- **Grafana 8.5+**, **Grafana 9.0+** is required for version 3.X.
- **Grafana 8.0+** is required for version 2.X.
- **Grafana 7.1+** is required for version 1.X.

## Getting Started

Base64 Image/Video/Audio/PDF visualization panel can be installed from the [Grafana Catalog](https://grafana.com/grafana/plugins/volkovlabs-image-panel/) or utilizing the Grafana command line tool. For the latter, use the following command:

```bash
grafana-cli plugins install volkovlabs-image-panel
```

## Features

- The returned value can contain base64 with or without definition (`data:image/jpg;base64,ENCODED-CONTENT` or `data:application/pdf;base64,ENCODED-CONTENT`).
- The file type is determined automatically based on the first Base64 symbol if definition is not provided.
- If the data source returns more than one field with type `string`, you can select the **Field Name** in the panel's display options.
- If the data source returns multiple rows, the panel will display the image from the last row.
- Image height and width can be auto-adjusted to panel's size, kept original or customized base on the field's value or display's panel options.
- Allows to add URL with title to navigate to other dashboard when clicking on the image. URL supports dashboard variables.
- Support MP4, WEBM video files with definition (`data:video/mp4;base64,ENCODED-CONTENT` and `data:video/webm;base64,ENCODED-CONTENT`)
- Support MP3, OGG audio files with definition (`data:audio/mp3;base64,ENCODED-CONTENT` and `data:audio/ogg;base64,ENCODED-CONTENT`)

## Documentation

| Section | Description |
| -- | -- |
| [Data Sources](https://volkovlabs.io/plugins/volkovlabs-image-panel/datasources) | Demonstrates how to retrieve data from data sources. |
| [Supported formats](https://volkovlabs.io/plugins/volkovlabs-image-panel/formats) | Explains what formats are supported and how to display media files. |
| [Variables](https://volkovlabs.io/plugins/volkovlabs-image-panel/variables) | Explains how to use Dashboard and Global variables. |

## Feedback

We love to hear from you. There are various ways to get in touch with us:

- Ask a question, request a new feature, and file a bug with [GitHub issues](https://github.com/volkovlabs/volkovlabs-image-panel/issues/new/choose).
- Sponsor our open-source plugins for Grafana with [GitHub Sponsor](https://github.com/sponsors/VolkovLabs).
- Star the repository to show your support.

## License

- Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/volkovlabs-image-panel/blob/main/LICENSE).
