import { shallow } from 'enzyme';
import React from 'react';
import { FieldType, toDataFrame } from '@grafana/data';
import { ImageFields, ImageSizeModes } from '../constants';
import { ImagePanel } from './image-panel';

/**
 * Rendering
 */
describe('Rendering', () => {
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

    const wrapper = shallow(getComponent({ date: { series: [] } }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();
    expect(div.props()['children']).toBe('Nothing to display...');
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

    const wrapper = shallow(getComponent({ date: { series: [] } }));
    expect(wrapper.find('div').exists()).toBeTruthy();
    expect(wrapper.find('img').exists()).toBeTruthy();
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

    const wrapper = shallow(getComponent({ date: { series: [] } }));
    expect(wrapper.find('div').exists()).toBeTruthy();
    expect(wrapper.find('iframe').exists()).toBeTruthy();
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

    const wrapper = shallow(getComponent({ date: { series: [] } }));
    expect(wrapper.find('div').exists()).toBeTruthy();
    expect(wrapper.find('img').exists()).toBeTruthy();
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

    const wrapper = shallow(getComponent({ date: { series: [] } }));
    expect(wrapper.find('div').exists()).toBeTruthy();
    expect(wrapper.find('iframe').exists()).toBeTruthy();
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

    const wrapper = shallow(getComponent({ date: { series: [] } }));
    expect(wrapper.find('div').exists()).toBeTruthy();
    expect(wrapper.find('img').exists()).toBeTruthy();
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

    const wrapper = shallow(getComponent({ date: { series: [] } }));
    expect(wrapper.find('div').exists()).toBeTruthy();
    expect(wrapper.find('img').exists()).toBeTruthy();

    const img = wrapper.find('img').getElement();
    expect(img.props.width).toEqual(50);
    expect(img.props.height).toEqual(50);
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

    const wrapper = shallow(getComponent({ date: { series: [] } }));
    expect(wrapper.find('div').exists()).toBeTruthy();
    expect(wrapper.find('img').exists()).toBeTruthy();

    const img = wrapper.find('img').getElement();
    expect(img.props.width).toEqual(20);
    expect(img.props.height).toEqual(20);
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

    const wrapper = shallow(getComponent({ date: { series: [] } }));
    expect(wrapper.find('div').exists()).toBeTruthy();
    expect(wrapper.find('img').exists()).toBeTruthy();

    const img = wrapper.find('img').getElement();
    expect(img.props.width).toEqual(20);
    expect(img.props.height).toEqual(20);
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

    const wrapper = shallow(getComponent({ date: { series: [] } }));
    expect(wrapper.find('div').exists()).toBeTruthy();
    expect(wrapper.find('img').exists()).toBeTruthy();

    const img = wrapper.find('img').getElement();
    expect(img.props.width).toEqual(20);
    expect(img.props.height).toEqual(20);
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

    const wrapper = shallow(getComponent({ date: { series: [] } }));
    expect(wrapper.find('div').exists()).toBeTruthy();
    expect(wrapper.find('img').exists()).toBeTruthy();

    const img = wrapper.find('img').getElement();
    expect(img.props.width).toEqual('');
    expect(img.props.height).toEqual('');
  });
});
