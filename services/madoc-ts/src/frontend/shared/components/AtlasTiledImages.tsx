import React, { useEffect, useState } from 'react';
import { CanvasNormalized, ImageService } from '@hyperion-framework/types';
import { GetTile, getTileFromImageService, TileSet } from '@atlas-viewer/atlas';

export const AtlasTiledImages: React.FC<{ canvas: CanvasNormalized; service: ImageService }> = ({
  canvas,
  service,
}) => {
  const [tile, setTile] = useState<GetTile>();

  useEffect(() => {
    if (service) {
      getTileFromImageService((service as any).id, canvas.width, canvas.height).then(s => {
        setTile(s); // only show the first image.
      });
    }
  }, [service, canvas]);

  if (!tile) {
    return (
      <worldObject height={canvas.height} width={canvas.width}>
        <box target={{ x: 0, y: 0, width: canvas.width, height: canvas.height }} id="123" backgroundColor="#000" />
      </worldObject>
    );
  }

  return <TileSet tiles={tile} x={0} y={0} width={canvas.width} height={canvas.height} />;
};
