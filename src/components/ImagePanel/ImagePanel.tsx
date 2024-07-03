import { css, cx } from '@emotion/css';
import { PanelProps } from '@grafana/data';
import { Alert, useStyles2 } from '@grafana/ui';
import { getLastFieldValue } from '@volkovlabs/grafana-utils';
import React, { JSX, useEffect, useMemo, useRef, useState } from 'react';

import { TEST_IDS } from '../../constants';
import { useMediaData } from '../../hooks';
import { ImageSizeMode, MediaFormat, PanelOptions } from '../../types';
import { Toolbar } from '../Toolbar';
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
    if (currentIndex > rowsLength - 1) {
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
   * Render Media Element
   */
  const renderElement = (child?: JSX.Element) => (
    <>
      {child}
      {description && (
        <div ref={descriptionRef} className={styles.description}>
          {description}
        </div>
      )}
    </>
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

  let mediaElement;

  /**
   * Return no results
   */
  if (!mediaSource.type) {
    mediaElement = renderAlertMessage(options.noResultsMessage);
  }

  /**
   * Image
   */
  if (mediaSource.type === MediaFormat.IMAGE) {
    let image = (
      <img
        width={imageWidth || ''}
        height={imageHeight || ''}
        src={mediaSource.url}
        data-testid={TEST_IDS.panel.image}
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

    mediaElement = renderElement(image);
  }

  /**
   * Video
   */
  if (mediaSource.type === MediaFormat.VIDEO) {
    const video = (
      <video
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

    mediaElement = renderElement(video);
  }

  /**
   * AUDIO
   */
  if (mediaSource.type === MediaFormat.AUDIO) {
    const audio = (
      <audio
        controls={options.controls}
        autoPlay={options.autoPlay}
        data-testid={TEST_IDS.panel.audio}
        loop={options.infinityPlay}
      >
        <source src={mediaSource.url} />
      </audio>
    );

    mediaElement = renderElement(audio);
  }

  /**
   * PDF
   */
  if (mediaSource.type === MediaFormat.PDF) {
    const pdf = (
      <iframe
        width={imageWidth || ''}
        height={imageHeight || ''}
        src={mediaSource.url}
        data-testid={TEST_IDS.panel.iframe}
      />
    );

    mediaElement = renderElement(pdf);
  }

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
