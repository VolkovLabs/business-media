import { Field, FieldType, PanelPlugin } from '@grafana/data';
import { ImageSizeModes } from './constants';
import { ButtonType, PanelOptions } from './types';
import { plugin } from './module';

/**
 * Test Field
 */
type TestField = Pick<Field, 'name' | 'type'>;

/**
 * Mock react-medium-image-zoom
 */
jest.mock('react-medium-image-zoom', () => ({
  Controlled: jest.fn(),
}));

/*
 Plugin
 */
describe('plugin', () => {
  /**
   * Builder
   */
  const builder: any = {
    addFieldNamePicker: jest.fn().mockImplementation(() => builder),
    addNumberInput: jest.fn().mockImplementation(() => builder),
    addRadio: jest.fn().mockImplementation(() => builder),
    addTextInput: jest.fn().mockImplementation(() => builder),
    addMultiSelect: jest.fn().mockImplementation(() => builder),
  };

  it('Should be instance of PanelPlugin', () => {
    expect(plugin).toBeInstanceOf(PanelPlugin);
  });

  it('Should add inputs', () => {
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
    expect(builder.addMultiSelect).toHaveBeenCalled();
  });

  describe('Input Visibility', () => {
    beforeEach(() => {
      builder.addFieldNamePicker.mockClear();
      builder.addNumberInput.mockClear();
    });

    /**
     * Add Input Implementation
     * @param config
     * @param result
     */
    const addInputImplementation = (config: Partial<PanelOptions>, result: string[]) => (input: any) => {
      if (input.showIf) {
        if (input.showIf(config)) {
          result.push(input.path);
        }
      } else {
        result.push(input.path);
      }
      return builder;
    };

    it('Should show widthName and width inputs only for widthMode=CUSTOM', () => {
      const shownOptionsPaths: string[] = [];

      builder.addFieldNamePicker.mockImplementation(
        addInputImplementation({ widthMode: ImageSizeModes.CUSTOM }, shownOptionsPaths)
      );
      builder.addNumberInput.mockImplementation(
        addInputImplementation({ widthMode: ImageSizeModes.CUSTOM }, shownOptionsPaths)
      );

      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['widthName', 'width']));
    });

    it('Should not show widthName and width inputs for widthMode!=CUSTOM', () => {
      const shownOptionsPaths: string[] = [];

      builder.addFieldNamePicker.mockImplementation(
        addInputImplementation({ widthMode: ImageSizeModes.AUTO }, shownOptionsPaths)
      );
      builder.addNumberInput.mockImplementation(
        addInputImplementation({ widthMode: ImageSizeModes.AUTO }, shownOptionsPaths)
      );

      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).not.toEqual(expect.arrayContaining(['widthName', 'width']));
    });

    it('Should show heightName and height inputs only for heightMode=CUSTOM', () => {
      const shownOptionsPaths: string[] = [];

      builder.addFieldNamePicker.mockImplementation(
        addInputImplementation({ heightMode: ImageSizeModes.CUSTOM }, shownOptionsPaths)
      );
      builder.addNumberInput.mockImplementation(
        addInputImplementation({ heightMode: ImageSizeModes.CUSTOM }, shownOptionsPaths)
      );

      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['heightName', 'height']));
    });

    it('Should not show heightName and height inputs only for heightMode!=CUSTOM', () => {
      const shownOptionsPaths: string[] = [];

      builder.addFieldNamePicker.mockImplementation(
        addInputImplementation({ heightMode: ImageSizeModes.AUTO }, shownOptionsPaths)
      );
      builder.addNumberInput.mockImplementation(
        addInputImplementation({ heightMode: ImageSizeModes.AUTO }, shownOptionsPaths)
      );

      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).not.toEqual(expect.arrayContaining(['heightName', 'height']));
    });

    it('Should show buttons field if toolbar enabled', () => {
      const shownOptionsPaths: string[] = [];

      builder.addMultiSelect.mockImplementation(addInputImplementation({ toolbar: true }, shownOptionsPaths));

      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['buttons']));
    });

    it('Should show zoom type field if toolbar and zoom enabled', () => {
      const shownOptionsPaths: string[] = [];

      builder.addRadio.mockImplementation(
        addInputImplementation({ toolbar: true, buttons: [ButtonType.ZOOM] }, shownOptionsPaths)
      );

      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['zoomType']));
    });
  });

  describe('Settings', () => {
    const addFieldNameImplementation =
      (optionPath: string, allFields: TestField[], shownFields: TestField[]) => (input: any) => {
        if (optionPath === input.path) {
          const fields = allFields.filter(input.settings.filter);
          shownFields.push(...fields);
        }
        return builder;
      };

    it('Should return only string fields for name', () => {
      const fields: TestField[] = [
        { name: 'string', type: FieldType.string },
        { name: 'number', type: FieldType.number },
      ];
      const shownFields: TestField[] = [];

      builder.addFieldNamePicker.mockImplementation(addFieldNameImplementation('name', fields, shownFields));

      plugin['optionsSupplier'](builder);

      expect(shownFields).toEqual([{ name: 'string', type: FieldType.string }]);
    });

    it('Should return only number fields for widthName', () => {
      const fields: TestField[] = [
        { name: 'string', type: FieldType.string },
        { name: 'number', type: FieldType.number },
      ];
      const shownFields: TestField[] = [];

      builder.addFieldNamePicker.mockImplementation(addFieldNameImplementation('widthName', fields, shownFields));

      plugin['optionsSupplier'](builder);

      expect(shownFields).toEqual([{ name: 'number', type: FieldType.number }]);
    });

    it('Should return only number fields for heightName', () => {
      const fields: TestField[] = [
        { name: 'string', type: FieldType.string },
        { name: 'number', type: FieldType.number },
      ];
      const shownFields: TestField[] = [];

      builder.addFieldNamePicker.mockImplementation(addFieldNameImplementation('heightName', fields, shownFields));

      plugin['optionsSupplier'](builder);

      expect(shownFields).toEqual([{ name: 'number', type: FieldType.number }]);
    });
  });
});
