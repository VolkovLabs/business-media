import { PanelPlugin } from '@grafana/data';
import { ImagePanel } from './image-panel';
import { PanelOptions } from './types';

/**
 * Panel Plug-in
 */
export const plugin = new PanelPlugin<PanelOptions>(ImagePanel).setPanelOptions((builder) => {
  return builder
    .addTextInput({
      path: 'name',
      name: 'Field name',
      description: 'Name of the field with encoded image. If not specified, first field will be taken.',
      defaultValue: '',
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
