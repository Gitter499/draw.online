import { Stage, Layer, Line } from "react-konva";

import React, { useState, useRef } from "react";

import { AiOutlineCloudDownload } from "react-icons/ai";
import { IconButton } from "@chakra-ui/react";

const Canvas = ({ _width, _height }) => {
  // getting the stage from the target
  // inspired from Konva docs
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const [colors, setColors] = useState("#000000");
  const [drawOpts, setDrawOpts] = useState({});
  const drawing = useRef(false);
  const stageRef = React.useRef(null);

  const handleMouseDown = (e) => {
    console.log("mouse pressed");
    drawing.current = true;
    const p = e.target.getStage().getPointerPosition();
    setLines([
      ...lines,
      {
        tool,
        pos: [p.x, p.y],
        stroke: drawOpts.strokeWidth,
        color: colors,
        fill: drawOpts.fill,
      },
    ]);
  };
  const handleMouseMove = (e) => {
    console.log("Mouse moved!");
    if (!drawing.current) {
      return;
    }

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];

    if (lastLine === undefined) {
      setLines([...lines, { pos: [0, 0] }]);
    }

    lastLine.pos = lastLine.pos.concat([pointer.x, pointer.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    console.log("Mouse up");
    drawing.current = false;
  };

  const handleDownload = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a')
    link.href = uri
    link.download = "drawonline-canvas.png"
    link.click()
    link.remove()
  }

  // const syncCanvases = () => {
  //   ws.onopen = () => {
  //     ws.send("initial draw state");
  //     ws.onmessage = (event) => {
  //       const res = JSON.parse(event.data);
  //       console.log(res);
  //       switch (res.type) {
  //         case "initial draw state": {
  //           setLines([...lines, res.data]);
  //           break;
  //         }

  //         default: {
  //           break;
  //         }
  //       }
  //     };
  //   };
  // };

  return (
    <React.Fragment>
      <div
        style={{
          backgroundColor: "white",
        }}
      >
        <Stage
          width={_width}
          height={_height}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          ref={stageRef}
        >
          <Layer>
            {lines.map((line, idx) => (
              <Line
                key={idx}
                points={line.pos}
                stroke={line.color}
                strokeWidth={line.stroke}
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
                fill={line.fill}
                // set more options
              ></Line>
            ))}
          </Layer>
        </Stage>
      </div>
      <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
      </select>
      <select
        value={colors}
        onChange={(e) => {
          setColors(e.target.value);
        }}
      >
        <option value="#000000">Black</option>
        <option value="#1484E6">Blue</option>
        <option value="#18E614">Green</option>
        <option value="#F1E61F">Yellow</option>
        <option value="#F11FE1">Pink</option>
        <option value="#9D0C93">Purple</option>
      </select>
      <select
        value={drawOpts.strokeWidth}
        onChange={(e) => {
          setDrawOpts({ strokeWidth: parseInt(e.target.value) });
        }}
      >
        <option value="2">2px</option>
        <option value="5">5px</option>
        <option value="8">8px</option>
        <option value="12">12px</option>
        <option value="16">16px</option>
      </select>
      <IconButton
        colorScheme="purple.500"
        aria-label="Search database"
        icon={<AiOutlineCloudDownload />}
        onClick={handleDownload}
      />
    </React.Fragment>
  );
};

export default Canvas;
