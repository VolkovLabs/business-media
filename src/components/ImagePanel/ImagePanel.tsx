import saveAs from 'file-saver';
import { Base64 } from 'js-base64';
import React, { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { css, cx } from '@emotion/css';
import { FieldType, PanelProps } from '@grafana/data';
import { Alert, PageToolbar, ToolbarButton, useStyles2, Button, ButtonGroup } from '@grafana/ui';
import { ImageSizeModes, ImageTypesSymbols, SupportedTypes, TestIds } from '../../constants';
import { Styles } from '../../styles';
import { ButtonType } from '../../types';
import { base64toBlob } from '../../utils';

/**
 * Properties
 */
interface Props extends PanelProps {}

/**
 * Image Panel
 */
export const ImagePanel: React.FC<Props> = ({ options, data, width, height, replaceVariables }) => {
  /**
   * States
   */
  const zoomComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toolbarHeight, setToolbarHeight] = useState(0);

  /**
   * Toolbar ref
   */
  const toolbarRef = useRef<HTMLDivElement>(null);

  /**
   * Image values
   */
  const values = useMemo(() => {
    return (
      data.series
        .map((series) =>
          series.fields.find(
            (field) => field.type === FieldType.string && (!options.name || field.name === options.name)
          )
        )
        .map((field) => field?.values)
        .filter((item) => !!item)[0]
        ?.toArray() || []
    );
  }, [data.series, options.name]);

  const isToolbarShown = useMemo(() => {
    return options.toolbar
      ? options.buttons.filter((button: ButtonType) => button !== ButtonType.ZOOM).length > 0
      : false;
  }, [options.toolbar, options.buttons]);

  /**
   * Zoom handlers
   */
  const onZoomIn = useCallback(() => {
    zoomComponentRef.current?.zoomIn();
  }, []);

  const onZoomOut = useCallback(() => {
    zoomComponentRef.current?.zoomOut();
  }, []);

  const onResetZoom = useCallback(() => {
    zoomComponentRef.current?.resetTransform();
  }, []);

  /**
   * Change Current Image
   */
  const onChangeCurrentIndex = useCallback(
    (dir: 'prev' | 'next') => {
      let nextIndex;
      if (dir === 'prev') {
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) {
          nextIndex = values.length - 1;
        }
      } else {
        nextIndex = currentIndex + 1;
        if (nextIndex > values.length - 1) {
          nextIndex = 0;
        }
      }
      setCurrentIndex(nextIndex);

      /**
       * Reset zoom to avoid wrong image transform if zoom in
       */
      onResetZoom();
    },
    [values?.length, currentIndex, onResetZoom]
  );

  /**
   * Calculate toolbar height when panel width, height or toolbar visibility changed
   */
  useEffect(() => {
    setToolbarHeight(toolbarRef.current?.clientHeight || 0);
  }, [width, height, options.toolbar, options.buttons]);

  /**
   * Reset zoom when panel size is changed to avoid wrong image transform if zoom in
   */
  useEffect(() => {
    onResetZoom();
  }, [width, height, onResetZoom]);

  /**
   * Styles
   */
  const styles = useStyles2(Styles);

  /**
   * Name field (string)
   * Use first element if Navigation enabled, otherwise last
   */
  let img =
    options.toolbar && options.buttons?.includes(ButtonType.NAVIGATION)
      ? values[currentIndex]
      : values[values.length - 1];

  /**
   * Keep auto-scale if Auto
   */
  let imageHeight = options.heightMode === ImageSizeModes.AUTO ? height - toolbarHeight : 0;
  let imageWidth = options.widthMode === ImageSizeModes.AUTO ? width : 0;

  /**
   * Height
   */
  if (options.heightMode === ImageSizeModes.CUSTOM) {
    /**
     * Field
     */
    if (options.heightName) {
      const heightField = data.series
        .map((series) =>
          series.fields.find((field) => field.type === FieldType.number && field.name === options.heightName)
        )
        .map((field) => field?.values.get(field.values.length - 1))
        .toString();
      imageHeight = Number(heightField) ? Number(heightField) : imageHeight;
    }

    imageHeight = options.height ? options.height : imageHeight;
  }

  /**
   * Width
   */
  if (options.widthMode === ImageSizeModes.CUSTOM) {
    /**
     * Field
     */
    if (options.widthName) {
      const widthField = data.series
        .map((series) =>
          series.fields.find((field) => field.type === FieldType.number && field.name === options.widthName)
        )
        .map((field) => field?.values.get(field.values.length - 1))
        .toString();
      imageWidth = Number(widthField) ? Number(widthField) : imageWidth;
    }

    imageWidth = options.width ? options.width : imageWidth;
  }

  /**
   * Root Container
   */
  const renderContainer = (child: JSX.Element) => (
    <div
      data-testid={TestIds.panel.root}
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      {child}
    </div>
  );

  /**
   * No results
   */
  if (!img) {
    return renderContainer(
      <Alert severity="warning" title="" data-testid={TestIds.panel.warning}>
        Nothing to display...
      </Alert>
    );
  }

  let type;

  /**
   * Check if returned value already has header
   */
  const m = img.match(/^data:(video\/\w+|audio\/\w+|image|application\/\w+)/);
  if (!m?.length) {
    /**
     * Encode to base64 if not
     */
    if (!Base64.isValid(img)) {
      img = Base64.encode(img);
    }

    /**
     * Set header
     */
    type = ImageTypesSymbols[img.charAt(0) as any];
    img = type ? `data:${type};base64,${img}` : `data:;base64,${img}`;
  } else if (Object.values(SupportedTypes).includes(m[1] as any)) {
    type = m[1];
  }

  /**
   * Convert PDF base64 to Blob and display
   */
  if (type === SupportedTypes.PDF) {
    const blob = base64toBlob(img, SupportedTypes.PDF);
    img = URL.createObjectURL(blob);

    /**
     * Disable toolbar
     */
    if (!options.toolbar) {
      img += '#toolbar=0';
    }

    return renderContainer(
      <iframe width={imageWidth || ''} height={imageHeight || ''} src={img} data-testid={TestIds.panel.iframe} />
    );
  }

  /**
   * Display Video MP4 or WebM
   */
  if (type === SupportedTypes.MP4 || type === SupportedTypes.WEBM) {
    return renderContainer(
      <video
        width={imageWidth || ''}
        height={imageHeight || ''}
        controls={options.controls}
        autoPlay={options.autoPlay}
        data-testid={TestIds.panel.video}
      >
        <source src={img} />
      </video>
    );
  }

  /**
   * Display Audio OGG or MP3
   */
  if (type === SupportedTypes.MP3 || type === SupportedTypes.OGG) {
    return renderContainer(
      <audio controls={options.controls} autoPlay={options.autoPlay} data-testid={TestIds.panel.audio}>
        <source src={img} />
      </audio>
    );
  }

  /**
   * Add URL to Image
   */
  let image = (
    <img width={imageWidth || ''} height={imageHeight || ''} src={img} data-testid={TestIds.panel.image} alt="" />
  );
  if (options.url) {
    const url = replaceVariables(options.url);

    image = (
      <a className={cx(styles.url)} href={url} title={options.title} data-testid={TestIds.panel.imageLink}>
        {image}
      </a>
    );
  }

  /**
   * Display Image with Toolbar
   */
  if (options.toolbar && options.buttons.length) {
    return renderContainer(
      <>
        {isToolbarShown && (
          <div ref={toolbarRef}>
            <PageToolbar
              forceShowLeftItems={options.buttons.includes(ButtonType.NAVIGATION)}
              leftItems={
                options.buttons.includes(ButtonType.NAVIGATION) && [
                  <ToolbarButton
                    key="previous"
                    icon="backward"
                    onClick={() => {
                      onChangeCurrentIndex('prev');
                    }}
                    data-testid={TestIds.panel.buttonPrevious}
                    disabled={Math.max(values.length, 1) === 1}
                  >
                    Previous
                  </ToolbarButton>,
                  <div key="current">
                    {currentIndex + 1} of {Math.max(values.length, 1)}
                  </div>,
                  <ToolbarButton
                    key="next"
                    icon="forward"
                    onClick={() => {
                      onChangeCurrentIndex('next');
                    }}
                    data-testid={TestIds.panel.buttonNext}
                    disabled={Math.max(values.length, 1) === 1}
                  >
                    Next
                  </ToolbarButton>,
                ]
              }
            >
              {options.buttons.includes(ButtonType.DOWNLOAD) && (
                <ToolbarButton
                  icon="save"
                  onClick={() => {
                    saveAs(img);
                  }}
                  data-testid={TestIds.panel.buttonDownload}
                >
                  Download
                </ToolbarButton>
              )}
            </PageToolbar>
          </div>
        )}
        {options.buttons.includes(ButtonType.ZOOM) ? (
          <TransformWrapper
            ref={zoomComponentRef}
            disablePadding={true}
            wheel={{ touchPadDisabled: true, wheelDisabled: true }}
          >
            <ButtonGroup className={styles.zoomControls} data-testid={TestIds.panel.zoomControls}>
              <Button
                icon="search-plus"
                onClick={onZoomIn}
                data-testid={TestIds.panel.buttonZoomIn}
                variant="secondary"
                title="Zoom In"
              />
              <Button
                icon="search-minus"
                onClick={onZoomOut}
                data-testid={TestIds.panel.buttonZoomOut}
                variant="secondary"
                title="Zoom Out"
              />
              <Button
                icon="times-circle"
                onClick={onResetZoom}
                data-testid={TestIds.panel.buttonZoomReset}
                variant="secondary"
                title="Reset Zoom"
              />
            </ButtonGroup>
            <TransformComponent>{image}</TransformComponent>
          </TransformWrapper>
        ) : (
          image
        )}
      </>
    );
  }

  /**
   * Display Image
   */
  return renderContainer(image);
};
