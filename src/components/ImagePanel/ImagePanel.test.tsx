import { FieldType, toDataFrame } from '@grafana/data';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { saveAs } from 'file-saver';
import React from 'react';

import { TEST_IDS } from '../../constants';
import { ButtonType, ImageField, ImageSizeMode, MediaFormat, ZoomType } from '../../types';
import { ImagePanel } from './ImagePanel';

/**
 * Mock @grafana/ui
 */
jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  PageToolbar: jest.fn(({ leftItems, children }) => {
    return (
      <>
        {leftItems}
        {children}
      </>
    );
  }),
}));

/**
 * Mock file-saver
 */
jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

/**
 * Mock react-medium-image-zoom
 */
jest.mock('react-medium-image-zoom', () => ({
  Controlled: jest.fn(({ isZoomed, children, zoomImg }) => {
    return isZoomed ? <img data-testid={TEST_IDS.panel.zoomedImage} src={zoomImg.src} alt="" /> : children;
  }),
}));

/**
 * Mock timers
 */
jest.useFakeTimers();

/**
 * Image Panel
 */
describe('Image Panel', () => {
  window.URL.createObjectURL = jest.fn();

  const getComponent = ({ options = { name: '' }, data = { series: [] }, ...restProps }: any) => {
    return <ImagePanel data={data} {...restProps} options={options} />;
  };

  const elementHeight = 40;

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: elementHeight });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should output message', async () => {
    render(
      getComponent({
        data: {
          series: [
            toDataFrame({
              name: 'data',
              fields: [],
            }),
          ],
        },
        options: {
          noResultsMessage: 'No results...',
          mediaSources: [],
        },
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.warning)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.warning)).toHaveTextContent('No results...');
  });

  it('Should output message if mediaSources not specified', async () => {
    render(
      getComponent({
        data: {
          series: [
            toDataFrame({
              name: 'data',
              fields: [
                {
                  type: FieldType.string,
                  name: ImageField.IMG,
                  values: ['/9j/4AAQSkZJRAAdLxAACEAAIX/9k='],
                },
              ],
            }),
          ],
        },
        options: {
          noResultsMessage: 'No results...',
          mediaSources: [],
        },
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.warning)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.warning)).toHaveTextContent('No results...');
  });

  it('Should render image', async () => {
    render(
      getComponent({
        data: {
          series: [
            toDataFrame({
              name: 'data',
              fields: [
                {
                  type: FieldType.string,
                  name: ImageField.IMG,
                  values: ['/9j/4AAQSkZJRAAdLxAACEAAIX/9k='],
                },
              ],
            }),
          ],
        },
        options: {
          mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
        },
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();
  });

  it('Should render application pdf', async () => {
    render(
      getComponent({
        data: {
          series: [
            toDataFrame({
              name: 'data',
              fields: [
                {
                  type: FieldType.string,
                  name: 'pdf',
                  values: ['JVBERi0xLjMKJcTl8uXrp/jQ0CiUlRU9GCg=='],
                },
              ],
            }),
          ],
        },
        options: {
          mediaSources: [{ type: MediaFormat.PDF, id: 'pdf1', field: 'pdf' }],
        },
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.iframe)).toBeInTheDocument();
  });

  it('Should render image with header', async () => {
    render(
      getComponent({
        data: {
          series: [
            toDataFrame({
              name: 'data',
              fields: [
                {
                  type: FieldType.string,
                  name: ImageField.IMG,
                  values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                },
              ],
            }),
          ],
        },
        options: {
          mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
        },
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();
  });

  it('Should render application with header', async () => {
    render(
      getComponent({
        data: {
          series: [
            toDataFrame({
              name: 'data',
              fields: [
                {
                  type: FieldType.string,
                  name: 'pdf',
                  values: ['data:application/pdf;base64,JVBERiiUlRU9GCg=='],
                },
              ],
            }),
          ],
        },
        options: {
          mediaSources: [{ type: MediaFormat.PDF, id: 'pdf1', field: 'pdf' }],
        },
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.iframe)).toBeInTheDocument();
  });

  it('Should render raw image', async () => {
    render(
      getComponent({
        data: {
          series: [
            toDataFrame({
              name: 'data',
              fields: [
                {
                  type: FieldType.string,
                  name: 'raw',
                  values: ['?PNGIHDR 3z??	pHYs'],
                },
              ],
            }),
          ],
        },
        options: {
          mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: 'raw' }],
        },
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();
  });

  it('Should render raw image with scroll container', async () => {
    render(
      getComponent({
        data: {
          series: [
            toDataFrame({
              name: 'data',
              fields: [
                {
                  type: FieldType.string,
                  name: 'raw',
                  values: ['?PNGIHDR 3z??	pHYs'],
                },
              ],
            }),
          ],
        },
        options: {
          mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: 'raw' }],
          widthMode: ImageSizeMode.SCROLL,
          heightMode: ImageSizeMode.SCROLL,
        },
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.imageScrollContainer)).toBeInTheDocument();
  });

  it('Should render raw image with URL', async () => {
    render(
      getComponent({
        data: {
          series: [
            toDataFrame({
              name: 'data',
              fields: [
                {
                  type: FieldType.string,
                  name: 'raw',
                  values: ['?PNGIHDR 3z??	pHYs'],
                  getLinks: () => [{ href: 'link1', title: 'test title', target: '_blank' }],
                },
              ],
            }),
          ],
        },
        options: {
          name: '',
          url: 'test',
          mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: 'raw' }],
        },
        replaceVariables: (str: string) => str,
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.imageLink)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.imageLink)).toHaveAttribute('target', '_blank');
    expect(screen.getByTestId(TEST_IDS.panel.imageLink)).toHaveAttribute('href', 'link1');
    expect(screen.getByTestId(TEST_IDS.panel.imageLink)).toHaveAttribute('title', 'test title');
  });

  describe('Image height', () => {
    it('Should render raw image with correct width and height', async () => {
      render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: 'raw',
                    values: ['?PNGIHDR 3z??	pHYs'],
                  },
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                  },
                ],
              }),
            ],
          },
          options: {
            widthMode: ImageSizeMode.AUTO,
            heightMode: ImageSizeMode.AUTO,
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: 'raw' }],
          },
          height: 50,
          width: 50,
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle(`width: 50px`);
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle(`height: 50px`);
    });

    it('Should remove toolbar height from image height', async () => {
      render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: 'raw',
                    values: ['?PNGIHDR 3z??	pHYs'],
                  },
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                  },
                ],
              }),
            ],
          },
          options: {
            widthMode: ImageSizeMode.AUTO,
            heightMode: ImageSizeMode.AUTO,
            toolbar: true,
            buttons: [ButtonType.DOWNLOAD],
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: 'raw' }],
          },
          height: 200,
          width: 200,
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle(`width: 200px`);
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle(`height: ${(200 - elementHeight).toString()}px`);
    });

    it('Should remove description height from image height', async () => {
      render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: 'imageDescription',
                    values: ['description'],
                  },
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                  },
                ],
              }),
            ],
          },
          options: {
            description: 'imageDescription',
            widthMode: ImageSizeMode.AUTO,
            heightMode: ImageSizeMode.AUTO,
            toolbar: true,
            buttons: [ButtonType.DOWNLOAD],
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
          },
          height: 200,
          width: 200,
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle(`width: 200px`);
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle(`height: ${(200 - elementHeight * 2).toString()}px`);
    });

    it('Should not remove description height if no description', async () => {
      render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                  },
                ],
              }),
            ],
          },
          options: {
            description: 'imageDescription',
            widthMode: ImageSizeMode.AUTO,
            heightMode: ImageSizeMode.AUTO,
            toolbar: true,
            buttons: [ButtonType.DOWNLOAD],
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
          },
          height: 200,
          width: 200,
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle('width: 200px');
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle(`height: ${(200 - elementHeight).toString()}px`);
    });

    describe('Image height updates', () => {
      const data = {
        series: [
          toDataFrame({
            name: 'data',
            fields: [
              {
                type: FieldType.string,
                name: 'raw',
                values: ['?PNGIHDR 3z??	pHYs'],
              },
              {
                type: FieldType.string,
                name: ImageField.IMG,
                values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
              },
            ],
          }),
        ],
      };
      const options = {
        widthMode: ImageSizeMode.AUTO,
        heightMode: ImageSizeMode.AUTO,
        toolbar: true,
        buttons: [ButtonType.DOWNLOAD],
        mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
      };

      it('Should update image height if panel size changed', async () => {
        const { rerender } = render(
          getComponent({
            data,
            options,
            height: 200,
            width: 200,
          })
        );

        expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();

        expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle('width: 200px');
        expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle(`height: ${(200 - elementHeight).toString()}px`);
        /**
         * Rerender with updated panel size
         */
        rerender(
          getComponent({
            data,
            options,
            height: 300,
            width: 200,
          })
        );

        expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle(`height: ${(300 - elementHeight).toString()}px`);
      });

      it('Should update image height if toolbar hidden', async () => {
        const { rerender } = render(
          getComponent({
            data,
            options,
            height: 200,
            width: 200,
          })
        );

        expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();

        expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle(`width: 200px`);
        expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle(`height: ${(200 - elementHeight).toString()}px`);

        /**
         * Rerender with hidden toolbar
         */
        rerender(
          getComponent({
            data,
            options: {
              ...options,
              toolbar: false,
            },
            height: 200,
            width: 200,
          })
        );

        expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle(`height: ${(200).toString()}px`);
      });

      it('Should update image height if only zoom enabled and it type changed', async () => {
        const buttons = [ButtonType.ZOOM];
        const { rerender } = render(
          getComponent({
            data,
            options: {
              ...options,
              buttons,
              zoomType: ZoomType.DEFAULT,
            },
            height: 200,
            width: 200,
          })
        );

        expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();

        expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle('width: 200px');
        expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle(`height: ${(200 - elementHeight).toString()}px`);

        /**
         * Rerender with pan pinch zoom type
         */
        rerender(
          getComponent({
            data,
            options: {
              ...options,
              buttons,
              zoomType: ZoomType.PANPINCH,
            },
            height: 200,
            width: 200,
          })
        );
        expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle(`height: ${(200 - elementHeight).toString()}px`);
      });
    });

    it('Should render image with custom size options', async () => {
      render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: 'raw',
                    values: ['?PNGIHDR 3z??	pHYs'],
                  },
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                  },
                ],
              }),
            ],
          },
          options: {
            widthMode: ImageSizeMode.CUSTOM,
            heightMode: ImageSizeMode.CUSTOM,
            widthName: ImageField.WIDTH,
            heightName: ImageField.HEIGHT,
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
            width: 20,
            height: 20,
          },
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle('width: 20px');
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle('height: 20px');
    });

    it('Should render image with custom size fields', async () => {
      render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: 'raw',
                    values: ['?PNGIHDR 3z??	pHYs'],
                  },
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                  },
                  {
                    type: FieldType.number,
                    name: ImageField.HEIGHT,
                    values: [20],
                  },
                  {
                    type: FieldType.number,
                    name: ImageField.WIDTH,
                    values: [20],
                  },
                ],
              }),
            ],
          },
          options: {
            widthMode: ImageSizeMode.CUSTOM,
            heightMode: ImageSizeMode.CUSTOM,
            widthName: ImageField.WIDTH,
            heightName: ImageField.HEIGHT,
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
          },
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle('width: 20px');
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle('height: 20px');
    });

    it('Should render image with original size', async () => {
      render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: 'raw',
                    values: ['?PNGIHDR 3z??	pHYs'],
                  },
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                  },
                ],
              }),
            ],
          },
          options: {
            widthMode: ImageSizeMode.ORIGINAL,
            heightMode: ImageSizeMode.ORIGINAL,
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
          },
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle('width: auto');
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveStyle('height: auto');
    });
  });

  it('Should render video with header', async () => {
    render(
      getComponent({
        data: {
          series: [
            toDataFrame({
              name: 'data',
              fields: [
                {
                  type: FieldType.string,
                  name: 'video',
                  values: ['data:video/mp4;base64,JVBERiiUlRU9GCg=='],
                },
              ],
            }),
          ],
        },
        options: {
          mediaSources: [{ type: MediaFormat.VIDEO, id: 'v1', field: 'video' }],
        },
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.video)).toBeInTheDocument();
  });

  it('Should render video with toolbar', async () => {
    render(
      getComponent({
        data: {
          series: [
            toDataFrame({
              name: 'data',
              fields: [
                {
                  type: FieldType.string,
                  name: 'video',
                  values: ['data:video/mp4;base64,JVBERiiUlRU9GCg=='],
                },
              ],
            }),
          ],
        },
        options: {
          toolbar: true,
          buttons: [ButtonType.DOWNLOAD, ButtonType.NAVIGATION, ButtonType.ZOOM],
          mediaSources: [{ type: MediaFormat.VIDEO, id: 'v1', field: 'video' }],
        },
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.video)).toBeInTheDocument();

    /**
     * Toolbar
     * should not show download button for video
     */
    expect(screen.queryByTestId(TEST_IDS.panel.buttonDownload)).not.toBeInTheDocument();

    /**
     * Toolbar
     * should not show zoom button for video
     */
    expect(screen.queryByTestId(TEST_IDS.panel.buttonZoom)).not.toBeInTheDocument();
  });

  it('Should render audio with header', async () => {
    render(
      getComponent({
        data: {
          series: [
            toDataFrame({
              name: 'data',
              fields: [
                {
                  type: FieldType.string,
                  name: 'audio',
                  values: ['data:audio/mp3;base64,JVBERiiUlRU9GCg=='],
                },
              ],
            }),
          ],
        },
        options: {
          mediaSources: [{ type: MediaFormat.AUDIO, id: 'v1', field: 'audio' }],
        },
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.audio)).toBeInTheDocument();
  });

  it('Should render video from url', async () => {
    render(
      getComponent({
        options: {
          mediaSources: [{ type: MediaFormat.VIDEO, id: 'v1', field: 'videoUrl' }],
        },
        data: {
          series: [
            toDataFrame({
              name: 'data',
              fields: [
                {
                  type: FieldType.string,
                  name: ImageField.IMG,
                  values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                },
                {
                  type: FieldType.string,
                  name: 'videoUrl',
                  values: ['https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4'],
                },
              ],
            }),
          ],
        },
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.video)).toBeInTheDocument();
  });

  it('Should render video with poster from url', async () => {
    render(
      getComponent({
        options: {
          mediaSources: [{ type: MediaFormat.VIDEO, id: 'v1', field: 'videoUrl' }],
          videoPoster: 'posterUrl',
        },
        data: {
          series: [
            toDataFrame({
              name: 'data',
              fields: [
                {
                  type: FieldType.string,
                  name: ImageField.IMG,
                  values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                },
                {
                  type: FieldType.string,
                  name: 'videoUrl',
                  values: ['https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4'],
                },
                {
                  type: FieldType.string,
                  name: 'posterUrl',
                  values: ['https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217'],
                },
              ],
            }),
          ],
        },
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.video)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.video)).toHaveAttribute(
      'poster',
      'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217'
    );
  });

  it('Should render video with Base64 poster', async () => {
    render(
      getComponent({
        options: {
          mediaSources: [{ type: MediaFormat.VIDEO, id: 'v1', field: 'videoUrl' }],
          videoPoster: 'posterImage',
        },
        data: {
          series: [
            toDataFrame({
              name: 'data',
              fields: [
                {
                  type: FieldType.string,
                  name: ImageField.IMG,
                  values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                },
                {
                  type: FieldType.string,
                  name: 'videoUrl',
                  values: ['https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4'],
                },
                {
                  type: FieldType.string,
                  name: 'posterImage',
                  values: ['/9j/4AAQSkZJRAAdLxAACEAAIX/9k='],
                },
              ],
            }),
          ],
        },
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.video)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.video)).toHaveAttribute(
      'poster',
      'data:image/jpeg;base64,/9j/4AAQSkZJRAAdLxAACEAAIX/9k='
    );
  });

  it('Should render image from url', async () => {
    render(
      getComponent({
        options: {
          mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: 'imageUrl' }],
        },
        data: {
          series: [
            toDataFrame({
              name: 'data',
              fields: [
                {
                  type: FieldType.string,
                  name: ImageField.IMG,
                  values: ['data:audio/mp3;base64,JVBERiiUlRU9GCg=='],
                },
                {
                  type: FieldType.string,
                  name: 'videoUrl',
                  values: ['https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4'],
                },
                {
                  type: FieldType.string,
                  name: 'imageUrl',
                  values: ['https://volkovlabs.io/img/index/main.svg'],
                },
              ],
            }),
          ],
        },
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();
  });

  /**
   * Toolbar
   */
  describe('Toolbar', () => {
    it('Should show download button for image and download image with base64 source type if url not specified', () => {
      const image = '/9j/4AAQSkZJRAAdLxAACEAAIX/9k=';
      render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: [image],
                  },
                ],
              }),
            ],
          },
          options: {
            toolbar: true,
            buttons: [ButtonType.DOWNLOAD],
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
          },
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.buttonDownload)).toBeInTheDocument();

      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonDownload));

      expect(saveAs).toHaveBeenCalledWith('data:image/jpeg;base64,/9j/4AAQSkZJRAAdLxAACEAAIX/9k=');
    });

    it('Should show download button for image and download image with url source', () => {
      const image = '/9j/4AAQSkZJRAAdLxAACEAAIX/9k=';
      const imageUrl = 'https://volkovlabs.io/img/index/main.svg';
      render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: [image],
                  },
                  {
                    type: FieldType.string,
                    name: 'imageUrl',
                    values: [imageUrl],
                  },
                ],
              }),
            ],
          },
          options: {
            toolbar: true,
            buttons: [ButtonType.DOWNLOAD],
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: 'imageUrl' }],
          },
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.buttonDownload)).toBeInTheDocument();

      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonDownload));

      expect(saveAs).toHaveBeenCalledWith(imageUrl);
    });

    it('Should not show download button', () => {
      render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: ['/9j/4AAQSkZJRAAdLxAACEAAIX/9k='],
                  },
                ],
              }),
            ],
          },
          options: {
            toolbar: true,
            buttons: [],
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
          },
        })
      );

      expect(screen.queryByTestId(TEST_IDS.panel.buttonDownload)).not.toBeInTheDocument();
    });

    it('Should show zoom button for image', () => {
      const image = '/9j/4AAQSkZJRAAdLxAACEAAIX/9k=';
      render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: [image],
                  },
                ],
              }),
            ],
          },
          options: {
            toolbar: true,
            buttons: [ButtonType.ZOOM],
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
          },
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.buttonZoom)).toBeInTheDocument();
      expect(screen.queryByTestId(TEST_IDS.panel.zoomedImage)).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonZoom));

      expect(screen.getByTestId(TEST_IDS.panel.zoomedImage)).toBeInTheDocument();
    });

    it('Should show zoom button for image with url', () => {
      const image = '/9j/4AAQSkZJRAAdLxAACEAAIX/9k=';
      const imageUrl = 'https://volkovlabs.io/img/index/main.svg';
      render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: [image],
                  },
                  {
                    type: FieldType.string,
                    name: 'imageUrl',
                    values: [imageUrl],
                  },
                ],
              }),
            ],
          },
          options: {
            toolbar: true,
            buttons: [ButtonType.ZOOM],
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: 'imageUrl' }],
          },
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.buttonZoom)).toBeInTheDocument();
      expect(screen.queryByTestId(TEST_IDS.panel.zoomedImage)).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonZoom));

      expect(screen.getByTestId(TEST_IDS.panel.zoomedImage)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.zoomedImage)).toHaveAttribute('src', imageUrl);
    });

    it('Should show pan pinch zoom controls for image', () => {
      const image = '/9j/4AAQSkZJRAAdLxAACEAAIX/9k=';
      render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: [image],
                  },
                ],
              }),
            ],
          },
          options: {
            toolbar: true,
            buttons: [ButtonType.ZOOM],
            zoomType: ZoomType.PANPINCH,
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
          },
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.buttonZoomPanPinchIn)).toBeInTheDocument();
    });

    it('Should pan pinch zoom image', () => {
      const image = '/9j/4AAQSkZJRAAdLxAACEAAIX/9k=';
      render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: [image],
                  },
                ],
              }),
            ],
          },
          options: {
            toolbar: true,
            buttons: [ButtonType.ZOOM],
            zoomType: ZoomType.PANPINCH,
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
          },
        })
      );

      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonZoomPanPinchIn));
      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonZoomPanPinchOut));
      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonZoomPanPinchReset));

      /**
       * Unable to check zooming through unit tests because mocking ref causes warnings
       * so just check if image is rendered after zooming
       */
      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();
    });

    it('Should change current image', () => {
      const image1 = 'abc';
      const image2 = 'bar';
      const image3 = 'baz';
      render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: [image1, image2, image3],
                  },
                ],
              }),
            ],
          },
          options: {
            toolbar: true,
            buttons: [ButtonType.NAVIGATION],
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
          },
        })
      );

      /**
       * Check if first value is rendered
       */
      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image1}`);

      /**
       * Check if second value is rendered
       */
      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonNext));

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image2}`);

      /**
       * Check if first value is rendered again
       */
      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonPrevious));

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image1}`);

      /**
       * Check if previous button moves to last image
       */
      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonPrevious));

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image3}`);

      /**
       * Check if next button moves to first image
       */
      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonNext));

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image1}`);
    });

    it('Should change current index correctly if data series change', () => {
      const image1 = 'abc';
      const image2 = 'bar';
      const image3 = 'baz';
      const { rerender } = render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: [image1, image2, image3],
                  },
                ],
              }),
            ],
          },
          options: {
            toolbar: true,
            buttons: [ButtonType.NAVIGATION],
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
          },
        })
      );

      /**
       * Check if first value is rendered
       */
      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image1}`);

      /**
       * Go to last image
       */
      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonNext));
      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonNext));

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image3}`);

      /**
       * Rerender with update data
       */
      rerender(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: [image1, image2],
                  },
                ],
              }),
            ],
          },
          options: {
            toolbar: true,
            buttons: [ButtonType.NAVIGATION],
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
          },
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image2}`);
    });

    it('Should show autoPlay button', () => {
      const image1 = 'abc';
      const image2 = 'bar';
      const image3 = 'baz';
      render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: [image1, image2, image3],
                  },
                ],
              }),
            ],
          },
          options: {
            toolbar: true,
            buttons: [ButtonType.NAVIGATION, ButtonType.AUTOPLAY],
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
            autoPlayInterval: 1,
          },
        })
      );

      /**
       * Check if first value is rendered
       */
      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image1}`);

      /**
       * Check if autoPlay button
       */
      expect(screen.getByTestId(TEST_IDS.panel.buttonPlay)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.buttonPlay)).toHaveTextContent('Play');

      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonPlay));

      /**
       * Check if autoPlay button change text correctly
       */
      expect(screen.getByTestId(TEST_IDS.panel.buttonPause)).toHaveTextContent('Pause');
    });

    it('Should show autoPlay button and repeat slideshow again', () => {
      const image1 = 'abc';
      const image2 = 'bar';
      const image3 = 'baz';
      render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: [image1, image2, image3],
                  },
                ],
              }),
            ],
          },
          options: {
            toolbar: true,
            buttons: [ButtonType.NAVIGATION, ButtonType.AUTOPLAY],
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
          },
        })
      );

      /**
       * Check if first value is rendered
       */
      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image1}`);

      /**
       * Check if autoPlay button
       */
      expect(screen.getByTestId(TEST_IDS.panel.buttonPlay)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.buttonPlay)).toHaveTextContent('Play');

      /**
       * Set last slide
       */
      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonNext));
      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonNext));

      /**
       * Check if last value is rendered
       */
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image3}`);

      /**
       * Start autoplay from last slide
       */
      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonPlay));

      /**
       * Check if first value is rendered again
       */
      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image1}`);
    });
  });

  /**
   * Auto play
   */
  describe('UseEffect for auto-play', () => {
    it('Should update currentIndex and stop playing when reaching the last slide', async () => {
      const image1 = 'abc';
      const image2 = 'bar';
      const image3 = 'baz';
      render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: [image1, image2, image3],
                  },
                ],
              }),
            ],
          },
          options: {
            toolbar: true,
            buttons: [ButtonType.NAVIGATION, ButtonType.AUTOPLAY],
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
            autoPlayInterval: 15,
            autoPlayInfinity: false,
          },
        })
      );

      /**
       * Check if first value is rendered
       */
      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image1}`);

      /**
       * Check if autoPlay button
       */
      expect(screen.getByTestId(TEST_IDS.panel.buttonPlay)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.buttonPlay)).toHaveTextContent('Play');

      await act(() => fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonPlay)));

      /**
       * Run timer
       */
      await act(() => jest.runOnlyPendingTimersAsync());

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image2}`);

      /**
       * Run timer
       */
      await act(() => jest.runOnlyPendingTimersAsync());

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image3}`);

      /**
       * Run timer
       */
      await act(() => jest.runOnlyPendingTimersAsync());

      /**
       * Should not change slide
       */
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image3}`);
    });

    it('Should update currentIndex and playing next slide if infinity', async () => {
      const image1 = 'abc';
      const image2 = 'bar';
      const image3 = 'baz';

      render(
        getComponent({
          data: {
            series: [
              toDataFrame({
                name: 'data',
                fields: [
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: [image1, image2, image3],
                  },
                ],
              }),
            ],
          },
          options: {
            toolbar: true,
            buttons: [ButtonType.NAVIGATION, ButtonType.AUTOPLAY],
            mediaSources: [{ type: MediaFormat.IMAGE, id: 'img1', field: ImageField.IMG }],
            autoPlayInterval: 15,
            autoPlayInfinity: true,
          },
        })
      );

      /**
       * Check if first value is rendered
       */
      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image1}`);

      /**
       * Set Next Slide
       */
      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonNext));
      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonNext));

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image3}`);

      /**
       * Check if autoPlay button
       */
      expect(screen.getByTestId(TEST_IDS.panel.buttonPlay)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.buttonPlay)).toHaveTextContent('Play');

      await act(() => fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonPlay)));

      /**
       * Infinity simulation
       * Run timer
       */
      await act(() => jest.runOnlyPendingTimersAsync());

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image2}`);

      /**
       * Run timer
       */
      await act(() => jest.runOnlyPendingTimersAsync());

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image3}`);

      /**
       * Run timer
       */
      await act(() => jest.runOnlyPendingTimersAsync());

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image1}`);

      /**
       * Run timer
       */
      await act(() => jest.runOnlyPendingTimersAsync());

      /**
       * Should change slide
       */
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image2}`);

      /**
       * Run timer
       */
      await act(() => jest.runOnlyPendingTimersAsync());

      /**
       * Should change slide
       */
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image3}`);

      /**
       * Run timer
       */
      await act(() => jest.runOnlyPendingTimersAsync());

      /**
       * Should change slide
       */
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('src', `data:;base64,${image1}`);
    });
  });
});
