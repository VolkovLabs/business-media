import { getMigratedOptions } from './migration';

describe('Migration', () => {
  it('Remove url option', () => {
    const panel = {
      options: {
        url: 'link 1',
      },
    } as any;

    const migratedOptions = getMigratedOptions(panel);

    expect(migratedOptions).not.toHaveProperty('url');
  });

  it('Remove title option', () => {
    const panel = {
      options: {
        title: 'title',
      },
    } as any;

    const migratedOptions = getMigratedOptions(panel);

    expect(migratedOptions).not.toHaveProperty('title');
  });

  it('Should keep valid options', () => {
    const panel = {
      options: {
        someOption: 'value',
      },
    } as any;

    const migratedOptions = getMigratedOptions(panel);

    expect(migratedOptions).toEqual(panel.options);
  });
});
