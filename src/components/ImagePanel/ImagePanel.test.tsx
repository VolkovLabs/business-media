import { FieldType, toDataFrame } from '@grafana/data';
import { fireEvent, render, screen } from '@testing-library/react';
import { saveAs } from 'file-saver';
import React from 'react';

import { TEST_IDS } from '../../constants';
import { ButtonType, ImageField, ImageSizeMode, ZoomType } from '../../types';
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
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();
  });

  it('Should render application', async () => {
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
                  values: ['JVBERi0xLjMKJcTl8uXrp/jQ0CiUlRU9GCg=='],
                },
              ],
            }),
          ],
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
                  name: ImageField.IMG,
                  values: ['data:application/pdf;base64,JVBERiiUlRU9GCg=='],
                },
              ],
            }),
          ],
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
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();
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
                },
              ],
            }),
          ],
        },
        options: { name: '', url: 'test' },
        replaceVariables: (str: string) => str,
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.imageLink)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();
  });

  describe('Image height', () => {
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
                  {
                    type: FieldType.string,
                    name: ImageField.IMG,
                    values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                  },
                ],
              }),
            ],
          },
          options: { name: ImageField.IMG, widthMode: ImageSizeMode.AUTO, heightMode: ImageSizeMode.AUTO },
          height: 50,
          width: 50,
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('width', '50');
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('height', '50');
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
            name: ImageField.IMG,
            widthMode: ImageSizeMode.AUTO,
            heightMode: ImageSizeMode.AUTO,
            toolbar: true,
            buttons: [ButtonType.DOWNLOAD],
          },
          height: 200,
          width: 200,
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('width', '200');
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('height', (200 - elementHeight).toString());
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
            name: ImageField.IMG,
            description: 'imageDescription',
            widthMode: ImageSizeMode.AUTO,
            heightMode: ImageSizeMode.AUTO,
            toolbar: true,
            buttons: [ButtonType.DOWNLOAD],
          },
          height: 200,
          width: 200,
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('width', '200');
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('height', (200 - elementHeight * 2).toString());
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
            name: ImageField.IMG,
            description: 'imageDescription',
            widthMode: ImageSizeMode.AUTO,
            heightMode: ImageSizeMode.AUTO,
            toolbar: true,
            buttons: [ButtonType.DOWNLOAD],
          },
          height: 200,
          width: 200,
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('width', '200');
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('height', (200 - elementHeight).toString());
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
        name: ImageField.IMG,
        widthMode: ImageSizeMode.AUTO,
        heightMode: ImageSizeMode.AUTO,
        toolbar: true,
        buttons: [ButtonType.DOWNLOAD],
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

        expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('width', '200');
        expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('height', (200 - elementHeight).toString());

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

        expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('height', (300 - elementHeight).toString());
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

        expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('width', '200');
        expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('height', (200 - elementHeight).toString());

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

        expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('height', (200).toString());
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

        expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('width', '200');
        expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('height', (200 - elementHeight).toString());

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

        expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('height', (200 - elementHeight).toString());
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
            name: ImageField.IMG,
            widthMode: ImageSizeMode.CUSTOM,
            heightMode: ImageSizeMode.CUSTOM,
            widthName: ImageField.WIDTH,
            heightName: ImageField.HEIGHT,
            width: 20,
            height: 20,
          },
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('width', '20');
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('height', '20');
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
            name: ImageField.IMG,
            widthMode: ImageSizeMode.CUSTOM,
            heightMode: ImageSizeMode.CUSTOM,
            width: 20,
            height: 20,
          },
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('width', '20');
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('height', '20');
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
            name: ImageField.IMG,
            widthMode: ImageSizeMode.CUSTOM,
            heightMode: ImageSizeMode.CUSTOM,
            widthName: ImageField.WIDTH,
            heightName: ImageField.HEIGHT,
          },
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('width', '20');
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('height', '20');
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
            name: ImageField.IMG,
            widthMode: ImageSizeMode.ORIGINAL,
            heightMode: ImageSizeMode.ORIGINAL,
          },
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('width', '');
      expect(screen.getByTestId(TEST_IDS.panel.image)).toHaveAttribute('height', '');
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
                  name: ImageField.IMG,
                  values: ['data:video/mp4;base64,JVBERiiUlRU9GCg=='],
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
                  name: ImageField.IMG,
                  values: ['data:audio/mp3;base64,JVBERiiUlRU9GCg=='],
                },
              ],
            }),
          ],
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
          videoUrl: 'videoUrl',
          name: '',
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
              ],
            }),
          ],
        },
      })
    );

    expect(screen.getByTestId(TEST_IDS.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.panel.video)).toBeInTheDocument();
  });

  it('Should render image from url', async () => {
    render(
      getComponent({
        options: {
          videoUrl: '',
          name: '',
          imageUrl: 'imageUrl',
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
    expect(screen.getByTestId(TEST_IDS.panel.imageUrl)).toBeInTheDocument();
  });

  /**
   * Toolbar
   */
  describe('Toolbar', () => {
    it('Should show download button for image', () => {
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
          options: { toolbar: true, buttons: [ButtonType.DOWNLOAD] },
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.buttonDownload)).toBeInTheDocument();

      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonDownload));

      expect(saveAs).toHaveBeenCalledWith(`data:image/jpeg;base64,${image}`);
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
          options: { toolbar: true, buttons: [] },
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
          options: { toolbar: true, buttons: [ButtonType.ZOOM] },
        })
      );

      expect(screen.getByTestId(TEST_IDS.panel.buttonZoom)).toBeInTheDocument();
      expect(screen.queryByTestId(TEST_IDS.panel.zoomedImage)).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId(TEST_IDS.panel.buttonZoom));

      expect(screen.getByTestId(TEST_IDS.panel.zoomedImage)).toBeInTheDocument();
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
          options: { toolbar: true, buttons: [ButtonType.ZOOM], zoomType: ZoomType.PANPINCH },
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
          options: { toolbar: true, buttons: [ButtonType.ZOOM], zoomType: ZoomType.PANPINCH },
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
          options: { toolbar: true, buttons: [ButtonType.NAVIGATION] },
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
  });
});
