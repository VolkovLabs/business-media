import { Field, FieldConfigProperty, FieldType, PanelPlugin } from '@grafana/data';

import { ImagePanel } from './components';
import {
  BOOLEAN_OPTIONS,
  BUTTONS_OPTIONS,
  DEFAULT_OPTIONS,
  IMAGE_SCALE_OPTIONS,
  SIZE_MODE_OPTIONS,
  SUPPORT_FORMATS_OPTIONS,
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
    const showForAudioFormat = (config: PanelOptions) => config.formats.includes(MediaFormat.AUDIO);
    const showForImageFormat = (config: PanelOptions) => config.formats.includes(MediaFormat.IMAGE);
    const showVideoFormat = (config: PanelOptions) => config.formats.includes(MediaFormat.VIDEO);

    builder
      .addMultiSelect({
        path: 'formats',
        name: 'Select media formats',
        settings: {
          options: SUPPORT_FORMATS_OPTIONS,
        },
        defaultValue: DEFAULT_OPTIONS.formats as unknown,
      })

      .addFieldNamePicker({
        path: 'description',
        name: 'Field description',
        description: `Name of the field with descriptions. If not specified, the description won't be shown.`,
        settings: {
          filter: (f: Field) => f.type === FieldType.string,
          noFieldsMessage: 'No strings fields found',
        },
      })
      .addTextInput({
        path: 'noResultsMessage',
        name: 'No Results Message',
        description: 'Specifies no results message text.',
        defaultValue: DEFAULT_OPTIONS.noResultsMessage,
      });

    /**
     * Source
     */
    builder
      .addFieldNamePicker({
        path: 'videoUrl',
        name: 'Video URL',
        description: 'If not specified, Base64 field will be taken. First priority.',
        settings: {
          filter: (f: Field) => f.type === FieldType.string,
          noFieldsMessage: 'No strings fields found',
        },
        category: ['Media'],
        showIf: (config) => showVideoFormat(config),
      })
      .addFieldNamePicker({
        path: 'imageUrl',
        name: 'Image URL',
        description: 'If not specified, Base64 field will be taken. Second priority.',
        settings: {
          filter: (f: Field) => f.type === FieldType.string,
          noFieldsMessage: 'No strings fields found',
        },
        category: ['Media'],
        showIf: (config) => showForImageFormat(config),
      })
      .addFieldNamePicker({
        path: 'name',
        name: 'Base64 encoded',
        description:
          'Name of the field with encoded image, video, audio, and PDF. If not specified, first field will be taken. Third priority.',
        settings: {
          filter: (f: Field) => f.type === FieldType.string,
          noFieldsMessage: 'No strings fields found',
        },
        category: ['Media'],
      });

    /**
     * ToolBar
     */
    builder
      .addRadio({
        path: 'toolbar',
        name: 'Set appropriate controls. The default toolbar of the reader is used for PDF',
        settings: {
          options: BOOLEAN_OPTIONS,
        },
        category: ['Toolbar'],
        defaultValue: DEFAULT_OPTIONS.toolbar,
      })
      .addMultiSelect({
        path: 'buttons',
        name: 'Select buttons to display on toolbar. Images only.',
        settings: {
          options: BUTTONS_OPTIONS,
        },
        defaultValue: DEFAULT_OPTIONS.buttons as unknown,
        category: ['Toolbar'],
        showIf: (options: PanelOptions) => options.toolbar,
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
        description: 'Set interval for auto play in sec. If not specified, 5 sec. set by default',
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
        description: 'Use URL or Base64 data for video poster preview',
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
