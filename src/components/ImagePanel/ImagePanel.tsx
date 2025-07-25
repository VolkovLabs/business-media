import { css, cx } from '@emotion/css';
import { PanelProps } from '@grafana/data';
import { Alert, useStyles2 } from '@grafana/ui';
import React, { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { TEST_IDS } from '../../constants';
import { useImageElementProperties, useMediaData } from '../../hooks';
import { ImageSizeMode, MediaFormat, PanelOptions } from '../../types';
import { getValuesForMultiSeries } from '../../utils';
import { Toolbar } from '../Toolbar';
import { getStyles } from './ImagePanel.styles';

/**
 * Properties
 */
type Props = PanelProps<PanelOptions>;

/**
 * Image Panel
 */
export const ImagePanel: React.FC<Props> = ({ timeRange, options, data, width, height }) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * States
   */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const [descriptionHeight, setDescriptionHeight] = useState(0);

  /**
   * References
   */
  const toolbarRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  /**
   * Use media data
   */
  const { description, isNavigationShown, rowsLength, link, videoPoster, mediaSource } = useMediaData({
    options,
    data,
    currentIndex,
    timeRange,
  });

  /**
   * Is Toolbar Shown
   */
  const isToolbarShown = useMemo(() => {
    return options.toolbar && options.buttons.length > 0;
  }, [options.toolbar, options.buttons]);

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
   * Update current index on data series decrease
   */
  useEffect(() => {
    if (rowsLength !== 0 && currentIndex > rowsLength - 1) {
      setCurrentIndex(rowsLength - 1);
    }
  }, [currentIndex, data.series, rowsLength]);

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
      const heightField = getValuesForMultiSeries(data.series, options.heightName);

      imageHeight = Number(heightField[heightField.length - 1])
        ? Number(heightField[heightField.length - 1])
        : imageHeight;
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
      const widthField = getValuesForMultiSeries(data.series, options.widthName);

      imageWidth = Number(widthField[widthField.length - 1]) ? Number(widthField[widthField.length - 1]) : imageWidth;
    }

    imageWidth = options.width ? options.width : imageWidth;
  }

  /**
   * Use properties for image element and container
   */
  const { imageContainer, imageElement } = useImageElementProperties({
    options,
    imageWidth,
    imageHeight,
    toolbarHeight,
    descriptionHeight,
    width,
    height,
  });

  /**
   * Render Media Element
   */
  const renderElement = useCallback(
    (child?: JSX.Element) => (
      <>
        {child}
        {description && (
          <div ref={descriptionRef} className={styles.description}>
            {description}
          </div>
        )}
      </>
    ),
    [description, styles.description]
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
   * Image Element
   */
  const imageRenderElement = useMemo(() => {
    if (mediaSource.type !== MediaFormat.IMAGE) {
      return null;
    }

    let image = (
      <img
        src={mediaSource.url}
        data-testid={TEST_IDS.panel.image}
        alt=""
        style={{
          imageRendering: options.scale,
          maxWidth: imageElement.maxWidth,
          maxHeight: imageElement.maxHeight,
          width: imageElement.width,
          height: imageElement.height,
        }}
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

    if (options.heightMode === ImageSizeMode.SCROLL || options.widthMode === ImageSizeMode.SCROLL) {
      image = (
        <div
          data-testid={TEST_IDS.panel.imageScrollContainer}
          style={{
            width: imageContainer.width,
            height: imageContainer.height,
            overflowX: imageContainer.overflowX,
            overflowY: imageContainer.overflowY,
          }}
        >
          {image}
        </div>
      );
    }

    return image;
  }, [
    imageContainer.height,
    imageContainer.overflowX,
    imageContainer.overflowY,
    imageContainer.width,
    imageElement.height,
    imageElement.maxHeight,
    imageElement.maxWidth,
    imageElement.width,
    link,
    mediaSource.type,
    mediaSource.url,
    options.heightMode,
    options.scale,
    options.widthMode,
    styles.url,
  ]);

  /**
   * Video Element
   */
  const videoElement = useMemo(() => {
    if (mediaSource.type !== MediaFormat.VIDEO) {
      return null;
    }

    return (
      <video
        key={`${mediaSource.url}`}
        muted={options.autoPlay}
        width={imageWidth || ''}
        height={imageHeight || ''}
        controls={options.controls}
        loop={options.infinityPlay}
        autoPlay={options.autoPlay}
        data-testid={TEST_IDS.panel.video}
        poster={videoPoster}
      >
        <source src={mediaSource.url} />
      </video>
    );
  }, [
    imageHeight,
    imageWidth,
    mediaSource.type,
    mediaSource.url,
    options.autoPlay,
    options.controls,
    options.infinityPlay,
    videoPoster,
  ]);

  /**
   * Audio Element
   */
  const audioElement = useMemo(() => {
    if (mediaSource.type !== MediaFormat.AUDIO) {
      return null;
    }

    return (
      <audio
        controls={options.controls}
        autoPlay={options.autoPlay}
        data-testid={TEST_IDS.panel.audio}
        loop={options.infinityPlay}
      >
        <source src={mediaSource.url} />
      </audio>
    );
  }, [mediaSource.type, mediaSource.url, options.autoPlay, options.controls, options.infinityPlay]);

  /**
   * PDF Element
   */
  const pdfElement = useMemo(() => {
    if (mediaSource.type !== MediaFormat.PDF) {
      return null;
    }

    const pdf = (
      <iframe
        width={imageWidth || ''}
        height={imageHeight || ''}
        src={mediaSource.url}
        data-testid={TEST_IDS.panel.iframe}
      />
    );
    return pdf;
  }, [imageHeight, imageWidth, mediaSource.type, mediaSource.url]);

  /**
   * Final Media Element
   */
  const mediaElement = useMemo(() => {
    /**
     * Return no results
     */
    if (!mediaSource.type) {
      return renderAlertMessage(options.noResultsMessage);
    }

    const element = imageRenderElement || videoElement || audioElement || pdfElement;
    return element ? renderElement(element) : null;
  }, [
    audioElement,
    imageRenderElement,
    mediaSource.type,
    options.noResultsMessage,
    pdfElement,
    renderElement,
    videoElement,
  ]);

  return (
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
      {isToolbarShown ? (
        <Toolbar
          options={options}
          width={width}
          height={height}
          rowsLength={rowsLength}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          toolbarRef={toolbarRef}
          mediaSource={mediaSource}
        >
          {mediaElement}
        </Toolbar>
      ) : (
        mediaElement
      )}
    </div>
  );
};
