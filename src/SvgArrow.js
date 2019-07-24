// @flow

import React from 'react';
import Point from './Point';

type Props = {
  startingPoint: Point,
  startingAnchor: AnchorPositionType,
  endingPoint: Point,
  endingAnchor: AnchorPositionType,
  strokeColor: string,
  arrowLength: number,
  strokeWidth: number,
  arrowLabel?: ?React$Node,
  arrowShape: string,
  arrowMarkerId: string,
};

export function computeEndingPointAccordingToArrow(
  xEnd: number,
  yEnd: number,
  arrowLength: number,
  strokeWidth: number,
  endingAnchor: AnchorPositionType,
) {
  let endingVector;

  switch (endingAnchor) {
    case 'left':
      endingVector = { arrowX: -1, arrowY: 0 };
    case 'right':
      endingVector = { arrowX: 1, arrowY: 0 };
    case 'top':
      endingVector = { arrowX: 0, arrowY: -1 };
    case 'bottom':
    case 'bottom-start':
      endingVector = { arrowX: 0, arrowY: 1 };
    default:
      endingVector = { arrowX: 0, arrowY: 0 };
  }

  const { arrowX, arrowY } = endingVector;

  const xe = xEnd + (arrowX * arrowLength * strokeWidth) / 2;
  const ye = yEnd + (arrowY * arrowLength * strokeWidth) / 2;

  return { xe, ye };
}

export function computeLabelDimensions(
  xs: number,
  ys: number,
  xe: number,
  ye: number,
): { xl: number, yl: number, wl: number, hl: number } {
  const wl = Math.max(Math.abs(xe - xs), 1);
  const hl = Math.max(Math.abs(ye - ys), 1);

  const xl = xe > xs ? xs : xe;
  const yl = ye > ys ? ys : ye;

  return {
    xl,
    yl,
    wl,
    hl,
  };
}

const SvgArrow = ({
  startingPoint,
  startingAnchor,
  endingPoint,
  endingAnchor,
  strokeColor,
  arrowLength,
  strokeWidth,
  arrowLabel,
  arrowMarkerId,
  arrowShape,
}: Props) => {
  const actualArrowLength = arrowLength * 2;

  const xs = startingPoint.x;
  const ys = startingPoint.y;

  const endingPointWithArrow = computeEndingPointAccordingToArrow(
    endingPoint.x,
    endingPoint.y,
    actualArrowLength,
    strokeWidth,
    endingAnchor,
  );
  const { xe, ye } = endingPointWithArrow;

  let startingPosition = { xa1: xs, ya1: ys };
  if (startingAnchor === 'top' || startingAnchor === 'bottom' || startingAnchor === 'bottom-start') {
    startingPosition = {
      xa1: xs,
      ya1: ys + (ye - ys) / 2,
    };
  }
  if (startingAnchor === 'left' || startingAnchor === 'right') {
    startingPosition = {
      xa1: xs + (xe - xs) / 2,
      ya1: ys,
    };
  }

  const { xa1, ya1 } = startingPosition;

  let endingPosition = { xa2: xe, ya2: ye };
  if (endingAnchor === 'top' || endingAnchor === 'bottom' || endingAnchor === 'bottom-start') {
    endingPosition = {
      xa2: xe,
      ya2: ye - (ye - ys) / 2,
    };
  }
  if (endingAnchor === 'left' || endingAnchor === 'right') {
    endingPosition = {
      xa2: xe - (xe - xs) / 2,
      ya2: ye,
    };
  }

  const { xa2, ya2 } = endingPosition;

  const pathString = arrowShape === 'rect' ?
      `M${xs},${ys} ` + `L${xa1},${ya1}` + `L${xa2},${ya2}` + `L${xe},${ye}`
      : `M${xs},${ys} ` + `C${xa1},${ya1} ${xa2},${ya2} ` + `${xe},${ye}`;

  const { xl, yl, wl, hl } = computeLabelDimensions(xs, ys, xe, ye);

  return (
    <g>
      <path
        d={pathString}
        style={{ fill: 'none', stroke: strokeColor, strokeWidth }}
        markerEnd={`url(#${arrowMarkerId})`}
      />
      {arrowLabel && (
        <foreignObject x={xl} y={yl} width={wl} height={hl} style={{overflow:'visible'}}>
          <div
            style={{
              width: wl,
              height: hl,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>{arrowLabel}</div>
          </div>
        </foreignObject>
      )}
    </g>
  );
};

export default SvgArrow;
