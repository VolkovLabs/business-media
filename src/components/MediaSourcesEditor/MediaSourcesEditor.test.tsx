import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import React from 'react';
import { MediaFormat } from 'types';

import { TEST_IDS } from '../../constants';
import { MediaSourcesEditor } from './MediaSourcesEditor';

/**
 * Properties
 */
type Props = React.ComponentProps<typeof MediaSourcesEditor>;

/**
 * Mock uuidv4
 */
jest.mock('uuid', () => ({
  v4: () => 'new-media',
}));

/**
 * Media Sources Editor
 */
describe('Series Editor', () => {
  /**
   * Selectors
   */
  const getSelectors = getJestSelectors(TEST_IDS.mediaSourceEditor);
  const selectors = getSelectors(screen);

  /**
   * Create On Change Handler
   */
  const createOnChangeHandler = (initialValue: any) => {
    let value = initialValue;
    return {
      value,
      onChange: jest.fn((newValue) => {
        value = newValue;
      }),
    };
  };

  /**
   * Item
   */
  const item = {
    id: 'mediaSources',
    path: 'mediaSources',
    name: 'Media Sources',
    description: 'Media Sources',
    settings: {
      filterByType: ['string'],
    },
    defaultValue: [],
  } as any;

  /**
   * Open Item
   * @param id
   */
  const openItem = (id: string): ReturnType<typeof getSelectors> => {
    /**
     * Check item presence
     */
    expect(selectors.itemHeader(false, id)).toBeInTheDocument();

    /**
     * Make Item is opened
     */
    fireEvent.click(selectors.itemHeader(false, id));

    /**
     * Check if item content exists
     */
    const elementContent = selectors.itemContent(false, id);
    expect(elementContent).toBeInTheDocument();

    /**
     * Return selectors for opened item
     */
    return getSelectors(within(elementContent));
  };

  /**
   * Get Tested Component
   */
  const getComponent = (props: Partial<Props>) => {
    return <MediaSourcesEditor {...(props as any)} />;
  };

  it('Should render component', () => {
    const context = {
      data: [],
    } as any;
    render(getComponent({ item, value: [], context }));

    expect(selectors.root()).toBeInTheDocument();
  });

  it('Should render component with null value', () => {
    const context = {
      data: [],
    } as any;
    render(getComponent({ item, value: null, context }));

    expect(selectors.root()).toBeInTheDocument();
  });

  it('Should render sources', () => {
    const context = {
      data: [],
    } as any;

    const value = [
      {
        field: 'imgUrl',
        id: 'img1',
        type: MediaFormat.IMAGE,
        refId: '',
      },
      {
        field: 'videoURL',
        id: 'vid1',
        type: MediaFormat.VIDEO,
        refId: '',
      },
    ];

    render(getComponent({ item, value, context }));

    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.itemHeader(false, 'img1')).toBeInTheDocument();
    expect(selectors.itemHeader(false, 'vid1')).toBeInTheDocument();
  });

  it('Should remove source', () => {
    const { value, onChange } = createOnChangeHandler([
      {
        field: 'imgUrl',
        id: 'img1',
        type: 'image',
      },
      {
        field: 'videoURL',
        id: 'vid1',
        type: 'video',
      },
    ]);
    const context = {
      data: [],
    } as any;

    const { rerender } = render(
      getComponent({
        item,
        value,
        onChange,
        context,
      })
    );

    expect(selectors.root()).toBeInTheDocument();
    const image = selectors.itemHeader(false, 'img1');

    fireEvent.click(getSelectors(within(image)).buttonRemove());

    rerender(
      getComponent({
        item,
        value,
        onChange,
        context,
      })
    );

    expect(selectors.itemHeader(true, 'img1')).not.toBeInTheDocument();
    expect(selectors.itemHeader(true, 'vid1')).toBeInTheDocument();
  });

  describe('Add new source', () => {
    it('Should add new source', async () => {
      const context = {
        data: [
          {
            fields: [
              {
                name: 'imgURL',
                type: 'string',
                values: [],
              },
              {
                name: 'videoURL',
                type: 'string',
                values: [],
              },
              {
                name: 'audioURL',
                type: 'string',
                values: [],
              },
              {
                name: 'someNumber',
                type: 'number',
                values: [],
              },
            ],
          },
        ],
      } as any;

      const { value, onChange } = createOnChangeHandler([
        {
          field: 'imgURL',
          id: 'img1',
          type: 'image',
        },
      ]);

      const { rerender } = render(
        getComponent({
          item,
          value,
          onChange,
          context,
        })
      );

      expect(selectors.root()).toBeInTheDocument();
      expect(selectors.buttonAddNew()).toBeInTheDocument();

      fireEvent.change(selectors.fieldTypeNew(), { target: { value: MediaFormat.AUDIO } });
      fireEvent.change(selectors.fieldNameNew(), { target: { value: 'audioURL' } });

      expect(selectors.buttonAddNew()).not.toBeDisabled();

      await act(async () => {
        fireEvent.click(selectors.buttonAddNew());
      });

      rerender(
        getComponent({
          item,
          value,
          onChange,
          context,
        })
      );

      expect(selectors.itemHeader(false, 'new-media')).toBeInTheDocument();
    });

    it('Should not allow add with specified one field or name', async () => {
      const context = {
        data: [
          {
            fields: [
              {
                name: 'imgURL',
                type: 'string',
                values: [],
              },
              {
                name: 'videoURL',
                type: 'string',
                values: [],
              },
              {
                name: 'audioURL',
                type: 'string',
                values: [],
              },
              {
                name: 'someNumber',
                type: 'number',
                values: [],
              },
            ],
          },
        ],
      } as any;

      const { value, onChange } = createOnChangeHandler([
        {
          field: 'imgURL',
          id: 'img1',
          type: 'image',
        },
      ]);

      render(
        getComponent({
          item,
          value,
          onChange,
          context,
        })
      );

      expect(selectors.root()).toBeInTheDocument();
      expect(selectors.buttonAddNew()).toBeInTheDocument();
      expect(selectors.buttonAddNew()).toBeDisabled();
    });
  });

  /**
   * Sources order
   */
  describe('Sources order', () => {
    it('Should reorder sources', async () => {
      let onDragEndHandler: (result: DropResult) => void = () => null;
      jest.mocked(DragDropContext).mockImplementation(({ children, onDragEnd }: any) => {
        onDragEndHandler = onDragEnd;
        return children;
      });

      const context = {
        data: [
          {
            fields: [
              {
                name: 'imgURL',
                type: 'string',
                values: [],
              },
              {
                name: 'videoURL',
                type: 'string',
                values: [],
              },
              {
                name: 'audioURL',
                type: 'string',
                values: [],
              },
              {
                name: 'someNumber',
                type: 'number',
                values: [],
              },
            ],
          },
        ],
      } as any;

      const { value, onChange } = createOnChangeHandler([
        {
          field: 'imgURL',
          id: 'img1',
          type: 'image',
        },
        {
          field: 'videoURL',
          id: 'video1',
          type: 'image',
        },
      ]);

      const { rerender } = render(getComponent({ item, value, onChange, context }));

      /**
       * Simulate drop element 1 to index 0
       */
      await act(async () =>
        onDragEndHandler({
          destination: {
            index: 0,
          },
          source: {
            index: 1,
          },
        } as any)
      );

      rerender(getComponent({ item, value, onChange, context }));

      /**
       * Check if items order is changed
       */
      const items = screen.getAllByTestId('draggable');

      expect(getSelectors(within(items[0])).itemHeader(false, 'video1')).toBeInTheDocument();
      expect(getSelectors(within(items[1])).itemHeader(false, 'img1')).toBeInTheDocument();
    });

    it('Should not reorder sources if drop outside the list', async () => {
      let onDragEndHandler: (result: DropResult) => void = () => null;
      jest.mocked(DragDropContext).mockImplementation(({ children, onDragEnd }: any) => {
        onDragEndHandler = onDragEnd;
        return children;
      });
      const context = {
        data: [
          {
            fields: [
              {
                name: 'imgURL',
                type: 'string',
                values: [],
              },
              {
                name: 'videoURL',
                type: 'string',
                values: [],
              },
              {
                name: 'audioURL',
                type: 'string',
                values: [],
              },
              {
                name: 'someNumber',
                type: 'number',
                values: [],
              },
            ],
          },
        ],
      } as any;

      const { value, onChange } = createOnChangeHandler([
        {
          field: 'imgURL',
          id: 'img1',
          type: 'image',
        },
        {
          field: 'videoURL',
          id: 'video1',
          type: 'image',
        },
      ]);

      const { rerender } = render(getComponent({ item, value, onChange, context }));

      /**
       * Simulate drop element 1 to index 0
       */
      await act(async () =>
        onDragEndHandler({
          destination: null,
          source: {
            index: 1,
          },
        } as any)
      );

      rerender(getComponent({ item, value, onChange, context }));

      /**
       * Check if items order is not changed
       */
      const items = screen.getAllByTestId('draggable');

      expect(getSelectors(within(items[0])).itemHeader(false, 'img1')).toBeInTheDocument();
      expect(getSelectors(within(items[1])).itemHeader(false, 'video1')).toBeInTheDocument();
    });
  });

  /**
   * Sources updates
   */
  describe('Source updates', () => {
    const context = {
      data: [
        {
          fields: [
            {
              name: 'imgURL',
              type: 'string',
              values: [],
            },
            {
              name: 'videoURL',
              type: 'string',
              values: [],
            },
            {
              name: 'audioURL',
              type: 'string',
              values: [],
            },
            {
              name: 'someNumber',
              type: 'number',
              values: [],
            },
          ],
        },
      ],
    } as any;

    it('Should update type', () => {
      const { value, onChange } = createOnChangeHandler([
        {
          field: 'imgURL',
          id: 'img1',
          type: 'image',
        },
        {
          field: 'videoURL',
          id: 'video1',
          type: 'image',
        },
      ]);

      const { rerender } = render(
        getComponent({
          item,
          value,
          onChange,
          context,
        })
      );

      expect(selectors.itemHeader(false, 'img1')).toHaveTextContent('image - [imgURL]');

      const source = openItem('img1');

      expect(source.fieldType()).toBeInTheDocument();
      fireEvent.change(source.fieldType(), { target: { value: MediaFormat.AUDIO } });

      rerender(
        getComponent({
          item,
          value,
          onChange,
          context,
        })
      );

      expect(selectors.itemHeader(false, 'img1')).toBeInTheDocument();
      expect(selectors.itemHeader(false, 'img1')).toHaveTextContent('audio - [imgURL]');
    });

    it('Should update field', () => {
      const { value, onChange } = createOnChangeHandler([
        {
          field: 'imgURL',
          id: 'img1',
          type: 'image',
        },
        {
          field: 'videoURL',
          id: 'video1',
          type: 'image',
        },
      ]);

      const { rerender } = render(
        getComponent({
          item,
          value,
          onChange,
          context,
        })
      );

      expect(selectors.itemHeader(false, 'img1')).toHaveTextContent('image - [imgURL]');

      const source = openItem('img1');

      expect(source.fieldType()).toBeInTheDocument();
      fireEvent.change(source.fieldName(), { target: { value: 'videoURL' } });

      rerender(
        getComponent({
          item,
          value,
          onChange,
          context,
        })
      );

      expect(selectors.itemHeader(false, 'img1')).toBeInTheDocument();
      expect(selectors.itemHeader(false, 'img1')).toHaveTextContent('image - [videoURL]');
    });
  });
});
