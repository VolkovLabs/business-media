import { PanelPlugin } from '@grafana/data';
import { plugin } from './module';

/*
 Plugin
 */
describe('plugin', () => {
  it('Should be instance of PanelPlugin', () => {
    expect(plugin).toBeInstanceOf(PanelPlugin);
  });

  it('Should add name input', () => {
    /**
     * Builder
     */
    const builder: any = {
      addTextInput: jest.fn().mockImplementation(() => builder),
    };

    /**
     * Name
     */
    plugin['registerOptionEditors'](builder);
    expect(builder.addTextInput).toHaveBeenCalled();
  });
});
