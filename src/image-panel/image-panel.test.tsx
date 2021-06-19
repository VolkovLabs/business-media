import { shallow } from 'enzyme';
import React from 'react';
import { FieldType, toDataFrame } from '@grafana/data';
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
                name: 'img',
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
                name: 'img',
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
                name: 'img',
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
                name: 'img',
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
    const getComponent = ({ options = { name: 'img' }, ...restProps }: any) => {
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
                name: 'img',
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
});
