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
      addFieldNamePicker: jest.fn().mockImplementation(() => builder),
      addNumberInput: jest.fn().mockImplementation(() => builder),
      addRadio: jest.fn().mockImplementation(() => builder),
      addTextInput: jest.fn().mockImplementation(() => builder),
    };

    /**
     * Supplier
     */
    plugin['optionsSupplier'](builder);

    /**
     * Inputs
     */
    expect(builder.addFieldNamePicker).toHaveBeenCalled();
    expect(builder.addNumberInput).toHaveBeenCalled();
    expect(builder.addRadio).toHaveBeenCalled();
    expect(builder.addTextInput).toHaveBeenCalled();
  });
});
