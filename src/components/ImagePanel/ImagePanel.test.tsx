import saveAs from 'file-saver';
import React from 'react';
import { FieldType, toDataFrame } from '@grafana/data';
import { fireEvent, render, screen } from '@testing-library/react';
import { ImageFields, ImageSizeModes, TestIds } from '../../constants';
import { ButtonType, ZoomType } from '../../types';
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
jest.mock('file-saver', () => jest.fn());

/**
 * Mock react-medium-image-zoom
 */
jest.mock('react-medium-image-zoom', () => ({
  Controlled: jest.fn(({ isZoomed, children, zoomImg }) => {
    return isZoomed ? <img data-testid={TestIds.panel.zoomedImage} src={zoomImg.src} alt="" /> : children;
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
      })
    );

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.warning)).toBeInTheDocument();
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
                  name: ImageFields.IMG,
                  values: ['/9j/4AAQSkZJRAAdLxAACEAAIX/9k='],
                },
              ],
            }),
          ],
        },
      })
    );

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();
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
                  name: ImageFields.IMG,
                  values: ['JVBERi0xLjMKJcTl8uXrp/jQ0CiUlRU9GCg=='],
                },
              ],
            }),
          ],
        },
      })
    );

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.iframe)).toBeInTheDocument();
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
                  name: ImageFields.IMG,
                  values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                },
              ],
            }),
          ],
        },
      })
    );

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();
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
                  name: ImageFields.IMG,
                  values: ['data:application/pdf;base64,JVBERiiUlRU9GCg=='],
                },
              ],
            }),
          ],
        },
      })
    );

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.iframe)).toBeInTheDocument();
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

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();
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

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.imageLink)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();
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
                    name: ImageFields.IMG,
                    values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                  },
                ],
              }),
            ],
          },
          options: { name: ImageFields.IMG, widthMode: ImageSizeModes.AUTO, heightMode: ImageSizeModes.AUTO },
          height: 50,
          width: 50,
        })
      );

      expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
      expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('width', '50');
      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('height', '50');
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
                    name: ImageFields.IMG,
                    values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                  },
                ],
              }),
            ],
          },
          options: {
            name: ImageFields.IMG,
            widthMode: ImageSizeModes.AUTO,
            heightMode: ImageSizeModes.AUTO,
            toolbar: true,
            buttons: [ButtonType.DOWNLOAD],
          },
          height: 200,
          width: 200,
        })
      );

      expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('width', '200');
      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('height', (200 - elementHeight).toString());
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
                    name: ImageFields.IMG,
                    values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                  },
                ],
              }),
            ],
          },
          options: {
            name: ImageFields.IMG,
            description: 'imageDescription',
            widthMode: ImageSizeModes.AUTO,
            heightMode: ImageSizeModes.AUTO,
            toolbar: true,
            buttons: [ButtonType.DOWNLOAD],
          },
          height: 200,
          width: 200,
        })
      );

      expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('width', '200');
      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('height', (200 - elementHeight * 2).toString());
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
                    name: ImageFields.IMG,
                    values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                  },
                ],
              }),
            ],
          },
          options: {
            name: ImageFields.IMG,
            description: 'imageDescription',
            widthMode: ImageSizeModes.AUTO,
            heightMode: ImageSizeModes.AUTO,
            toolbar: true,
            buttons: [ButtonType.DOWNLOAD],
          },
          height: 200,
          width: 200,
        })
      );

      expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('width', '200');
      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('height', (200 - elementHeight).toString());
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
                name: ImageFields.IMG,
                values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
              },
            ],
          }),
        ],
      };
      const options = {
        name: ImageFields.IMG,
        widthMode: ImageSizeModes.AUTO,
        heightMode: ImageSizeModes.AUTO,
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

        expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();

        expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('width', '200');
        expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('height', (200 - elementHeight).toString());

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

        expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('height', (300 - elementHeight).toString());
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

        expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();

        expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('width', '200');
        expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('height', (200 - elementHeight).toString());

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

        expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('height', (200).toString());
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

        expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();

        expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('width', '200');
        expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('height', (200 - elementHeight).toString());

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

        expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('height', (200 - elementHeight).toString());
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
                    name: ImageFields.IMG,
                    values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                  },
                ],
              }),
            ],
          },
          options: {
            name: ImageFields.IMG,
            widthMode: ImageSizeModes.CUSTOM,
            heightMode: ImageSizeModes.CUSTOM,
            widthName: ImageFields.WIDTH,
            heightName: ImageFields.HEIGHT,
            width: 20,
            height: 20,
          },
        })
      );

      expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
      expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('width', '20');
      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('height', '20');
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
                    name: ImageFields.IMG,
                    values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                  },
                ],
              }),
            ],
          },
          options: {
            name: ImageFields.IMG,
            widthMode: ImageSizeModes.CUSTOM,
            heightMode: ImageSizeModes.CUSTOM,
            width: 20,
            height: 20,
          },
        })
      );

      expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
      expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('width', '20');
      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('height', '20');
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
                    name: ImageFields.IMG,
                    values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                  },
                  {
                    type: FieldType.number,
                    name: ImageFields.HEIGHT,
                    values: [20],
                  },
                  {
                    type: FieldType.number,
                    name: ImageFields.WIDTH,
                    values: [20],
                  },
                ],
              }),
            ],
          },
          options: {
            name: ImageFields.IMG,
            widthMode: ImageSizeModes.CUSTOM,
            heightMode: ImageSizeModes.CUSTOM,
            widthName: ImageFields.WIDTH,
            heightName: ImageFields.HEIGHT,
          },
        })
      );

      expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
      expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('width', '20');
      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('height', '20');
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
                    name: ImageFields.IMG,
                    values: ['data:image/jpg;base64,/9j/4AAQSkZJRgABA9k='],
                  },
                ],
              }),
            ],
          },
          options: {
            name: ImageFields.IMG,
            widthMode: ImageSizeModes.ORIGINAL,
            heightMode: ImageSizeModes.ORIGINAL,
          },
        })
      );

      expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
      expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();

      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('width', '');
      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('height', '');
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
                  name: ImageFields.IMG,
                  values: ['data:video/mp4;base64,JVBERiiUlRU9GCg=='],
                },
              ],
            }),
          ],
        },
      })
    );

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.video)).toBeInTheDocument();
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
                  name: ImageFields.IMG,
                  values: ['data:audio/mp3;base64,JVBERiiUlRU9GCg=='],
                },
              ],
            }),
          ],
        },
      })
    );

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.audio)).toBeInTheDocument();
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
                    name: ImageFields.IMG,
                    values: [image],
                  },
                ],
              }),
            ],
          },
          options: { toolbar: true, buttons: [ButtonType.DOWNLOAD] },
        })
      );

      expect(screen.getByTestId(TestIds.panel.buttonDownload)).toBeInTheDocument();

      fireEvent.click(screen.getByTestId(TestIds.panel.buttonDownload));

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
                    name: ImageFields.IMG,
                    values: ['/9j/4AAQSkZJRAAdLxAACEAAIX/9k='],
                  },
                ],
              }),
            ],
          },
          options: { toolbar: true, buttons: [] },
        })
      );

      expect(screen.queryByTestId(TestIds.panel.buttonDownload)).not.toBeInTheDocument();
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
                    name: ImageFields.IMG,
                    values: [image],
                  },
                ],
              }),
            ],
          },
          options: { toolbar: true, buttons: [ButtonType.ZOOM] },
        })
      );

      expect(screen.getByTestId(TestIds.panel.buttonZoom)).toBeInTheDocument();
      expect(screen.queryByTestId(TestIds.panel.zoomedImage)).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId(TestIds.panel.buttonZoom));

      expect(screen.getByTestId(TestIds.panel.zoomedImage)).toBeInTheDocument();
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
                    name: ImageFields.IMG,
                    values: [image],
                  },
                ],
              }),
            ],
          },
          options: { toolbar: true, buttons: [ButtonType.ZOOM], zoomType: ZoomType.PANPINCH },
        })
      );

      expect(screen.getByTestId(TestIds.panel.buttonZoomPanPinchIn)).toBeInTheDocument();
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
                    name: ImageFields.IMG,
                    values: [image],
                  },
                ],
              }),
            ],
          },
          options: { toolbar: true, buttons: [ButtonType.ZOOM], zoomType: ZoomType.PANPINCH },
        })
      );

      fireEvent.click(screen.getByTestId(TestIds.panel.buttonZoomPanPinchIn));
      fireEvent.click(screen.getByTestId(TestIds.panel.buttonZoomPanPinchOut));
      fireEvent.click(screen.getByTestId(TestIds.panel.buttonZoomPanPinchReset));

      /**
       * Unable to check zooming through unit tests because mocking ref causes warnings
       * so just check if image is rendered after zooming
       */
      expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();
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
                    name: ImageFields.IMG,
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
      expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();
      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('src', `data:;base64,${image1}`);

      /**
       * Check if second value is rendered
       */
      fireEvent.click(screen.getByTestId(TestIds.panel.buttonNext));

      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('src', `data:;base64,${image2}`);

      /**
       * Check if first value is rendered again
       */
      fireEvent.click(screen.getByTestId(TestIds.panel.buttonPrevious));

      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('src', `data:;base64,${image1}`);

      /**
       * Check if previous button moves to last image
       */
      fireEvent.click(screen.getByTestId(TestIds.panel.buttonPrevious));

      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('src', `data:;base64,${image3}`);

      /**
       * Check if next button moves to first image
       */
      fireEvent.click(screen.getByTestId(TestIds.panel.buttonNext));

      expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('src', `data:;base64,${image1}`);
    });
  });
});
