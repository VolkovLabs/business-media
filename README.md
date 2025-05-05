# Business Media for Grafana

![Media](https://raw.githubusercontent.com/volkovlabs/business-media/main/src/img/image-panel.png)

[![Grafana](https://img.shields.io/badge/Grafana-11.6-orange)](https://grafana.com/)
[![CI](https://github.com/volkovlabs/business-media/workflows/CI/badge.svg)](https://github.com/volkovlabs/business-media/actions/workflows/ci.yml)
[![E2E](https://github.com/volkovlabs/business-media/workflows/E2E/badge.svg)](https://github.com/volkovlabs/business-media/actions/workflows/e2e.yml)
[![Codecov](https://codecov.io/gh/VolkovLabs/business-media/branch/main/graph/badge.svg)](https://codecov.io/gh/VolkovLabs/business-media)
[![CodeQL](https://github.com/VolkovLabs/business-media/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/business-media/actions/workflows/codeql-analysis.yml)

**Business Media** is a powerful Grafana plugin designed to display a variety of media files, including PNG, JPG, GIF, MP4, WEBM, MP3, OGG, and PDF, using base64 encoding or direct URLs. Seamlessly integrate multimedia content into your Grafana dashboards with ease and flexibility.

[![Display Images and PDFs in Grafana with Business Media](https://raw.githubusercontent.com/volkovlabs/business-media/main/img/overview.png)](https://youtu.be/hLMtsCWPOg8)

## 🚀 Features

- **Versatile Media Support**: Render images, videos, audio, and PDFs using base64-encoded data or URLs.
- **Pagination**: Display multiple media files with intuitive pagination controls.
- **Flexible Data Handling**: Supports base64 content with or without format definitions (e.g., `data:image/jpg;base64,ENCODED-CONTENT`).
- **Field Selection**: Choose specific fields from data sources returning multiple string fields.
- **Customizable Display**: Fit media to panel size, retain original dimensions, or set custom dimensions.
- **Interactive Navigation**: Add clickable URLs with titles to link to other dashboards, supporting dashboard variables.
- **User-Friendly Toolbar**: Download, zoom, and navigate between media files effortlessly.

## 📋 Requirements

Ensure your Grafana version meets the requirements for the Business Media panel:

| Plugin Version       | Compatible Grafana Versions |
| -------------------- | --------------------------- |
| Business Media 6.X   | Grafana 10, Grafana 11      |
| Business Media 5.X   | Grafana 10, Grafana 11      |
| Base64 Image/PDF 4.X | Grafana 9, Grafana 10       |
| Base64 Image/PDF 3.X | Grafana 8.5, Grafana 9      |
| Base64 Image/PDF 2.X | Grafana 8                   |
| Base64 Image/PDF 1.X | Grafana 7.1                 |

## 🛠️ Installation

Install the Business Media panel via the [Grafana Plugins Catalog](https://grafana.com/grafana/plugins/volkovlabs-image-panel/) or using the Grafana CLI.

### Using Grafana CLI

```bash
grafana cli plugins install volkovlabs-image-panel
```

[![Install Business Suite Plugins in Cloud, OSS, and Enterprise](https://raw.githubusercontent.com/volkovlabs/.github/main/started.png)](https://youtu.be/1qYzHfPXJF8)

## 📚 Documentation

Explore detailed guides and resources to make the most of the Business Media panel:

| Section                                                                    | Description                                                  |
| -------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [Supported Formats](https://volkovlabs.io/plugins/business-media/formats/) | Learn about supported media formats and how to display them. |
| [Options](https://volkovlabs.io/plugins/business-media/options/)           | Understand all available configuration options.              |
| [Features](https://volkovlabs.io/plugins/business-media/features/)         | Discover the full range of panel capabilities.               |
| [Tutorials](https://volkovlabs.io/plugins/business-media/tutorials/)       | Follow step-by-step guides for common use cases.             |
| [Release Notes](https://volkovlabs.io/plugins/business-media/release/)     | Stay updated with the latest features and improvements.      |

## 🌟 Business Suite for Grafana

The **Business Suite** is a collection of open-source plugins developed and maintained by Volkov Labs. Designed to address common business needs, these plugins offer intuitive interfaces, comprehensive documentation, practical examples, and video tutorials.

[![Business Suite for Grafana](https://raw.githubusercontent.com/VolkovLabs/.github/main/business.png)](https://volkovlabs.io/plugins/)

### Enterprise Support

Elevate your experience with [Business Suite Enterprise](https://volkovlabs.io/pricing/). Benefits include:

- Dedicated support via Zendesk.
- Priority handling for feature requests and bug fixes.
- In-person consultations.
- Access to exclusive Business Intelligence features.

## 💬 Get in Touch

We value your feedback and are eager to assist:

- **Ask Questions or Report Issues**: Use [GitHub Issues](https://github.com/volkovlabs/business-media/issues).
- **Watch Tutorials**: Subscribe to our [YouTube Channel](https://youtube.com/@volkovlabs) and leave comments.

## 📜 License

This project is licensed under the Apache License Version 2.0. See the [LICENSE](https://github.com/volkovlabs/business-media/blob/main/LICENSE) file for details.
