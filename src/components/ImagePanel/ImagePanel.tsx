import 'react-medium-image-zoom/dist/styles.css';

import { css, cx } from '@emotion/css';
import { PanelProps } from '@grafana/data';
import { Alert, PageToolbar, ToolbarButton, useStyles2 } from '@grafana/ui';
import { getLastFieldValue } from '@volkovlabs/grafana-utils';
import { saveAs } from 'file-saver';
import React, { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controlled as ControlledZoom } from 'react-medium-image-zoom';
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { TEST_IDS } from '../../constants';
import { useMediaData } from '../../hooks';
import { ButtonType, ImageSizeMode, MediaFormat, PanelOptions, SupportedFileType, ZoomType } from '../../types';
import { base64toBlob } from '../../utils';
import { getStyles } from './ImagePanel.styles';

/**
 * Properties
 */
interface Props extends PanelProps<PanelOptions> {}

/**
 * Image Panel
 */
export const ImagePanel: React.FC<Props> = ({ options, data, width, height }) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

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
   * Use media data
   */
  const {
    description,
    imageUrl,
    hasFormatSupport,
    media,
    isNavigationShown,
    type,
    values,
    videoUrl,
    link,
    videoPoster,
  } = useMediaData({
    options,
    data,
    currentIndex,
  });

  /**
   * Is Image Supported
   */
  const isImageSupported = hasFormatSupport(MediaFormat.IMAGE);

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
   * Calculate description height when panel width, height, descriptions or description field changed
   */
  useEffect(() => {
    setDescriptionHeight(descriptionRef.current?.clientHeight || 0);
  }, [width, height, options.description, description, currentIndex, isNavigationShown]);

  /**
   * Reset zoom when panel size is changed to avoid wrong image transform if zoom in
   */
  useEffect(() => {
    onResetZoomPanPinch();
  }, [width, height, onResetZoomPanPinch]);

  /**
   * Update current index on data series decrease
   */
  useEffect(() => {
    if (currentIndex > values?.length - 1) {
      setCurrentIndex(values?.length - 1);
    }
  }, [currentIndex, data.series, values?.length]);

  /**
   * Root Container
   */
  const renderContainer = (child?: JSX.Element) => (
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
   * Alert message
   */
  const renderAlertMessage = (text: string) => {
    return (
      <Alert severity="warning" title="" data-testid={TEST_IDS.panel.warning}>
        {text}
      </Alert>
    );
  };

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
      const heightField = getLastFieldValue(data.series, options.heightName);
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
      const widthField = getLastFieldValue(data.series, options.widthName);
      imageWidth = Number(widthField) ? Number(widthField) : imageWidth;
    }

    imageWidth = options.width ? options.width : imageWidth;
  }

  /**
   * No selected formats
   */
  if (!options.formats.length) {
    return renderContainer(renderAlertMessage('Support media formats not selected'));
  }

  /**
   * No results
   */
  if (!media && !videoUrl && !imageUrl) {
    return renderContainer(renderAlertMessage(options.noResultsMessage));
  }

  /**
   * Convert PDF base64 to Blob and display
   */
  if (type === SupportedFileType.PDF && media) {
    const blob = base64toBlob(media, SupportedFileType.PDF);
    let currentPdfMedia = URL.createObjectURL(blob);

    /**
     * Disable toolbar
     */
    if (!options.toolbar) {
      currentPdfMedia += '#toolbar=0';
    }

    /**
     * Return message if pdf was not selected
     */
    if (!hasFormatSupport(MediaFormat.PDF)) {
      return renderContainer(renderAlertMessage('PDF was not selected as a supported media format.'));
    }

    return renderContainer(
      <iframe
        width={imageWidth || ''}
        height={imageHeight || ''}
        src={currentPdfMedia}
        data-testid={TEST_IDS.panel.iframe}
      />
    );
  }

  /**
   * Display Audio OGG or MP3
   */
  if (!imageUrl && (type === SupportedFileType.MP3 || type === SupportedFileType.OGG)) {
    /**
     * Return message if audio was not selected
     */
    if (!hasFormatSupport(MediaFormat.AUDIO)) {
      return renderContainer(renderAlertMessage('Audio was not selected as a supported media format.'));
    }

    return renderContainer(
      <audio
        controls={options.controls}
        autoPlay={options.autoPlay}
        data-testid={TEST_IDS.panel.audio}
        loop={options.infinityPlay}
      >
        <source src={media} />
      </audio>
    );
  }

  let video;
  let isThisVideo = false;

  /**
   * Display Video MP4 or WebM
   */
  if (type === SupportedFileType.MP4 || type === SupportedFileType.WEBM || videoUrl) {
    isThisVideo = true;

    /**
     * Return message if video was not selected
     */
    if (!hasFormatSupport(MediaFormat.VIDEO)) {
      video = renderAlertMessage('Video was not selected as a supported media format.');
    } else {
      video = (
        <video
          muted={options.autoPlay}
          width={imageWidth || ''}
          height={imageHeight || ''}
          controls={options.controls}
          loop={options.infinityPlay}
          autoPlay={options.autoPlay}
          data-testid={videoUrl ? TEST_IDS.panel.videoUrl : TEST_IDS.panel.video}
          poster={videoPoster}
        >
          <source src={videoUrl || media} />
        </video>
      );
    }
  }

  /**
   * Add URL to Image
   */
  let image = (
    <img
      width={imageWidth || ''}
      height={imageHeight || ''}
      src={imageUrl || media}
      data-testid={imageUrl ? TEST_IDS.panel.imageUrl : TEST_IDS.panel.image}
      alt=""
      style={{ imageRendering: options.scale }}
    />
  );

  if (link && link.href) {
    image = (
      <a
        className={cx(styles.url)}
        href={link.href}
        target={link.target}
        title={link.title}
        data-testid={TEST_IDS.panel.imageLink}
      >
        {image}
      </a>
    );
  }

  /**
   * Return message if image was not selected
   */
  if (!isImageSupported) {
    image = renderAlertMessage('Image was not selected as a supported media format.');
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
            src: imageUrl || media,
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
              {!isThisVideo && isImageSupported && options.buttons.includes(ButtonType.DOWNLOAD) && media && (
                <ToolbarButton
                  icon="save"
                  onClick={() => {
                    saveAs(imageUrl || media);
                  }}
                  data-testid={TEST_IDS.panel.buttonDownload}
                >
                  Download
                </ToolbarButton>
              )}

              {!isThisVideo &&
                isImageSupported &&
                options.buttons.includes(ButtonType.ZOOM) &&
                options.zoomType !== ZoomType.PANPINCH && (
                  <ToolbarButton
                    icon="search-plus"
                    onClick={() => {
                      setIsZoomed(true);
                    }}
                    data-testid={TEST_IDS.panel.buttonZoom}
                  />
                )}
              {!isThisVideo &&
                isImageSupported &&
                options.buttons.includes(ButtonType.ZOOM) &&
                options.zoomType === ZoomType.PANPINCH && (
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
        {isThisVideo ? video : options.buttons.includes(ButtonType.ZOOM) ? renderZoomImage() : image}
      </>
    );
  }

  /**
   * Display Image
   */
  return renderContainer(isThisVideo ? video : image);
};
