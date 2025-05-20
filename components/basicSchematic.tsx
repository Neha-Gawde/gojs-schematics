// components/BasicSchematic.tsx
'use client';

import * as go from 'gojs';
import { useEffect, useRef } from 'react';

const PDU_PORTS = [
  {
    rack: "Rack 1",
    ports: [
      // Left ports
      { portId: "X2", label: "X2", spot: go.Spot.Left },
      { portId: "X3", label: "X3", spot: go.Spot.Left },
      { portId: "X4", label: "X4", spot: go.Spot.Left },
      { portId: "X6", label: "X6", spot: go.Spot.Left },
      { portId: "X7", label: "X7", spot: go.Spot.Left },
      { portId: "X8", label: "X8", spot: go.Spot.Left },
      { portId: "X9", label: "X9", spot: go.Spot.Left },
      // Right ports
      { portId: "X5", label: "X5", spot: go.Spot.Right },
      { portId: "X1", label: "X1", spot: go.Spot.Right },
    ]
  },
  {
    rack: "Rack 2",
    ports: [
      {
        portId: "X5",
        label: "X5",
        spot: go.Spot.Left
      },
      {
        portId: "X6",
        label: "X6",
        spot: go.Spot.Left
      },
      {
        portId: "X7",
        label: "X7",
        spot: go.Spot.Left
      },
      {
        portId: "X8",
        label: "X8",
        spot: go.Spot.Left
      },
      {
        portId: "X2",
        label: "X2",
        spot: go.Spot.Left
      },
      {
        portId: "X3",
        label: "X3",
        spot: go.Spot.Right
      },
      {
        portId: "X1",
        label: "X1",
        spot: go.Spot.Right
      },
    ]
  },
]

export default function BasicSchematic() {
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const $ = go.GraphObject.make;

    if (!diagramRef.current) return;

    const diagram: go.Diagram = $(go.Diagram, diagramRef.current, {
      'undoManager.isEnabled': true,
      layout: $(go.Layout),  // Use basic Layout instead of undefined
      initialContentAlignment: go.Spot.Center,
      allowZoom: true,
      allowMove: true,
    });

    // Use the default template for other nodes
    diagram.nodeTemplate = $(go.Node, "Auto",
      {
        width: 180,
        minSize: new go.Size(180, NaN),
        maxSize: new go.Size(NaN, NaN),
        margin: new go.Margin(0, 0, 10, 0),
        height: 100,
      },
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Shape, "Rectangle",
        { fill: "#fff", stroke: "#0074D9", strokeWidth: 2 }
      ),
      $(go.TextBlock,
        {
          margin: 0,
          font: "bold 14pt sans-serif",
          editable: false,
          textAlign: "center",
          alignment: go.Spot.Center
        },
        new go.Binding("text", "text")
      ),
      // LEFT ports (dynamically from ports array)
      $(go.Panel, "Table",
        {
          alignment: go.Spot.Left,
          alignmentFocus: go.Spot.Left,
          margin: new go.Margin(40, 0, 0, 0),
          itemTemplate: $(
            go.Panel, "Horizontal",
            new go.Binding("row", "row"),
            $(go.Shape, "Circle",
              {
                fromSpot: go.Spot.Left,
                toSpot: go.Spot.Left,
                fill: "black",
                stroke: null,
                desiredSize: new go.Size(8, 8),
                fromLinkable: true,
                toLinkable: true
              },
              new go.Binding("portId", "portId"),
              new go.Binding("visible", "spot", s => s === go.Spot.Left)
            ),
            $(go.TextBlock,
              {
                margin: new go.Margin(0, 0, 0, 4),
                font: "10pt sans-serif",
                alignment: go.Spot.Left
              },
              new go.Binding("text", "label")
            )
          )
        },
        new go.Binding("itemArray", "ports", ports =>
          ports.filter((p: any) => p.spot === go.Spot.Left)
            .map((p: any, idx: number) => ({ ...p, row: idx }))
        )
      ),
      // RIGHT ports (dynamically from ports array)
      $(go.Panel, "Table",
        {
          alignment: go.Spot.Right,
          alignmentFocus: go.Spot.Right,
          margin: new go.Margin(40, 0, 0, 0),
          itemTemplate: $(go.Panel, "Horizontal",
            new go.Binding("row", "row"),
            $(go.TextBlock,
              {
                margin: new go.Margin(0, 4, 0, 0),
                font: "10pt sans-serif",
                alignment: go.Spot.Right
              },
              new go.Binding("text", "label"),
              new go.Binding("visible", "spot", s => s === go.Spot.Right)
            ),
            $(go.Shape, "Circle",
              {
                fromSpot: go.Spot.Right,
                toSpot: go.Spot.Right,
                fill: "black",
                stroke: null,
                desiredSize: new go.Size(8, 8),
                alignment: go.Spot.Right,
                alignmentFocus: go.Spot.Right,
                margin: new go.Margin(4, 0)
              },
              new go.Binding("portId", "portId"),
              new go.Binding("visible", "spot", s => s === go.Spot.Right)
            )
          )
        },
        new go.Binding("itemArray", "ports", ports =>
          ports.filter((p: any) => p.spot === go.Spot.Right)
            .map((p: any, idx: number) => ({ ...p, row: idx }))
        )
      )
    );

    // Group template for racks
    diagram.groupTemplate = $(
      go.Group,
      'Vertical',
      {
        layout: $(go.GridLayout, { wrappingColumn: 1, spacing: new go.Size(0, 20) }),
        isSubGraphExpanded: true,
        selectable: true,
        computesBoundsAfterDrag: true,
        handlesDragDropForMembers: true,
      },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.TextBlock, { font: 'bold 12pt sans-serif', margin: 4 }, new go.Binding('text', 'key')),
      $(go.Panel, 'Auto',
        $(go.Shape, { fill: null, stroke: '#999', strokeWidth: 1, strokeDashArray: [4, 2] }),
        $(go.Placeholder, { padding: 50 })
      )
    );

    // Link template
    diagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        corner: 10,
        fromEndSegmentLength: 40,
        toEndSegmentLength: 40,
        curviness: 20
      },
      $(go.Shape, { stroke: "#357", strokeWidth: 2 }),
      $(go.Shape, { toArrow: "Standard", fill: "#357" }),
      $(go.TextBlock, new go.Binding("text", "label"), { segmentOffset: new go.Point(0, -10) })
    );
    // Inner Outlet node template
    diagram.nodeTemplateMap.add("InnerOutlet",
      $(go.Node, "Auto",
        {
          width: 180,
          minSize: new go.Size(180, NaN),
          maxSize: new go.Size(NaN, NaN),
          margin: new go.Margin(20)
        },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, "Rectangle",
          { fill: "#fff", stroke: "#0074D9", strokeWidth: 2 }
        ),
        $(go.TextBlock,
          {
            margin: 8,
            font: "bold 14pt sans-serif",
            editable: false,
            textAlign: "center",
            alignment: go.Spot.Center
          },
          new go.Binding("text", "text")
        ),
        // LEFT ports (dynamically from ports array)
        $(go.Panel, "Table",
          {
            alignment: go.Spot.Left,
            alignmentFocus: go.Spot.Left,
            margin: new go.Margin(0, 0, 0, 0),
            itemTemplate: $(go.Panel, "Horizontal",
              new go.Binding("row", "row"),
              $(go.Shape, "Circle",
                {
                  fromSpot: go.Spot.Left,
                  toSpot: go.Spot.Left,
                  fill: "black",
                  stroke: null,
                  desiredSize: new go.Size(8, 8),
                  alignment: go.Spot.Left,
                  alignmentFocus: go.Spot.Left,
                  margin: new go.Margin(4, 0)
                },
                new go.Binding("portId", "portId"),
                new go.Binding("visible", "spot", s => s === go.Spot.Left)
              )
            )
          },
          new go.Binding("itemArray", "ports", ports =>
            ports.filter((p: any) => p.spot === go.Spot.Left)
              .map((p: any, idx: number) => ({ ...p, row: idx }))
          )
        ),
        // RIGHT ports (dynamically from ports array)
        $(go.Panel, "Table",
          {
            alignment: go.Spot.Right,
            alignmentFocus: go.Spot.Right,
            margin: new go.Margin(0, 0, 0, 0),
            itemTemplate: $(go.Panel, "Horizontal",
              new go.Binding("row", "row"),
              $(go.Shape, "Circle",
                {
                  fromSpot: go.Spot.Right,
                  toSpot: go.Spot.Right,
                  fill: "black",
                  stroke: null,
                  desiredSize: new go.Size(8, 8),
                  alignment: go.Spot.Right,
                  alignmentFocus: go.Spot.Right,
                  margin: new go.Margin(4, 0)
                },
                new go.Binding("portId", "portId"),
                new go.Binding("visible", "spot", s => s === go.Spot.Right)
              )
            )
          },
          new go.Binding("itemArray", "ports", ports =>
            ports.filter((p: any) => p.spot === go.Spot.Right)
              .map((p: any, idx: number) => ({ ...p, row: idx }))
          )
        )
      )
    );
    // PDU node template
    diagram.nodeTemplateMap.add("PDU",
      $(go.Node, "Auto",
        { width: 180, height: 180 },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, "Rectangle",
          { fill: "#fff", stroke: "#0074D9", strokeWidth: 2 }
        ),
        $(go.TextBlock,
          {
            margin: 8,
            font: "bold 14pt sans-serif",
            editable: false,
            textAlign: "center",
            alignment: go.Spot.Center
          },
          new go.Binding("text", "text")
        ),
        // LEFT ports (dynamically from ports array)
        $(go.Panel, "Table",
          {
            alignment: go.Spot.Left,
            alignmentFocus: go.Spot.Left,
            margin: new go.Margin(0, 0, 0, 4),
            itemTemplate:
              $(go.Panel, "Horizontal",
                new go.Binding("row", "row"),
                $(go.Shape, "Circle",
                  {
                    fromSpot: go.Spot.Left,
                    toSpot: go.Spot.Left,
                    fill: "black", stroke: null, desiredSize: new go.Size(8, 8)
                  },
                  new go.Binding("portId", "portId"),
                  new go.Binding("visible", "spot", s => s === go.Spot.Left),
                  new go.Binding("fromLinkable", "fromLinkable"),
                  new go.Binding("toLinkable", "toLinkable"),
                ),
                $(go.TextBlock,
                  { margin: 2, font: "10pt sans-serif", alignment: go.Spot.Left },
                  new go.Binding("text", "label"),
                  new go.Binding("visible", "spot", s => s === go.Spot.Left)
                )
              )
          },
          new go.Binding("itemArray", "ports", ports =>
            ports
              .filter((p: any) => p.spot === go.Spot.Left)
              .map((p: any, idx: number) => ({ ...p, row: idx }))
          )
        ),
        // RIGHT ports (dynamically from ports array)
        $(go.Panel, "Table",
          {
            alignment: go.Spot.Right,
            alignmentFocus: go.Spot.Right,
            margin: new go.Margin(0, 4, 0, 0),
            itemTemplate:
              $(go.Panel, "Horizontal",
                new go.Binding("row", "row"),
                $(go.TextBlock,
                  { margin: 2, font: "10pt sans-serif", alignment: go.Spot.Right },
                  new go.Binding("text", "label"),
                  new go.Binding("visible", "spot", s => s === go.Spot.Right),
                  new go.Binding("fromLinkable", "fromLinkable"),
                  new go.Binding("toLinkable", "toLinkable"),
                ),
                $(go.Shape, "Circle",
                  {
                    fromSpot: go.Spot.Right,
                    toSpot: go.Spot.Right,
                    fill: "black", stroke: null, desiredSize: new go.Size(8, 8)
                  },
                  new go.Binding("portId", "portId"),
                  new go.Binding("visible", "spot", s => s === go.Spot.Right)
                )
              )
          },
          new go.Binding("itemArray", "ports", ports =>
            ports
              .filter((p: any) => p.spot === go.Spot.Right)
              .map((p: any, idx: number) => ({ ...p, row: idx }))
          )
        )
      )
    );

    // Model with sample nodes
    diagram.model = new go.GraphLinksModel(
      [
        { key: 'Rack 1', isGroup: true, label: "Rack 1" },  // Position Rack 1 to the right of Rack 2
        {
          key: 'Outlets Rack 1', label: "Outlets", group: 'Rack 1', text: 'Outlets', isBold: true, category: "InnerOutlet", ports: [
            { portId: "11", label: "11", spot: go.Spot.Left, fromLinkable: true, toLinkable: true },
            { portId: "12", label: "12", spot: go.Spot.Left, fromLinkable: true, toLinkable: true },
            { portId: "13", label: "13", spot: go.Spot.Right, fromLinkable: true, toLinkable: true },
          ]
        },
        {
          key: 'HV-Pwr in',
          group: 'Rack 1',
          text: 'HV',
          ports: [
            { portId: "Pwr in", label: "Pwr in", spot: go.Spot.Left },
          ], label: "HV"
        },
        {
          key: 'TMP2-Pwr in',
          group: 'Rack 1',
          text: 'TMP2',
          ports: [
            { portId: "Pwr in", label: "Pwr in", spot: go.Spot.Left },
          ], label: "TMP2"
        },
        {
          key: 'TMP1-Pwr in',
          group: 'Rack 1',
          text: 'TMP1',
          ports: [
            { portId: "Pwr in", label: "Pwr in", spot: go.Spot.Left },
          ], label: "TMP1"
        },
        {
          key: 'TMP3-Pwr in',
          group: 'Rack 1',
          text: 'TMP3',
          ports: [
            { portId: "Pwr in", label: "Pwr in", spot: go.Spot.Left },
          ], label: "TMP3"
        },
        {
          key: 'RF1-Pwr in',
          group: 'Rack 1',
          text: 'RF1',
          ports: [
            { portId: "Pwr in", label: "Pwr in", spot: go.Spot.Left },
          ], label: "RF1"
        },
        {
          key: 'PDU',
          group: 'Rack 1',
          text: 'PDU',
          category: "PDU",
          ports: PDU_PORTS[0].ports
        },
        { key: 'Rack 2', isGroup: true, label: "Rack 2" },
        {
          key: 'Outlets Rack 2',
          label: "Outlets",
          group: 'Rack 2',
          text: 'Outlets',
          isBold: true,
          category: "InnerOutlet",
          ports: [
            { portId: "21", label: "21", spot: go.Spot.Left, key: "21", fromLinkable: true, toLinkable: true, },
            { portId: "22", label: "22", spot: go.Spot.Left, key: "22", fromLinkable: true, toLinkable: true, },
            { portId: "23", label: "23", spot: go.Spot.Right, key: "23", fromLinkable: true, toLinkable: true, },
          ]
        },
        {
          key: 'Pwr in-Network Switch',
          group: 'Rack 2',
          text: 'Network Switch',
          ports: [
            { portId: "Pwr in", label: "Pwr in", spot: go.Spot.Left, key: "Pwr in", fromLinkable: true, toLinkable: true, },
          ], label: "Network Switch"
        },
        {
          key: 'ES5-ES4 T21, T26',
          group: 'Rack 2',
          text: 'ES5 - cRIO',
          isBold: true,
          isItalic: true,
          ports: [
            { portId: "ES5 T31, T34", label: "ES5 T31, T34", spot: go.Spot.Left },
          ], label: "ES5 - cRIO"
        },
        {
          key: 'ES4-ES3 T21, T26',
          group: 'Rack 2',
          text: 'ES4 – Digital 2',
          isBold: true, isItalic: true,
          ports: [
            { portId: "ES4 T21, T26", label: "ES4 T21, T26", spot: go.Spot.Left },
          ], label: "ES4 - Digital 2"
        },
        {
          key: 'ES3-ES2 T21, T26',
          group: 'Rack 2',
          text: 'ES3 – Digital 1',
          isBold: true, isItalic: true,
          ports: [
            { portId: "ES3 T21, T26", label: "ES3 T21, T26", spot: go.Spot.Left },
          ], label: "ES3 - Digital 1"
        },
        {
          key: 'ES2-ES1 T21, T26',
          group: 'Rack 2',
          text: 'ES2 – n/c',
          isBold: true, isItalic: true,
          ports: [
            { portId: "", label: "", spot: go.Spot.Left },
          ], label: "ES2 - n/c"
        },
        {
          key: 'ES1-ES1 T21, T26',
          group: 'Rack 2',
          text: 'ES1 - Interlocks',
          isBold: true, isItalic: true,
          ports: [
            { portId: "ES1 T21, T26", label: "ES1 T21, T26", spot: go.Spot.Left },
          ], label: "ES1 - Interlocks"
        },
        { key: 'PDU', group: 'Rack 2', text: 'PDU', category: "PDU", ports: PDU_PORTS[1].ports },
      ],
      [
        // Rack 1 connections
        {
          from: 'Outlets Rack 1',
          to: 'PDU',
          label: 'ETB-092',
          color: '#1b8ea6',
          fromPort: '13',
          toPort: 'X5',
          group: 'Rack 1'
        },
        {
          from: 'HV-Pwr in',
          to: 'PDU',
          label: 'ETB-092',
          color: '#1b8ea6',
          fromPort: 'Pwr in',
          toPort: 'X9',
          group: 'Rack 1'
        },
        {
          from: 'TMP2-Pwr in',
          to: 'PDU',
          label: 'ETB-092',
          color: '#1b8ea6',
          fromPort: 'Pwr in',
          toPort: 'X7',
          group: 'Rack 1'
        },
        // Rack 2 connections
        // ... existing code ...
        // ... existing code ...
        {
          from: 'Outlets Rack 2',  // Changed to use the node key instead of port ID
          to: 'Pwr in-Network Switch',
          label: 'ETB-082',
          color: '#1b8ea6',
          fromPort: '22',  // This specifies which port on the node to use
          toPort: 'Pwr in',
          group: 'Rack 2'
        },
      ]
    );

    // Tell GoJS which properties to use for port-to-port linking
    (diagram.model as go.GraphLinksModel).linkFromPortIdProperty = "fromPort";
    (diagram.model as go.GraphLinksModel).linkToPortIdProperty = "toPort";
    return () => (diagram as any).dispose();
  }, []);

  return <div ref={diagramRef} style={{ width: '100%', height: '600px', border: '1px solid #ccc' }} />;
}