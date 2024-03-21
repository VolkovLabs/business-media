import 'react-medium-image-zoom/dist/styles.css';

import { css, cx } from '@emotion/css';
import { FieldType, PanelProps } from '@grafana/data';
import { Alert, PageToolbar, ToolbarButton, useStyles2 } from '@grafana/ui';
import saveAs from 'file-saver';
import { Base64 } from 'js-base64';
import React, { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controlled as ControlledZoom } from 'react-medium-image-zoom';
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { IMAGE_TYPES_SYMBOLS, TEST_IDS } from '../../constants';
import { ButtonType, ImageSizeMode, PanelOptions, SupportedFileType, ZoomType } from '../../types';
import { base64toBlob } from '../../utils';
import { getStyles } from './ImagePanel.styles';

/**
 * Properties
 */
interface Props extends PanelProps<PanelOptions> {}

/**
 * Image Panel
 */
export const ImagePanel: React.FC<Props> = ({ options, data, width, height, replaceVariables }) => {
  /**
   * States
   */
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const [descriptionHeight, setDescriptionHeight] = useState(0);

  /**
   * References
   */
  const zoomPanPinchRef = useRef<ReactZoomPanPinchRef | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

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

  /**
   * Image descriptions
   */
  const descriptions = useMemo(() => {
    if (!options.description) {
      return [];
    }

    return (
      data.series
        .map((series) => series.fields.find((field) => field.name === options.description))
        .map((field) => field?.values)
        .filter((item) => !!item)[0]
        ?.toArray() || []
    );
  }, [data.series, options.description]);

  /**
   * Is Toolbar Shown
   */
  const isToolbarShown = useMemo(() => {
    return options.toolbar && options.buttons.length > 0;
  }, [options.toolbar, options.buttons]);

  /**
   * Zoom Pan Pinch handlers
   */
  const onZoomPanPinchIn = useCallback(() => {
    zoomPanPinchRef.current?.zoomIn();
  }, []);

  const onZoomPanPinchOut = useCallback(() => {
    zoomPanPinchRef.current?.zoomOut();
  }, []);

  const onResetZoomPanPinch = useCallback(() => {
    zoomPanPinchRef.current?.resetTransform();
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
      onResetZoomPanPinch();
    },
    [values?.length, currentIndex, onResetZoomPanPinch]
  );

  /**
   * Calculate toolbar height when panel width, height or toolbar visibility changed
   */
  useEffect(() => {
    setToolbarHeight(toolbarRef.current?.clientHeight || 0);
  }, [width, height, options.toolbar, options.buttons, options.zoomType]);

  /**
   * If Navigation Shown
   */
  const navigationShown = options.toolbar && options.buttons?.includes(ButtonType.NAVIGATION);

  /**
   * Calculate description height when panel width, height, descriptions or description field changed
   */
  useEffect(() => {
    setDescriptionHeight(descriptionRef.current?.clientHeight || 0);
  }, [width, height, options.description, descriptions, currentIndex, navigationShown]);

  /**
   * Reset zoom when panel size is changed to avoid wrong image transform if zoom in
   */
  useEffect(() => {
    onResetZoomPanPinch();
  }, [width, height, onResetZoomPanPinch]);

  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * Name and description field (string)
   * Use first element if Navigation enabled, otherwise last
   */
  const resultIndex = navigationShown ? currentIndex : values.length - 1;

  let img = values[resultIndex];
  const description = descriptions[resultIndex];

  /**
   * Keep auto-scale if Auto
   */
  let imageHeight = options.heightMode === ImageSizeMode.AUTO ? height - toolbarHeight - descriptionHeight : 0;
  let imageWidth = options.widthMode === ImageSizeMode.AUTO ? width : 0;

  /**
   * Height
   */
  if (options.heightMode === ImageSizeMode.CUSTOM) {
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
  if (options.widthMode === ImageSizeMode.CUSTOM) {
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
      data-testid={TEST_IDS.panel.root}
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      {child}
      {description && (
        <div ref={descriptionRef} className={styles.description}>
          {description}
        </div>
      )}
    </div>
  );

  /**
   * No results
   */
  if (!img) {
    return renderContainer(
      <Alert severity="warning" title="" data-testid={TEST_IDS.panel.warning}>
        {options.noResultsMessage}
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
    type = IMAGE_TYPES_SYMBOLS[img.charAt(0)];
    img = type ? `data:${type};base64,${img}` : `data:;base64,${img}`;
  } else if (Object.values(SupportedFileType).includes(m[1] as SupportedFileType)) {
    type = m[1];
  }

  /**
   * Convert PDF base64 to Blob and display
   */
  if (type === SupportedFileType.PDF) {
    const blob = base64toBlob(img, SupportedFileType.PDF);
    img = URL.createObjectURL(blob);

    /**
     * Disable toolbar
     */
    if (!options.toolbar) {
      img += '#toolbar=0';
    }

    return renderContainer(
      <iframe width={imageWidth || ''} height={imageHeight || ''} src={img} data-testid={TEST_IDS.panel.iframe} />
    );
  }

  /**
   * Display Video MP4 or WebM
   */
  if (type === SupportedFileType.MP4 || type === SupportedFileType.WEBM) {
    return renderContainer(
      <video
        muted={options.autoPlay}
        width={imageWidth || ''}
        height={imageHeight || ''}
        controls={options.controls}
        loop={options.infinityPlay}
        autoPlay={options.autoPlay}
        data-testid={TEST_IDS.panel.video}
      >
        <source src={img} />
      </video>
    );
  }

  /**
   * Display Audio OGG or MP3
   */
  if (type === SupportedFileType.MP3 || type === SupportedFileType.OGG) {
    return renderContainer(
      <audio
        controls={options.controls}
        autoPlay={options.autoPlay}
        data-testid={TEST_IDS.panel.audio}
        loop={options.infinityPlay}
      >
        <source src={img} />
      </audio>
    );
  }

  /**
   * Add URL to Image
   */
  let image = (
    <img
      width={imageWidth || ''}
      height={imageHeight || ''}
      src={img}
      data-testid={TEST_IDS.panel.image}
      alt=""
      style={{ imageRendering: options.scale }}
    />
  );
  if (options.url) {
    const url = replaceVariables(options.url);

    image = (
      <a className={cx(styles.url)} href={url} title={options.title} data-testid={TEST_IDS.panel.imageLink}>
        {image}
      </a>
    );
  }

  /**
   * Render Zoom Image
   */
  if (options.toolbar && options.buttons.length) {
    const renderZoomImage = () => {
      if (options.zoomType === ZoomType.PANPINCH) {
        return (
          <TransformWrapper
            ref={zoomPanPinchRef}
            disablePadding={true}
            wheel={{ touchPadDisabled: true, wheelDisabled: true }}
          >
            <TransformComponent>{image}</TransformComponent>
          </TransformWrapper>
        );
      }

      return (
        <ControlledZoom
          isZoomed={isZoomed}
          onZoomChange={setIsZoomed}
          zoomImg={{
            alt: '',
            src: img,
          }}
          classDialog={styles.zoom}
        >
          {image}
        </ControlledZoom>
      );
    };

    /**
     * Display Image with Toolbar
     */
    return renderContainer(
      <>
        {isToolbarShown && (
          <div ref={toolbarRef}>
            <PageToolbar
              forceShowLeftItems={options.buttons.includes(ButtonType.NAVIGATION)}
              leftItems={
                options.buttons.includes(ButtonType.NAVIGATION)
                  ? [
                      <ToolbarButton
                        key="previous"
                        icon="backward"
                        onClick={() => {
                          onChangeCurrentIndex('prev');
                        }}
                        data-testid={TEST_IDS.panel.buttonPrevious}
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
                        data-testid={TEST_IDS.panel.buttonNext}
                        disabled={Math.max(values.length, 1) === 1}
                      >
                        Next
                      </ToolbarButton>,
                    ]
                  : undefined
              }
            >
              {options.buttons.includes(ButtonType.DOWNLOAD) && (
                <ToolbarButton
                  icon="save"
                  onClick={() => {
                    saveAs(img);
                  }}
                  data-testid={TEST_IDS.panel.buttonDownload}
                >
                  Download
                </ToolbarButton>
              )}

              {options.buttons.includes(ButtonType.ZOOM) && options.zoomType !== ZoomType.PANPINCH && (
                <ToolbarButton
                  icon="search-plus"
                  onClick={() => {
                    setIsZoomed(true);
                  }}
                  data-testid={TEST_IDS.panel.buttonZoom}
                />
              )}
              {options.buttons.includes(ButtonType.ZOOM) && options.zoomType === ZoomType.PANPINCH && (
                <>
                  <ToolbarButton
                    icon="search-plus"
                    onClick={onZoomPanPinchIn}
                    data-testid={TEST_IDS.panel.buttonZoomPanPinchIn}
                  />
                  <ToolbarButton
                    icon="search-minus"
                    onClick={onZoomPanPinchOut}
                    data-testid={TEST_IDS.panel.buttonZoomPanPinchOut}
                  />
                  <ToolbarButton
                    icon="times-circle"
                    onClick={onResetZoomPanPinch}
                    data-testid={TEST_IDS.panel.buttonZoomPanPinchReset}
                  />
                </>
              )}
            </PageToolbar>
          </div>
        )}

        {options.buttons.includes(ButtonType.ZOOM) ? renderZoomImage() : image}
      </>
    );
  }

  /**
   * Display Image
   */
  return renderContainer(image);
};
