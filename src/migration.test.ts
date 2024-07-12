import { getMigratedOptions } from './migration';
import { MediaFormat } from './types';

/**
 * Mock uuidv4
 */
jest.mock('uuid', () => ({
  v4: () => 'new-media',
}));

/**
 * Migration
 */
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

  it('Remove formats option', () => {
    const panel = {
      options: {
        formats: [],
      },
    } as any;

    const migratedOptions = getMigratedOptions(panel);

    expect(migratedOptions).not.toHaveProperty('formats');
  });
});

describe('5.2.0', () => {
  it('Replace name, videoUrl, imageUrl options', () => {
    const panel = {
      options: {
        imageUrl: 'imageURL',
        videoUrl: 'videoURL',
        name: 'imageField',
      },
      pluginVersion: '5.1.0',
    } as any;

    const migratedOptions = getMigratedOptions(panel);

    expect(migratedOptions).not.toHaveProperty('imageUrl');
    expect(migratedOptions).not.toHaveProperty('videoUrl');
    expect(migratedOptions).not.toHaveProperty('name');
    expect(migratedOptions.mediaSources).toEqual([
      { type: MediaFormat.VIDEO, id: 'new-media', field: 'videoURL', refId: '' },
      { type: MediaFormat.IMAGE, id: 'new-media', field: 'imageURL', refId: '' },
      { type: MediaFormat.IMAGE, id: 'new-media', field: 'imageField', refId: '' },
    ]);
  });
});
