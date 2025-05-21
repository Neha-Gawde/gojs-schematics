'use client'

import * as go from 'gojs';
import { useEffect, useRef } from 'react';

const json = {
  "class": "go.GraphLinksModel",
  "copiesArrays": true,
  "copiesArrayObjects": true,
  "linkFromPortIdProperty": "fromPort",
  "linkToPortIdProperty": "toPort",
  "pointsDigits": 1,
  "nodeDataArray": [
    {
      "key": 1, "name": "Unit One", "loc": "101 204",
      "leftArray": [{ "portColor": 0, "portId": "left0" }],
      "topArray": [{ "portColor": 1, "portId": "top0" }],
      "bottomArray": [{ "portColor": 2, "portId": "bottom0" }],
      "rightArray": [
        { "portColor": 3, "portId": "right0" },
        { "portColor": 0, "portId": "right1" }
      ],
      "bottomPorts": [
        { "portId": "2" },
        { "portId": "3" }
      ]
    },
    {
      "key": 2,
      "name": "Unit Two",
      "loc": "400 150",
      "leftArray": [
        { "portId": "left0", "portColor": "black" },
        { "portId": "left1", "portColor": "black" },
        { "portId": "left2", "portColor": "black" }
      ],
      "topArray": [{ "portId": "top0", "portColor": "gray" }],
      "bottomArray": [
        { "portId": "bottom0", "portColor": "green" },
        { "portId": "bottom1", "portColor": "green" }
      ]
    },
    {
      "key": 3,
      "name": "Unit Three",
      "loc": "400 250",
      "leftArray": [
        { "portId": "left0", "portColor": "black" },
        { "portId": "left1", "portColor": "black" }
      ],
      "bottomArray": [{ "portId": "bottom0", "portColor": "green" }]
    },
    {
      "key": 4,
      "name": "Unit Four",
      "loc": "100 250",
      "leftArray": [{ "portId": "left0", "portColor": "black" }],
      "rightArray": [
        { "portId": "right0", "portColor": "black" },
        { "portId": "right1", "portColor": "black" }
      ],
      "bottomArray": [{ "portId": "bottom0", "portColor": "green" }]
    }
  ],
  "linkDataArray": [
    { "from": 4, "to": 2, "fromPort": "top0", "toPort": "bottom0" },
    { "from": 4, "to": 2, "fromPort": "top0", "toPort": "bottom0" },
    { "from": 3, "to": 2, "fromPort": "top0", "toPort": "bottom1" },
    { "from": 4, "to": 3, "fromPort": "right0", "toPort": "left0" },
    { "from": 4, "to": 3, "fromPort": "right1", "toPort": "left2" },
    { "from": 1, "to": 2, "fromPort": "right0", "toPort": "left1" },
    { "from": 1, "to": 2, "fromPort": "right1", "toPort": "left2" }
  ]
}

export default function InterlocksDiagram() {
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, diagramRef.current!, {
      initialContentAlignment: go.Spot.Center,
      "undoManager.isEnabled": true,
      layout: $(go.LayeredDigraphLayout, {
        direction: 0,
        columnSpacing: 50,
        layerSpacing: 50
      }),
      model: new go.GraphLinksModel({
        linkFromPortIdProperty: "fromPort",
        linkToPortIdProperty: "toPort",
        nodeDataArray: json.nodeDataArray,
        linkDataArray: json.linkDataArray
      })
    });

    function makePort(name: string, align: go.Spot, spot: go.Spot, output: boolean, input: boolean, color: string) {
      return $(go.Shape, 'Circle',
        {
          fill: color,
          stroke: null,
          desiredSize: new go.Size(8, 8),
          alignment: align, alignmentFocus: align,
          portId: name,
          fromSpot: spot, toSpot: spot,
          fromLinkable: output, toLinkable: input,
          cursor: 'pointer'
        });
    }

    diagram.nodeTemplate = $(
      go.Node, 'Spot',
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      $(
        go.Panel, 'Auto',
        $(go.Shape, 'Rectangle', { 
          fill: '#D3D3D3',  // Light gray background
          stroke: '#000',
          strokeWidth: 1
        }),
        $(go.TextBlock, { 
          margin: 8, 
          font: 'bold 11px sans-serif',
          alignment: go.Spot.Center
        },
          new go.Binding('text', 'name'))
      ),

      // Top ports
      $(go.Panel, 'Horizontal',
        { alignment: go.Spot.Top, alignmentFocus: go.Spot.Top },
        new go.Binding('itemArray', 'topArray'),
        {
          itemTemplate: $(
            go.Panel,
            makePort('top', go.Spot.Top, go.Spot.TopSide, true, true, 'black'),
            new go.Binding('portId', 'portId'),
            new go.Binding('fill', 'portColor', (i: number) => go.Brush.randomColor())
          )
        }
      ),

      // Bottom ports
      $(go.Panel, "Table",
        { alignment: go.Spot.Bottom },
        new go.Binding("itemArray", "bottomPorts"),
        {
          itemTemplate: $(go.Panel,
            $(go.Shape, "Circle",
              {
                fromSpot: go.Spot.Bottom,
                toSpot: go.Spot.Bottom,
                fromLinkable: true,
                toLinkable: true,
                fill: "black",
                desiredSize: new go.Size(8, 8)
              },
              new go.Binding("portId", "portId"),
              new go.Binding("column", "col")
            )
          )
        }
      ),

      // Left ports
      $(go.Panel, 'Vertical',
        { alignment: go.Spot.Left, alignmentFocus: go.Spot.Left },
        new go.Binding('itemArray', 'leftArray'),
        {
          itemTemplate: $(
            go.Panel,
            makePort('left', go.Spot.Left, go.Spot.LeftSide, true, true, 'black'),
            new go.Binding('portId', 'portId'),
            new go.Binding('fill', 'portColor', (i: number) => go.Brush.randomColor())
          )
        }
      ),

      // Right ports
      $(go.Panel, 'Vertical',
        { alignment: go.Spot.Right, alignmentFocus: go.Spot.Right },
        new go.Binding('itemArray', 'rightArray'),
        {
          itemTemplate: $(
            go.Panel,
            makePort('right', go.Spot.Right, go.Spot.RightSide, true, true, 'black'),
            new go.Binding('portId', 'portId'),
            new go.Binding('fill', 'portColor', (i: number) => go.Brush.randomColor())
          )
        }
      )
    );
    return () => {
      if (diagram.div && diagramRef.current) {
        diagramRef.current.removeChild(diagram.div);
      }
    };
  }, []);

  return <div ref={diagramRef} style={{ width: '100%', height: '600px' }} />;
}
