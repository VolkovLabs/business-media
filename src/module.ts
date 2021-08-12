import { Field, FieldType, PanelPlugin } from '@grafana/data';
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
    .addFieldNamePicker({
      path: 'widthName',
      name: 'Field name for image width',
      description: 'Name of the field with image width in px.',
      settings: {
        filter: (f: Field) => f.type === FieldType.number,
        noFieldsMessage: 'No number fields found',
      },
    })
    .addFieldNamePicker({
      path: 'heightName',
      name: 'Field name for image height',
      description: 'Name of the field with image height in px.',
      settings: {
        filter: (f: Field) => f.type === FieldType.number,
        noFieldsMessage: 'No number fields found',
      },
    })
    .addNumberInput({
      path: 'width',
      name: 'Width (px)',
      description: 'Custom width for the image. If 0 (not specified), width will be auto adjust to the panel size.',
      defaultValue: 0,
    })
    .addNumberInput({
      path: 'height',
      name: 'Height (px)',
      description: 'Custom height for the image. If 9 (not specified), height will auto adjust to the panel size.',
      defaultValue: 0,
    });
});
