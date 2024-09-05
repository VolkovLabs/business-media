/**
 * Tests Identifiers
 */
export const TEST_IDS = {
  panel: {
    audio: 'data-testid panel audio',
    buttonDownload: 'data-testid panel button-download',
    buttonNext: 'data-testid panel button-next',
    buttonPause: 'data-testid panel button-pause',
    buttonPlay: 'data-testid panel button-play',
    buttonPrevious: 'data-testid panel button-previous',
    buttonZoom: 'data-testid panel button-zoom',
    buttonZoomPanPinchIn: 'data-testid panel button-zoom-pan-pinch-in',
    buttonZoomPanPinchOut: 'data-testid panel button-zoom-pan-pinch-out',
    buttonZoomPanPinchReset: 'data-testid panel button-zoom-pan-pinch-reset',
    iframe: 'data-testid panel iframe',
    image: 'data-testid panel image',
    imageScrollContainer: 'data-testid panel image-scroll-container',
    imageLink: 'data-testid panel image-link',
    root: 'data-testid panel',
    video: 'data-testid panel video',
    warning: 'data-testid panel warning',
    zoomedImage: 'data-testid panel zoomed-image',
  },
  mediaSourceEditor: {
    root: 'data-testid media-source-editor',
    buttonAddNew: 'data-testid media-source-editor button-add-new',
    buttonRemove: 'data-testid media-source-editor button-remove',
    itemHeader: (name: string) => `data-testid media-source-editor item-header-${name}`,
    itemContent: (name: string) => `data-testid media-source-editor item-content-${name}`,
    fieldType: 'data-testid media-source-editor field-type',
    fieldName: 'data-testid media-source-editor field-name',
    fieldTypeNew: 'data-testid media-source-editor field-type-new',
    fieldNameNew: 'data-testid media-source-editor field-name-new',
  },
};
