import { PanelPlugin } from '@grafana/data';
import { plugin } from './module';

/*
 Plugin
 */
describe('plugin', () => {
  it('Should be instance of PanelPlugin', () => {
    expect(plugin).toBeInstanceOf(PanelPlugin);
  });

  it('Should add inputs', () => {
    /**
     * Builder
     */
    const builder: any = {
      addTextInput: jest.fn().mockImplementation(() => builder),
      addNumberInput: jest.fn().mockImplementation(() => builder),
    };

    /**
     * Inputs
     */
    plugin['registerOptionEditors'](builder);
    expect(builder.addTextInput).toHaveBeenCalled();
    expect(builder.addNumberInput).toHaveBeenCalled();
  });
});
