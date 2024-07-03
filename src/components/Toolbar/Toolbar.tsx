import 'react-medium-image-zoom/dist/styles.css';

import { PageToolbar, ToolbarButton, useStyles2 } from '@grafana/ui';
import { saveAs } from 'file-saver';
import React, { Dispatch, ReactNode, RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Controlled as ControlledZoom } from 'react-medium-image-zoom';
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { TEST_IDS } from '../../constants';
import { ButtonType, MediaFormat, MediaSourceElement, PanelOptions, ZoomType } from '../../types';
import { getStyles } from './Toolbar.styles';

/**
 * Properties
 */
interface Props {
  /**
   * Options
   *
   * @type {PanelOptions}
   */
  options: PanelOptions;

  /**
   * Media Source
   *
   * @type {MediaSourceElement}
   */
  mediaSource: MediaSourceElement;

  /**
   * Width
   *
   * @type {number}
   */
  width: number;

  /**
   * Height
   *
   * @type {number}
   */
  height: number;

  /**
   * Children
   *
   * @type {React.ReactNode}
   */
  children: React.ReactNode;

  /**
   * Rows Length
   *
   * @type {number}
   */
  rowsLength: number;

  /**
   * Current Index
   *
   * @type {number}
   */
  currentIndex: number;

  /**
   * Change current index
   *
   * @type {Dispatch<React.SetStateAction<number>>}
   */
  setCurrentIndex: Dispatch<React.SetStateAction<number>>;

  /**
   * Toolbar ref
   *
   * @type {RefObject<HTMLDivElement>}
   */
  toolbarRef: RefObject<HTMLDivElement>;
}

/**
 * Toolbar
 */
export const Toolbar: React.FC<Props> = ({
  options,
  width,
  height,
  children,
  rowsLength,
  currentIndex,
  setCurrentIndex,
  toolbarRef,
  mediaSource,
}) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * States
   */
  const [isPlaying, setIsPlaying] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  /**
   * References
   */
  const zoomPanPinchRef = useRef<ReactZoomPanPinchRef | null>(null);

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
          nextIndex = rowsLength - 1;
        }
      } else {
        nextIndex = currentIndex + 1;
        if (nextIndex > rowsLength - 1) {
          nextIndex = 0;
        }
      }
      setCurrentIndex(nextIndex);

      /**
       * Reset zoom to avoid wrong image transform if zoom in
       */
      onResetZoomPanPinch();
    },
    [setCurrentIndex, onResetZoomPanPinch, currentIndex, rowsLength]
  );

  /**
   * Reset zoom when panel size is changed to avoid wrong image transform if zoom in
   */
  useEffect(() => {
    onResetZoomPanPinch();
  }, [width, height, onResetZoomPanPinch]);

  useEffect(() => {
    let interval = 0;

    if (isPlaying) {
      const timer = options.autoPlayInterval ? options.autoPlayInterval * 1000 : 5000;

      interval = window.setInterval(() => {
        if (currentIndex === rowsLength - 1) {
          if (!options.autoPlayInfinity) {
            window.clearInterval(interval);
            setIsPlaying((prevState) => !prevState);
            return;
          }

          setCurrentIndex(0);
          return;
        }

        setCurrentIndex(currentIndex + 1);
      }, timer);
    }

    return () => window.clearInterval(interval);
  }, [currentIndex, isPlaying, options.autoPlayInterval, options.autoPlayInfinity, rowsLength, setCurrentIndex]);

  const renderZoomImage = (children: React.ReactNode) => {
    if (options.zoomType === ZoomType.PANPINCH) {
      return (
        <TransformWrapper
          ref={zoomPanPinchRef}
          disablePadding={true}
          wheel={{ touchPadDisabled: true, wheelDisabled: true }}
        >
          <TransformComponent>{children}</TransformComponent>
        </TransformWrapper>
      );
    }

    return (
      <ControlledZoom
        isZoomed={isZoomed}
        onZoomChange={setIsZoomed}
        zoomImg={{
          alt: '',
          src: mediaSource.url,
        }}
        classDialog={styles.zoom}
      >
        {children}
      </ControlledZoom>
    );
  };

  /**
   * Get Toolbar Left Buttons
   */
  const getToolbarLeftButtons = () => {
    const buttons: ReactNode[] = [];

    /**
     * Navigation
     */
    if (options.buttons.includes(ButtonType.NAVIGATION)) {
      buttons.push(
        ...[
          <ToolbarButton
            key="previous"
            icon="backward"
            onClick={() => {
              onChangeCurrentIndex('prev');
            }}
            data-testid={TEST_IDS.panel.buttonPrevious}
            disabled={Math.max(rowsLength, 1) === 1}
          >
            Previous
          </ToolbarButton>,
          <div key="current">
            {currentIndex + 1} of {Math.max(rowsLength, 1)}
          </div>,
          <ToolbarButton
            key="next"
            icon="forward"
            onClick={() => {
              onChangeCurrentIndex('next');
            }}
            data-testid={TEST_IDS.panel.buttonNext}
            disabled={Math.max(rowsLength, 1) === 1}
          >
            Next
          </ToolbarButton>,
        ]
      );
    }

    /**
     * Autoplay
     */
    if (options.buttons.includes(ButtonType.AUTOPLAY)) {
      buttons.push(
        <ToolbarButton
          key={isPlaying ? 'pause' : 'play'}
          icon={isPlaying ? 'pause' : currentIndex === rowsLength - 1 ? 'repeat' : 'play'}
          onClick={() => {
            if (!isPlaying) {
              if (currentIndex === rowsLength - 1) {
                setCurrentIndex(0);
              }
            }

            setIsPlaying((prevState) => !prevState);
          }}
          data-testid={isPlaying ? TEST_IDS.panel.buttonPause : TEST_IDS.panel.buttonPlay}
          disabled={Math.max(rowsLength, 1) === 1}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </ToolbarButton>
      );
    }

    return buttons;
  };

  return (
    <>
      <div ref={toolbarRef}>
        <PageToolbar
          forceShowLeftItems={options.buttons.includes(ButtonType.NAVIGATION)}
          leftItems={options.buttons.includes(ButtonType.NAVIGATION) ? getToolbarLeftButtons() : undefined}
        >
          {options.buttons.includes(ButtonType.DOWNLOAD) && mediaSource.type === MediaFormat.IMAGE && (
            <ToolbarButton
              icon="save"
              onClick={() => {
                saveAs(mediaSource.url!);
              }}
              data-testid={TEST_IDS.panel.buttonDownload}
            >
              Download
            </ToolbarButton>
          )}

          {options.buttons.includes(ButtonType.ZOOM) &&
            options.zoomType !== ZoomType.PANPINCH &&
            mediaSource.type === MediaFormat.IMAGE && (
              <ToolbarButton
                icon="search-plus"
                onClick={() => {
                  setIsZoomed(true);
                }}
                data-testid={TEST_IDS.panel.buttonZoom}
              />
            )}
          {options.buttons.includes(ButtonType.ZOOM) &&
            options.zoomType === ZoomType.PANPINCH &&
            mediaSource.type === MediaFormat.IMAGE && (
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
      {options.buttons.includes(ButtonType.ZOOM) && mediaSource.type === MediaFormat.IMAGE
        ? renderZoomImage(children)
        : children}
    </>
  );
};
