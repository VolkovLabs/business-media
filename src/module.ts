import { Field, FieldType, PanelPlugin } from '@grafana/data';
import { ImageSizeModes } from './constants';
import { ImagePanel } from './image-panel';
import { PanelOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(ImagePanel).setPanelOptions((builder) => {
  return builder
    .addFieldNamePicker({
      path: 'name',
      name: 'Field name for Image',
      description: 'Name of the field with encoded image. If not specified, first field will be taken.',
      settings: {
        filter: (f: Field) => f.type === FieldType.string,
        noFieldsMessage: 'No strings fields found',
      },
    })
    .addRadio({
      path: 'widthMode',
      name: 'Width',
      settings: {
        options: [
          { value: ImageSizeModes.AUTO, label: 'Panel', description: 'Based on panel size' },
          { value: ImageSizeModes.ORIGINAL, label: 'Original' },
          { value: ImageSizeModes.CUSTOM, label: 'Custom' },
        ],
      },
      defaultValue: ImageSizeModes.AUTO,
    })
    .addFieldNamePicker({
      path: 'widthName',
      name: 'Field name for image width',
      description: 'Name of the field with image width in px.',
      settings: {
        filter: (f: Field) => f.type === FieldType.number,
        noFieldsMessage: 'No number fields found',
      },
      showIf: (options: any) => options.widthMode === ImageSizeModes.CUSTOM,
    })
    .addNumberInput({
      path: 'width',
      name: 'Custom width (px)',
      defaultValue: 0,
      showIf: (options: any) => options.widthMode === ImageSizeModes.CUSTOM,
    })
    .addRadio({
      path: 'heightMode',
      name: 'Height',
      settings: {
        options: [
          { value: ImageSizeModes.AUTO, label: 'Panel', description: 'Based on panel size' },
          { value: ImageSizeModes.ORIGINAL, label: 'Original' },
          { value: ImageSizeModes.CUSTOM, label: 'Custom' },
        ],
      },
      defaultValue: ImageSizeModes.AUTO,
    })
    .addFieldNamePicker({
      path: 'heightName',
      name: 'Field name for image height',
      description: 'Name of the field with image height in px.',
      settings: {
        filter: (f: Field) => f.type === FieldType.number,
        noFieldsMessage: 'No number fields found',
      },
      showIf: (options: any) => options.heightMode === ImageSizeModes.CUSTOM,
    })
    .addNumberInput({
      path: 'height',
      name: 'Custom height (px)',
      defaultValue: 0,
      showIf: (options: any) => options.heightMode === ImageSizeModes.CUSTOM,
    });
});
