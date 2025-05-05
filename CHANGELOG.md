# Changelog

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this changelog is maintained to provide a clear history of updates, features, and breaking changes for the Business Media plugin for Grafana.

## [Unreleased]

- No unreleased changes at this time.

## [6.3.0] - 2025-05-05

### Added

- Updated console error messages during build ([#152](https://github.com/volkovlabs/business-media/pull/152)).
- Removed dependency on `@volkovlabs/grafana-utils` ([#154](https://github.com/volkovlabs/business-media/pull/154)).
- Updated dependencies to support Grafana 11.6 ([#155](https://github.com/volkovlabs/business-media/pull/155)).

## [6.2.0] - 2024-12-03

### Added

- Improved data state handling for timeouts and errors ([#145](https://github.com/volkovlabs/business-media/pull/145)).
- Updated end-to-end (E2E) tests for better coverage ([#150](https://github.com/volkovlabs/business-media/pull/150)).
- Updated dependencies to support Grafana 11.3 ([#151](https://github.com/volkovlabs/business-media/pull/151)).

## [6.1.0] - 2024-09-05

### Added

- Enhanced media sources state management ([#137](https://github.com/volkovlabs/business-media/pull/137)).
- Introduced WebSocket server for streaming capabilities ([#140](https://github.com/volkovlabs/business-media/pull/140)).
- Updated dependencies to support Grafana 11.2 ([#141](https://github.com/volkovlabs/business-media/pull/141)).
- Added scroll option for images ([#142](https://github.com/volkovlabs/business-media/pull/142)).

## [6.0.0] - 2024-07-29

### Breaking Changes

- Image links in panel options must now use Data Links.
- PDF fields require updating the media source type to PDF.

### Added

- Added poster support for videos ([#120](https://github.com/volkovlabs/business-media/pull/120)).
- Updated current index handling on data series decrease ([#121](https://github.com/volkovlabs/business-media/pull/121)).
- Converted Image URL to Data Links ([#122](https://github.com/volkovlabs/business-media/pull/122)).
- Introduced slideshow functionality for mixed media ([#123](https://github.com/volkovlabs/business-media/pull/123)).
- Refactored Media panel for improved performance ([#124](https://github.com/volkovlabs/business-media/pull/124)).
- Added support for multiple queries in Media Field and Poster Image ([#127](https://github.com/volkovlabs/business-media/pull/127)).
- Updated dependencies to support Grafana 11.1 ([#128](https://github.com/volkovlabs/business-media/pull/128)).
- Documented PDF breaking changes and prepared for 6.0.0 release ([#132](https://github.com/volkovlabs/business-media/pull/132)).

## [5.1.0] - 2024-06-23

### Added

- Updated video overview documentation ([#100](https://github.com/volkovlabs/business-media/pull/100)).
- Added plugin E2E tests and removed Cypress dependency ([#101](https://github.com/volkovlabs/business-media/pull/101), [#102](https://github.com/volkovlabs/business-media/pull/102), [#103](https://github.com/volkovlabs/business-media/pull/103), [#105](https://github.com/volkovlabs/business-media/pull/105)).
- Added support for loading images and videos from URLs, along with a video toolbar ([#111](https://github.com/volkovlabs/business-media/pull/111), [#116](https://github.com/volkovlabs/business-media/pull/116)).
- Updated dependencies to support Grafana 11 ([#114](https://github.com/volkovlabs/business-media/pull/114)).
- Updated to use frame utilities from packages ([#115](https://github.com/volkovlabs/business-media/pull/115)).
- Improved E2E workflow using Docker ([#117](https://github.com/volkovlabs/business-media/pull/117)).

## [5.0.0] - 2024-03-25

### Breaking Changes

- Requires Grafana 10 or Grafana 11.

### Added

- Added customization options for alert messages ([#96](https://github.com/volkovlabs/business-media/pull/96)).
- Updated dependencies to support Grafana 10.4.1 ([#97](https://github.com/volkovlabs/business-media/pull/97)).
- Removed deprecated `ArrayVector` in preparation for Grafana 11 ([#99](https://github.com/volkovlabs/business-media/pull/99)).

## [4.2.0] - 2024-02-22

### Added

- Updated ESLint configuration and performed code refactoring ([#92](https://github.com/volkovlabs/business-media/pull/92)).
- Updated dependencies and GitHub Actions ([#94](https://github.com/volkovlabs/business-media/pull/94)).
- Added infinity play option for media playback ([#93](https://github.com/volkovlabs/business-media/pull/93)).

## [4.1.0] - 2023-10-29

### Added

- Updated ESLint configuration for better code quality ([#84](https://github.com/volkovlabs/business-media/pull/84)).
- Added Image Scale Algorithm option for better image rendering ([#89](https://github.com/volkovlabs/business-media/pull/89)).
- Updated to Plugin Tools 2.1.1 and Grafana 10.1.5, and used Grafana Access Policy to sign the plugin ([#90](https://github.com/volkovlabs/business-media/pull/90)).

## [4.0.0] - 2023-06-26

### Breaking Changes

- Requires Grafana 9 or Grafana 10.

### Added

- Added pan and pinch zooming options for images ([#78](https://github.com/volkovlabs/business-media/pull/78)).
- Moved pan and pinch buttons to the toolbar for better usability ([#79](https://github.com/volkovlabs/business-media/pull/79)).
- Updated dependencies to support Grafana 10.0.0 ([#80](https://github.com/volkovlabs/business-media/pull/80)).
- Added description label for media items ([#82](https://github.com/volkovlabs/business-media/pull/82)).
- Removed support for Grafana 8.5 ([#83](https://github.com/volkovlabs/business-media/pull/83)).

## [3.6.0] - 2023-06-06

### Added

- Updated dependencies to support Grafana 9.5.2 ([#70](https://github.com/volkovlabs/business-media/pull/70)).
- Added E2E testing with Cypress ([#71](https://github.com/volkovlabs/business-media/pull/71)).
- Migrated to Plugin Tools 1.5.2 and updated to Node 18 ([#72](https://github.com/volkovlabs/business-media/pull/72), [#73](https://github.com/volkovlabs/business-media/pull/73)).
- Increased test coverage for better reliability ([#72](https://github.com/volkovlabs/business-media/pull/72)).
- Tested compatibility with Grafana 10 Preview ([#74](https://github.com/volkovlabs/business-media/pull/74)).
- Added toolbar for downloading, zooming, and navigating between images ([#75](https://github.com/volkovlabs/business-media/pull/75), [#76](https://github.com/volkovlabs/business-media/pull/76), [#77](https://github.com/volkovlabs/business-media/pull/77)).

## [3.5.0] - 2023-03-07

### Added

- Updated CI and release workflows for better automation ([#64](https://github.com/volkovlabs/business-media/pull/64)).
- Updated dependencies to support Grafana 9.4.3 ([#65](https://github.com/volkovlabs/business-media/pull/65)).
- Set `NoPadding` to utilize panel space corner-to-corner ([#66](https://github.com/volkovlabs/business-media/pull/66)).

## [3.4.0] - 2023-01-08

### Added

- Updated dependencies to support Grafana 9.3.2 ([#60](https://github.com/volkovlabs/business-media/pull/60)).
- Added documentation links for better user guidance ([#61](https://github.com/volkovlabs/business-media/pull/61)).
- Updated README and documentation for clarity ([#62](https://github.com/volkovlabs/business-media/pull/62)).

## [3.3.0] - 2022-10-30

### Added

- Added support for sanitized variables in URL fields ([#53](https://github.com/volkovlabs/business-media/pull/53)).
- Updated CI to Node 16 and synchronized with release workflow ([#55](https://github.com/volkovlabs/business-media/pull/55)).
- Updated dependencies to support Grafana 9.2.2 ([#56](https://github.com/volkovlabs/business-media/pull/56)).

## [3.2.0] - 2022-10-05

### Added

- Updated dependencies to support Grafana 9.1.4 ([#47](https://github.com/volkovlabs/business-media/pull/47)).
- Added Compatibility Check Workflow for CI ([#48](https://github.com/volkovlabs/business-media/pull/48)).
- Added option to disable PDF toolbar ([#50](https://github.com/volkovlabs/business-media/pull/50)).
- Updated dependencies to support Grafana 9.1.7 ([#51](https://github.com/volkovlabs/business-media/pull/51)).

## [3.1.0] - 2022-08-13

### Added

- Updated README and provisioning dashboards documentation ([#43](https://github.com/volkovlabs/business-media/pull/43)).
- Added YouTube video in README for user guidance ([#44](https://github.com/volkovlabs/business-media/pull/44)).
- Rebuilt based on Grafana 9.0.7 ([#45](https://github.com/volkovlabs/business-media/pull/45)).
- Updated Grafana Marketplace image ([#46](https://github.com/volkovlabs/business-media/pull/46)).

## [3.0.0] - 2022-06-16

### Breaking Changes

- Requires Grafana 8.5+ or 9.0+.

### Added

- Rebuilt based on Grafana 9.0.0-beta3 ([#36](https://github.com/volkovlabs/business-media/pull/36)).
- Updated PDF loader to start in Docker environments ([#38](https://github.com/volkovlabs/business-media/pull/38)).
- Added support for short videos encoded in Base64 ([#39](https://github.com/volkovlabs/business-media/pull/39)).
- Added support for MP3 and OGG audio playback in Base64 ([#40](https://github.com/volkovlabs/business-media/pull/40)).
- Added options for video/audio controls and autoplay ([#41](https://github.com/volkovlabs/business-media/pull/41)).
- Rebuilt based on Grafana 9.0.0 ([#42](https://github.com/volkovlabs/business-media/pull/42)).

## [2.6.0] - 2022-04-26

### Added

- Rebuilt using Grafana 8.3.6 ([#32](https://github.com/volkovlabs/business-media/pull/32)).
- Rebuilt using Grafana 8.4.0 with PluginCheck v2 ([#33](https://github.com/volkovlabs/business-media/pull/33)).
- Rebuilt using Grafana 8.4.3 ([#34](https://github.com/volkovlabs/business-media/pull/34)).
- Based on Grafana 8.5.0 ([#35](https://github.com/volkovlabs/business-media/pull/35)).

## [2.5.0] - 2022-01-24

### Added

- Updated README to include Grafana Marketplace information ([#29](https://github.com/volkovlabs/business-media/pull/29)).
- Rebuilt using Grafana 8.3.4 ([#28](https://github.com/volkovlabs/business-media/pull/28)).

## [2.4.0] - 2021-12-16

### Added

- Upgraded to Grafana 8.2.5 ([#22](https://github.com/volkovlabs/business-media/pull/22)).
- Upgraded to Grafana 8.3.0 ([#23](https://github.com/volkovlabs/business-media/pull/23)).
- Updated to Grafana 8.3.2 ([#24](https://github.com/volkovlabs/business-media/pull/24)).
- Updated component naming for consistency ([#25](https://github.com/volkovlabs/business-media/pull/25)).
- Added support for PDF documents larger than 2MB ([#26](https://github.com/volkovlabs/business-media/pull/26)).

## [2.3.1] - 2021-11-09

### Added

- Added `display:block` to properly display href links ([Grafana Issue #41445](https://github.com/grafana/grafana/issues/41445)) ([#21](https://github.com/volkovlabs/business-media/pull/21)).

## [2.3.0] - 2021-11-08

### Added

- Added navigation to other dashboards from image clicks ([#19](https://github.com/volkovlabs/business-media/pull/19)).
- Upgraded to Grafana 8.2.3 ([#20](https://github.com/volkovlabs/business-media/pull/20)).

## [2.2.0] - 2021-11-02

### Added

- Upgraded to Grafana 8.1.5 ([#16](https://github.com/volkovlabs/business-media/pull/16)).
- Upgraded to Grafana 8.2.0 ([#17](https://github.com/volkovlabs/business-media/pull/17)).
- Upgraded to Grafana 8.2.2 ([#18](https://github.com/volkovlabs/business-media/pull/18)).

## [2.1.1] - 2021-08-18

### Added

- Added radio button to select image size modes ([#14](https://github.com/volkovlabs/business-media/pull/14)).

## [2.1.0] - 2021-08-12

### Added

- Updated README for better documentation ([#10](https://github.com/volkovlabs/business-media/pull/10)).
- Upgraded to Grafana 8.1.1 ([#12](https://github.com/volkovlabs/business-media/pull/12)).
- Added options and fields to resize images ([#13](https://github.com/volkovlabs/business-media/pull/13)).

## [2.0.0] - 2021-06-19

### Breaking Changes

- Supports Grafana 8.0+ only. For Grafana 7.x, use version 1.0.1 or 1.1.0.

### Added

- Based on Grafana 8.0.2 ([#9](https://github.com/volkovlabs/business-media/pull/9)).

## [1.1.0] - 2021-06-19

### Added

- Added support for displaying Base64 images with headers ([#7](https://github.com/volkovlabs/business-media/pull/7)).
- Added support for displaying Base64 images from InfluxDB ([#6](https://github.com/volkovlabs/business-media/pull/6)).
- Increased test coverage for better reliability ([#4](https://github.com/volkovlabs/business-media/pull/4)).

## [1.0.1] - 2021-06-07

### Added

- Added screenshots for Static and Redis data sources ([#5](https://github.com/volkovlabs/business-media/pull/5)).

## [1.0.0] - 2021-06-07

### Added

- Initial release based on Grafana 7.5.7.
- Supports PNG, JPG, GIF, and PDF formats.
