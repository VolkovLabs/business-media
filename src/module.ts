import { Field, FieldConfigProperty, FieldType, PanelPlugin } from '@grafana/data';

import { ImagePanel, MediaSourcesEditor } from './components';
import {
  BOOLEAN_OPTIONS,
  BUTTONS_OPTIONS,
  DEFAULT_OPTIONS,
  IMAGE_SCALE_OPTIONS,
  SIZE_MODE_OPTIONS,
  ZOOM_OPTIONS,
} from './constants';
import { getMigratedOptions } from './migration';
import { ButtonType, ImageSizeMode, MediaFormat, PanelOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(ImagePanel)
  .setNoPadding()
  .setMigrationHandler(getMigratedOptions)
  .useFieldConfig({
    disableStandardOptions: [
      FieldConfigProperty.Color,
      FieldConfigProperty.Decimals,
      FieldConfigProperty.DisplayName,
      FieldConfigProperty.Filterable,
      FieldConfigProperty.Mappings,
      FieldConfigProperty.Max,
      FieldConfigProperty.Min,
      FieldConfigProperty.NoValue,
      FieldConfigProperty.Thresholds,
      FieldConfigProperty.Unit,
      'unitScale' as never,
      'fieldMinMax' as never,
    ],
  })
  .setPanelOptions((builder) => {
    /**
     * Visibility
     */
    const showForAudioFormat = (config: PanelOptions) =>
      config.mediaSources && config.mediaSources.some((source) => source.type === MediaFormat.AUDIO);
    const showForImageFormat = (config: PanelOptions) =>
      config.mediaSources && config.mediaSources.some((source) => source.type === MediaFormat.IMAGE);
    const showVideoFormat = (config: PanelOptions) =>
      config.mediaSources && config.mediaSources.some((source) => source.type === MediaFormat.VIDEO);

    /**
     * Source
     */
    builder.addCustomEditor({
      id: 'mediaSources',
      path: 'mediaSources',
      name: 'Media Sources',
      description: 'Media Sources',
      editor: MediaSourcesEditor,
      settings: {
        filterByType: [FieldType.string],
      },
      defaultValue: DEFAULT_OPTIONS.mediaSources,
    });

    builder
      .addFieldNamePicker({
        path: 'description',
        name: 'Field description',
        description: `Name of the field with descriptions. If not specified, the description won't be shown.`,
        category: ['Text Options'],
        settings: {
          filter: (f: Field) => f.type === FieldType.string,
          noFieldsMessage: 'No strings fields found',
        },
      })
      .addTextInput({
        path: 'noResultsMessage',
        name: 'No Results Message',
        category: ['Text Options'],
        description: 'Specifies no results message text.',
        defaultValue: DEFAULT_OPTIONS.noResultsMessage,
      });

    /**
     * ToolBar
     */
    builder
      .addRadio({
        path: 'toolbar',
        name: 'Set appropriate controls',
        settings: {
          options: BOOLEAN_OPTIONS,
        },
        category: ['Toolbar'],
        defaultValue: DEFAULT_OPTIONS.toolbar,
      })
      .addMultiSelect({
        path: 'buttons',
        name: 'Select buttons to display on toolbar.',
        settings: {
          options: BUTTONS_OPTIONS,
        },
        defaultValue: DEFAULT_OPTIONS.buttons as unknown,
        category: ['Toolbar'],
        showIf: (options: PanelOptions) => options.toolbar,
      })
      .addRadio({
        path: 'pdfToolbar',
        name: 'Set display PDF reader toolbar',
        settings: {
          options: BOOLEAN_OPTIONS,
        },
        category: ['Toolbar'],
        defaultValue: DEFAULT_OPTIONS.toolbar,
      })
      .addRadio({
        path: 'zoomType',
        name: 'Select zoom mode.',
        settings: {
          options: ZOOM_OPTIONS,
        },
        defaultValue: DEFAULT_OPTIONS.zoomType,
        category: ['Toolbar'],
        showIf: (options: PanelOptions) => options.toolbar && options.buttons.includes(ButtonType.ZOOM),
      })
      .addNumberInput({
        path: 'autoPlayInterval',
        name: 'Auto play Interval',
        description: 'Set interval for auto play in seconds. If not specified, 5 seconds by default.',
        category: ['Toolbar'],
        showIf: (options: PanelOptions) => options.toolbar && options.buttons.includes(ButtonType.AUTOPLAY),
      })
      .addRadio({
        path: 'autoPlayInfinity',
        name: 'Auto Play infinity',
        settings: {
          options: BOOLEAN_OPTIONS,
        },
        category: ['Toolbar'],
        defaultValue: DEFAULT_OPTIONS.autoPlayInfinity,
        showIf: (options: PanelOptions) => options.toolbar && options.buttons.includes(ButtonType.AUTOPLAY),
      });

    /**
     * Image Options
     */
    builder.addSelect({
      path: 'scale',
      name: 'Scale Algorithm',
      category: ['Image'],
      settings: {
        options: IMAGE_SCALE_OPTIONS,
      },
      defaultValue: DEFAULT_OPTIONS.scale,
      showIf: (config) => showForImageFormat(config),
    });

    /**
     * Video / Audio Options
     */
    builder
      .addRadio({
        path: 'controls',
        name: 'Controls',
        description: 'When enabled, it specifies that video and audio controls should be displayed.',
        settings: {
          options: BOOLEAN_OPTIONS,
        },
        category: ['Video/Audio'],
        defaultValue: DEFAULT_OPTIONS.controls,
        showIf: (config) => showVideoFormat(config) || showForAudioFormat(config),
      })
      .addRadio({
        path: 'autoPlay',
        name: 'Auto Play',
        description: 'When enabled, the video and audio will automatically start playing without sound.',
        settings: {
          options: BOOLEAN_OPTIONS,
        },
        category: ['Video/Audio'],
        defaultValue: DEFAULT_OPTIONS.autoPlay,
        showIf: (config) => showVideoFormat(config) || showForAudioFormat(config),
      })
      .addRadio({
        path: 'infinityPlay',
        name: 'Infinity Play',
        description: 'When enabled, the video and audio will be played back repeatedly.',
        settings: {
          options: BOOLEAN_OPTIONS,
        },
        category: ['Video/Audio'],
        defaultValue: DEFAULT_OPTIONS.infinityPlay,
        showIf: (config) => showVideoFormat(config) || showForAudioFormat(config),
      })
      .addFieldNamePicker({
        path: 'videoPoster',
        name: 'Poster Image',
        description: 'Use URL or Base64 data for video poster preview.',
        settings: {
          filter: (f: Field) => f.type === FieldType.string,
          noFieldsMessage: 'No strings fields found',
        },
        category: ['Video/Audio'],
        showIf: (config) => showVideoFormat(config),
      });

    /**
     * Width
     */
    builder
      .addRadio({
        path: 'widthMode',
        name: 'Width',
        settings: {
          options: SIZE_MODE_OPTIONS,
        },
        category: ['Width'],
        defaultValue: DEFAULT_OPTIONS.widthMode,
      })
      .addFieldNamePicker({
        path: 'widthName',
        name: 'Field name',
        description: 'Name of the field with width in px.',
        settings: {
          filter: (f: Field) => f.type === FieldType.number,
          noFieldsMessage: 'No number fields found',
        },
        category: ['Width'],
        showIf: (options: PanelOptions) => options.widthMode === ImageSizeMode.CUSTOM,
      })
      .addNumberInput({
        path: 'width',
        name: 'Custom width (px)',
        defaultValue: DEFAULT_OPTIONS.width,
        category: ['Width'],
        showIf: (options: PanelOptions) => options.widthMode === ImageSizeMode.CUSTOM,
      });

    /**
     * Height
     */
    builder
      .addRadio({
        path: 'heightMode',
        name: 'Height',
        settings: {
          options: SIZE_MODE_OPTIONS,
        },
        category: ['Height'],
        defaultValue: DEFAULT_OPTIONS.heightMode,
      })
      .addFieldNamePicker({
        path: 'heightName',
        name: 'Field name',
        description: 'Name of the field with height in px.',
        settings: {
          filter: (f: Field) => f.type === FieldType.number,
          noFieldsMessage: 'No number fields found',
        },
        category: ['Height'],
        showIf: (options: PanelOptions) => options.heightMode === ImageSizeMode.CUSTOM,
      })
      .addNumberInput({
        path: 'height',
        name: 'Custom height (px)',
        defaultValue: DEFAULT_OPTIONS.height,
        category: ['Height'],
        showIf: (options: PanelOptions) => options.heightMode === ImageSizeMode.CUSTOM,
      });

    return builder;
  });
