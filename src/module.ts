import { Field, FieldType, PanelPlugin } from '@grafana/data';
import { ImagePanel } from './components';
import { ButtonsOptions, DefaultOptions, ImageSizeModes, SizeModeOptions } from './constants';
import { PanelOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(ImagePanel).setNoPadding().setPanelOptions((builder) => {
  builder
    .addFieldNamePicker({
      path: 'name',
      name: 'Field name',
      description:
        'Name of the field with encoded image, video, audio or PDF. If not specified, first field will be taken.',
      settings: {
        filter: (f: Field) => f.type === FieldType.string,
        noFieldsMessage: 'No strings fields found',
      },
    })
    .addRadio({
      path: 'toolbar',
      name: 'Toolbar',
      description: 'Display toolbar for images and PDF files.',
      settings: {
        options: [
          { value: true, label: 'Enabled' },
          { value: false, label: 'Disabled' },
        ],
      },
      defaultValue: DefaultOptions.toolbar,
    })
    .addMultiSelect({
      path: 'buttons',
      name: 'Select buttons to display on toolbar.',
      settings: {
        options: ButtonsOptions as any,
      },
      defaultValue: DefaultOptions.buttons,
      showIf: (options: PanelOptions) => options.toolbar,
    });

  /**
   * URL
   */
  builder
    .addTextInput({
      path: 'url',
      name: 'Image URL',
      description: 'Specifies the URL of the page the click on image goes to.',
      category: ['URL'],
    })
    .addTextInput({
      path: 'title',
      name: 'Title',
      category: ['URL'],
    });

  /**
   * Width
   */
  builder
    .addRadio({
      path: 'widthMode',
      name: 'Width',
      settings: {
        options: SizeModeOptions,
      },
      category: ['Width'],
      defaultValue: DefaultOptions.widthMode,
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
      showIf: (options: PanelOptions) => options.widthMode === ImageSizeModes.CUSTOM,
    })
    .addNumberInput({
      path: 'width',
      name: 'Custom width (px)',
      defaultValue: DefaultOptions.width,
      category: ['Width'],
      showIf: (options: PanelOptions) => options.widthMode === ImageSizeModes.CUSTOM,
    });

  /**
   * Height
   */
  builder
    .addRadio({
      path: 'heightMode',
      name: 'Height',
      settings: {
        options: SizeModeOptions,
      },
      category: ['Height'],
      defaultValue: DefaultOptions.heightMode,
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
      showIf: (options: PanelOptions) => options.heightMode === ImageSizeModes.CUSTOM,
    })
    .addNumberInput({
      path: 'height',
      name: 'Custom height (px)',
      defaultValue: DefaultOptions.height,
      category: ['Height'],
      showIf: (options: PanelOptions) => options.heightMode === ImageSizeModes.CUSTOM,
    });

  /**
   * Video / Audio
   */
  builder
    .addRadio({
      path: 'controls',
      name: 'Controls',
      description: 'When enabled, it specifies that video and audio controls should be displayed.',
      settings: {
        options: [
          { value: true, label: 'Enabled' },
          { value: false, label: 'Disabled' },
        ],
      },
      category: ['Video/Audio'],
      defaultValue: DefaultOptions.controls,
    })
    .addRadio({
      path: 'autoPlay',
      name: 'Auto Play',
      description: 'When enabled, the video and audio will automatically start playing.',
      settings: {
        options: [
          { value: true, label: 'Enabled' },
          { value: false, label: 'Disabled' },
        ],
      },
      category: ['Video/Audio'],
      defaultValue: DefaultOptions.autoPlay,
    });

  return builder;
});
