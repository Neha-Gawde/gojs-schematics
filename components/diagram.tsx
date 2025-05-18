// components/Diagram.tsx
'use client';

import * as go from 'gojs';
import { useEffect, useRef } from 'react';

export default function Diagram() {
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, diagramRef.current!, {
      'undoManager.isEnabled': true,
      layout: $(go.GridLayout, {
        wrappingColumn: 0,
        spacing: new go.Size(40, 0),
        alignment: go.GridLayout.Position
      }),
    });

    diagram.nodeTemplate = $(
      go.Node,
      "Auto",
      $(go.Shape, "RoundedRectangle", { fill: "white" }),
      $(
        go.Panel, "Table",
        { defaultRowSeparatorStroke: "gray" },

        // Left-side ports
        $(
          go.Panel, "Vertical",
          {
            row: 0, column: 0,
            alignment: go.Spot.Left,
            alignmentFocus: go.Spot.Left,
            itemTemplate:
              $(
                go.Panel, "Auto",
                $(go.Shape, "Circle",
                  {
                    desiredSize: new go.Size(8, 8),
                    fill: "black",
                    portId: "",
                    fromLinkable: true,
                    toLinkable: true,
                    cursor: "pointer",
                    margin: 2
                  },
                  new go.Binding("portId", "portId"),
                  new go.Binding("fromLinkable", "fromLinkable"),
                  new go.Binding("toLinkable", "toLinkable"),
                  new go.Binding("fill", "color", c => c || "black")
                ),
                $(go.TextBlock,
                  { margin: 2, font: "10px sans-serif" },
                  new go.Binding("text", "label")
                )
              )
          },
          new go.Binding("itemArray", "ports", (ports) => 
            ports?.filter((p: { spot: go.Spot }) => p.spot === go.Spot.Left || p.spot?.equals?.(go.Spot.Left))
          )
        ),

        // Main label
        $(go.TextBlock,
          { margin: 8, row: 0, column: 1 },
          new go.Binding("text", "label")
        ),

        // Right-side ports
        $(
          go.Panel, "Vertical",
          {
            row: 0, column: 2,
            alignment: go.Spot.Right,
            alignmentFocus: go.Spot.Right,
            itemTemplate:
              $(
                go.Panel, "Auto",
                $(go.Shape, "Circle",
                  {
                    desiredSize: new go.Size(8, 8),
                    fill: "black",
                    portId: "",
                    fromLinkable: true,
                    toLinkable: true,
                    cursor: "pointer",
                    margin: 2
                  },
                  new go.Binding("portId", "portId"),
                  new go.Binding("fromLinkable", "fromLinkable"),
                  new go.Binding("toLinkable", "toLinkable"),
                  new go.Binding("fill", "color", c => c || "black")
                ),
                $(go.TextBlock,
                  { margin: 2, font: "10px sans-serif" },
                  new go.Binding("text", "label")
                )
              )
          },
          new go.Binding("itemArray", "ports", (ports) => 
            ports?.filter((p: { spot: go.Spot }) => p.spot === go.Spot.Right || p.spot?.equals?.(go.Spot.Right))
          )
        )
      )
    );
    // ... existing code ...
    // Group template for racks
    diagram.groupTemplate = $(
      go.Group, "Vertical",
      {
        layout: $(go.GridLayout, {
          wrappingColumn: 1,
          spacing: new go.Size(0, 20),
          alignment: go.GridLayout.Position
        }),
        isSubGraphExpanded: true,
        selectable: true,
        computesBoundsAfterDrag: true,
        handlesDragDropForMembers: true
      },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.TextBlock,
        { font: 'bold 12pt sans-serif', margin: new go.Margin(0, 0, 10, 0) },
        new go.Binding('text', 'key')
      ),
      $(go.Panel, "Auto",
        $(go.Shape, "Rectangle",
          {
            fill: null,
            stroke: '#999',
            strokeWidth: 1,
            strokeDashArray: [4, 2]
          }
        ),
        $(go.Placeholder, 
          { padding: 20 }
        )
      )
    );
    // ... existing code ...

    diagram.model = new go.GraphLinksModel(
      [
        { key: 'Rack 1', isGroup: true },
        {
          key: 'Outlets Rack 1', label: "Outlets", group: 'Rack 1', text: 'Outlets', isBold: true, category: "InnerOutlet", ports: [
            { portId: "11", label: "11", spot: go.Spot.Left, fromLinkable: true, toLinkable: true, key: "11" },
            { portId: "12", label: "12", spot: go.Spot.Left, fromLinkable: true, toLinkable: true, key: "12" },
            { portId: "13", label: "13", spot: go.Spot.Right, fromLinkable: true, toLinkable: true, key: "13" },
          ]
        },
        {
          key: 'HV-Pwr in',
          group: 'Rack 1',
          text: 'HV',
          ports: [
            { portId: "Pwr in", label: "Pwr in", spot: go.Spot.Left, key: "Pwr in" },
          ], label: "HV"
        },
        {
          key: 'TMP2-Pwr in',
          group: 'Rack 1',
          text: 'TMP2',
          ports: [
            { portId: "Pwr in", label: "Pwr in", spot: go.Spot.Left, key: "Pwr in" },
          ], label: "TMP2"
        },
        { key: 'Rack 2', isGroup: true },
        {
          key: 'Outlets Rack 2', label: "Outlets", group: 'Rack 2', text: 'Outlets', isBold: true, category: "InnerOutlet", ports: [
            { portId: "21", label: "21", spot: go.Spot.Left, fromLinkable: true, toLinkable: true, key: "21" },
            { portId: "22", label: "22", spot: go.Spot.Left, fromLinkable: true, toLinkable: true, key: "22" },
            { portId: "23", label: "23", spot: go.Spot.Right, fromLinkable: true, toLinkable: true, key: "23" },
          ]
        },
        // { key: 'Main PDU' },
      ],
      [
        { from: 'Outlets Rack 1', to: 'TMP2-Pwr in', fromPort: '11', toPort: 'Pwr in' },
        // { from: 'Rack 2', to: 'Main PDU' },
      ]
    );
    // Tell GoJS which properties to use for port-to-port linking
    (diagram.model as go.GraphLinksModel).linkFromPortIdProperty = "fromPort";
    (diagram.model as go.GraphLinksModel).linkToPortIdProperty = "toPort";

    return () => (diagram as any).dispose();
  }, []);

  return <div ref={diagramRef} style={{ width: '100%', height: '600px', border: '1px solid gray' }} />;
}
