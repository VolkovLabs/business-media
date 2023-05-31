import React from 'react';
import { render, screen } from '@testing-library/react';
import { FieldType, toDataFrame } from '@grafana/data';
import { ImageFields, ImageSizeModes, TestIds } from '../../constants';
import { ImagePanel } from './ImagePanel';

/**
 * Rendering
 */
describe('Rendering', () => {
  window.URL.createObjectURL = jest.fn();

  it('Should output message', async () => {
    const getComponent = ({ options = { name: '' }, ...restProps }: any) => {
      const data = {
        series: [
          toDataFrame({
            name: 'data',
            fields: [],
          }),
        ],
      };
      return <ImagePanel data={data} {...restProps} options={options} />;
    };

    render(getComponent({ date: { series: [] } }));

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.warning)).toBeInTheDocument();
  });

  it('Should render image', async () => {
    const getComponent = ({ options = { name: '' }, ...restProps }: any) => {
      const data = {
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
      };
      return <ImagePanel data={data} {...restProps} options={options} />;
    };

    render(getComponent({ date: { series: [] } }));

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();
  });

  it('Should render application', async () => {
    const getComponent = ({ options = { name: '' }, ...restProps }: any) => {
      const data = {
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
      };
      return <ImagePanel data={data} {...restProps} options={options} />;
    };

    render(getComponent({ date: { series: [] } }));

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.iframe)).toBeInTheDocument();
  });

  it('Should render image with header', async () => {
    const getComponent = ({ options = { name: '' }, ...restProps }: any) => {
      const data = {
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
      };
      return <ImagePanel data={data} {...restProps} options={options} />;
    };

    render(getComponent({ date: { series: [] } }));

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();
  });

  it('Should render application with header', async () => {
    const getComponent = ({ options = { name: '' }, ...restProps }: any) => {
      const data = {
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
      };
      return <ImagePanel data={data} {...restProps} options={options} />;
    };

    render(getComponent({ date: { series: [] } }));

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.iframe)).toBeInTheDocument();
  });

  it('Should render raw image', async () => {
    const getComponent = ({ options = { name: '' }, ...restProps }: any) => {
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
            ],
          }),
        ],
      };
      return <ImagePanel data={data} {...restProps} options={options} />;
    };

    render(getComponent({ date: { series: [] } }));

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();
  });

  it('Should render raw image with URL', async () => {
    const getComponent = ({
      options = { name: '', url: 'test' },
      replaceVariables = (str: string) => str,
      ...restProps
    }: any) => {
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
            ],
          }),
        ],
      };
      return <ImagePanel data={data} {...restProps} options={options} replaceVariables={replaceVariables} />;
    };

    render(getComponent({ date: { series: [] } }));

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.imageLink)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();
  });

  it('Should render raw image', async () => {
    const getComponent = ({
      options = { name: ImageFields.IMG, widthMode: ImageSizeModes.AUTO, heightMode: ImageSizeModes.AUTO },
      height = 50,
      width = 50,
      ...restProps
    }: any) => {
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
      return <ImagePanel data={data} {...restProps} options={options} height={height} width={width} />;
    };

    render(getComponent({ date: { series: [] } }));

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();

    expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('width', '50');
    expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('height', '50');
  });

  it('Should render image with custom size options', async () => {
    const getComponent = ({
      options = {
        name: ImageFields.IMG,
        widthMode: ImageSizeModes.CUSTOM,
        heightMode: ImageSizeModes.CUSTOM,
        widthName: ImageFields.WIDTH,
        heightName: ImageFields.HEIGHT,
        width: 20,
        height: 20,
      },
      ...restProps
    }: any) => {
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
      return <ImagePanel data={data} {...restProps} options={options} />;
    };

    render(getComponent({ date: { series: [] } }));

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();

    expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('width', '20');
    expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('height', '20');
  });

  it('Should render image with custom size options', async () => {
    const getComponent = ({
      options = {
        name: ImageFields.IMG,
        widthMode: ImageSizeModes.CUSTOM,
        heightMode: ImageSizeModes.CUSTOM,
        width: 20,
        height: 20,
      },
      ...restProps
    }: any) => {
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
      return <ImagePanel data={data} {...restProps} options={options} />;
    };

    render(getComponent({ date: { series: [] } }));

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();

    expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('width', '20');
    expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('height', '20');
  });

  it('Should render image with custom size fields', async () => {
    const getComponent = ({
      options = {
        name: ImageFields.IMG,
        widthMode: ImageSizeModes.CUSTOM,
        heightMode: ImageSizeModes.CUSTOM,
        widthName: ImageFields.WIDTH,
        heightName: ImageFields.HEIGHT,
      },
      ...restProps
    }: any) => {
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
      };
      return <ImagePanel data={data} {...restProps} options={options} />;
    };

    render(getComponent({ date: { series: [] } }));

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();

    expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('width', '20');
    expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('height', '20');
  });

  it('Should render image with original size', async () => {
    const getComponent = ({
      options = {
        name: ImageFields.IMG,
        widthMode: ImageSizeModes.ORIGINAL,
        heightMode: ImageSizeModes.ORIGINAL,
      },
      ...restProps
    }: any) => {
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
      return <ImagePanel data={data} {...restProps} options={options} />;
    };

    render(getComponent({ date: { series: [] } }));

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.image)).toBeInTheDocument();

    expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('width', '');
    expect(screen.getByTestId(TestIds.panel.image)).toHaveAttribute('height', '');
  });

  it('Should render video with header', async () => {
    const getComponent = ({ options = { name: '' }, ...restProps }: any) => {
      const data = {
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
      };
      return <ImagePanel data={data} {...restProps} options={options} />;
    };

    render(getComponent({ date: { series: [] } }));

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.video)).toBeInTheDocument();
  });

  it('Should render audio with header', async () => {
    const getComponent = ({ options = { name: '' }, ...restProps }: any) => {
      const data = {
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
      };
      return <ImagePanel data={data} {...restProps} options={options} />;
    };

    render(getComponent({ date: { series: [] } }));

    expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.panel.audio)).toBeInTheDocument();
  });
});
