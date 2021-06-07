import { PanelPlugin } from '@grafana/data';
import { ImagePanel } from './image-panel';
import { ImageOptions } from './types';

/**
 * Panel Plug-in
 */
export const plugin = new PanelPlugin<ImageOptions>(ImagePanel).setPanelOptions((builder) => {
  return builder.addTextInput({
    path: 'name',
    name: 'Field name',
    description: 'Name of the field with encoded image. If not specified, first field will be taken',
    defaultValue: '',
  });
});
