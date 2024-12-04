import { FieldType, StandardEditorProps } from '@grafana/data';
import { Button, Icon, InlineField, InlineFieldRow, Select, useTheme2 } from '@grafana/ui';
import { DragDropContext, Draggable, DraggingStyle, Droppable, DropResult, NotDraggingStyle } from '@hello-pangea/dnd';
import { Collapse } from '@volkovlabs/components';
import React, { useCallback, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { MEDIA_TYPES_OPTIONS, TEST_IDS } from '../../constants';
import { MediaFormat, MediaSourceConfig } from '../../types';
import { multipleQueriesFields, reorder } from '../../utils';
import { getStyles } from './MediaSourcesEditor.styles';

/**
 * Get Item Style
 */
const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined) => ({
  /**
   * styles we need to apply on draggables
   */
  ...draggableStyle,
});

/**
 * Settings
 */
interface Settings {
  /**
   * Filter By Type
   *
   * @type {FieldType[]}
   */
  filterByType: FieldType[];
}

/**
 * Properties
 */
type Props = StandardEditorProps<MediaSourceConfig[] | null, Settings>;

/**
 * Media Sources
 */
export const MediaSourcesEditor: React.FC<Props> = ({ item, value, onChange, context }) => {
  /**
   * Styles and Theme
   */
  const theme = useTheme2();
  const styles = getStyles(theme);

  /**
   * States
   */
  const [sources, setSources] = useState(value || []);
  const [newMediaSource, setNewMediaSource] = useState<MediaSourceConfig>({
    id: uuidv4(),
    type: MediaFormat.IMAGE,
    field: '',
    refId: '',
  });
  const [collapseState, setCollapseState] = useState<Record<string, boolean>>({});

  /**
   * Change Items
   */
  const onChangeSources = useCallback(
    (sources: MediaSourceConfig[]) => {
      setSources(sources);
      onChange(sources);
    },
    [onChange]
  );

  /**
   * Drag end
   */
  const onDragEnd = useCallback(
    (result: DropResult) => {
      /**
       * Dropped outside the list
       */
      if (!result.destination) {
        return;
      }

      /**
       * Change with reorder
       */
      onChangeSources(reorder(sources, result.source.index, result.destination.index));
    },
    [onChangeSources, sources]
  );

  /**
   * Add New Source
   */
  const onAddNewMediaSource = useCallback(() => {
    if (newMediaSource.field && newMediaSource.type) {
      onChangeSources([...sources, newMediaSource]);
      setNewMediaSource({ id: uuidv4(), type: MediaFormat.IMAGE, field: '', refId: '' });
    }
  }, [newMediaSource, onChangeSources, sources]);

  /**
   * Toggle collapse state for sources
   */
  const onToggleItem = useCallback((item: MediaSourceConfig) => {
    setCollapseState((prev) => ({
      ...prev,
      [item.id]: !prev[item.id],
    }));
  }, []);

  /**
   * Options
   */
  const options = useMemo(
    () => multipleQueriesFields(context.data, item.settings?.filterByType),
    [context.data, item.settings?.filterByType]
  );

  /**
   * Return
   */
  return (
    <div data-testid={TEST_IDS.mediaSourceEditor.root}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="editor">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {sources.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      className={styles.item}
                    >
                      <Collapse
                        headerTestId={TEST_IDS.mediaSourceEditor.itemHeader(item.id)}
                        contentTestId={TEST_IDS.mediaSourceEditor.itemContent(item.id)}
                        isOpen={collapseState[item.id]}
                        onToggle={() => onToggleItem(item)}
                        title={<>{`${item.type} - [${item.field}]`}</>}
                        actions={
                          <>
                            <Button
                              icon="trash-alt"
                              variant="secondary"
                              fill="text"
                              size="sm"
                              onClick={() => {
                                /**
                                 * Remove Item
                                 */
                                onChangeSources(sources.filter((source) => source.id !== item.id));
                              }}
                              data-testid={TEST_IDS.mediaSourceEditor.buttonRemove}
                            />
                            <div {...provided.dragHandleProps}>
                              <Icon name="draggabledots" />
                            </div>
                          </>
                        }
                      >
                        <>
                          <InlineField label="Type" grow={true}>
                            <Select
                              placeholder={'Change source type'}
                              onChange={(element) => {
                                if (element.value) {
                                  const updatedSources = sources.map((source) => {
                                    if (source.id === item.id) {
                                      return {
                                        ...source,
                                        type: element.value!,
                                      };
                                    }
                                    return source;
                                  });
                                  onChangeSources(updatedSources);
                                }
                              }}
                              value={item.type}
                              options={MEDIA_TYPES_OPTIONS}
                              aria-label={TEST_IDS.mediaSourceEditor.fieldType}
                              data-testid={TEST_IDS.mediaSourceEditor.fieldType}
                            />
                          </InlineField>
                          <InlineField label="Field" grow={true}>
                            <Select
                              value={`${item.refId ? `${item.refId}:` : ''}${item.field}`}
                              onChange={(element) => {
                                const updatedSources = sources.map((source) => {
                                  if (source.id === item.id) {
                                    return {
                                      ...source,
                                      field: element.field!,
                                      refId: element.refId || '',
                                    };
                                  }
                                  return source;
                                });
                                onChangeSources(updatedSources);
                              }}
                              options={options}
                              aria-label={TEST_IDS.mediaSourceEditor.fieldName}
                              data-testid={TEST_IDS.mediaSourceEditor.fieldName}
                            />
                          </InlineField>
                        </>
                      </Collapse>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <InlineFieldRow>
        <InlineField label="Media Type" grow={true}>
          <Select
            placeholder={'Select source type'}
            onChange={(event) => {
              setNewMediaSource({
                ...newMediaSource,
                type: event.value!,
              });
            }}
            value={newMediaSource.type}
            options={MEDIA_TYPES_OPTIONS}
            aria-label={TEST_IDS.mediaSourceEditor.fieldTypeNew}
            data-testid={TEST_IDS.mediaSourceEditor.fieldTypeNew}
          />
        </InlineField>
        <InlineField label="Media Field" grow={true}>
          <Select
            onChange={(event) => {
              setNewMediaSource({
                ...newMediaSource,
                field: event.field!,
                refId: event.refId || '',
              });
            }}
            value={newMediaSource.field || null}
            options={options}
            aria-label={TEST_IDS.mediaSourceEditor.fieldNameNew}
            data-testid={TEST_IDS.mediaSourceEditor.fieldNameNew}
          />
        </InlineField>
        <Button
          icon="plus"
          title="Add Media source"
          onClick={onAddNewMediaSource}
          disabled={!newMediaSource.type || !newMediaSource.field}
          data-testid={TEST_IDS.mediaSourceEditor.buttonAddNew}
        >
          Add
        </Button>
      </InlineFieldRow>
    </div>
  );
};
