// components/BasicSchematic.tsx
'use client';

import * as go from 'gojs';
import { useEffect, useRef } from 'react';
import { AvoidsLinksRouter } from '../lib/gojs/AvoidLinkRoute';

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
  {
    rack: "Rack 3",
    ports: [
      { portId: "X1", label: "X1", spot: go.Spot.Right },
      { portId: "X2", label: "X2", spot: go.Spot.Right },
      { portId: "X3", label: "X3", spot: go.Spot.Right },
      { portId: "X5", label: "X5", spot: go.Spot.Left },
      { portId: "X6", label: "X6", spot: go.Spot.Left },
      { portId: "X7", label: "X7", spot: go.Spot.Left },
      { portId: "X8", label: "X8", spot: go.Spot.Left },
      { portId: "X9", label: "X9", spot: go.Spot.Left },
    ]
  },
  {
    rack: "Rack 4",
    ports: [
      { portId: "X1", label: "X1", spot: go.Spot.Right },
      { portId: "X3", label: "X3", spot: go.Spot.Left },
      { portId: "X2", label: "X2", spot: go.Spot.Left },
      { portId: "X4", label: "X4", spot: go.Spot.Left },
      { portId: "X5", label: "X5", spot: go.Spot.Left },
    ]
  }
]

interface NodeData {
  key: string;
  group?: string;
  text?: string;
  position?: string;
  ports?: Array<{
    portId: string;
    label: string;
    spot: go.Spot;
  }>;
  label?: string;
  isGroup?: boolean;
  isBold?: boolean;
  category?: string;
  isItalic?: boolean;
  numberOfRows?: number;
  row?: number;  // Added for position tracking
  column?: number;  // Added for position tracking
  loc?: string;  // Added for position tracking
  layer?: number;  // Add this property
  layerOrder?: number;  // Add this property
}

const nodeDataArray = [
  {
    key: 'APC',
    isGroup: false,
    label: "APC",
    text: "APC",
    category: "APC",
    loc: "0 0",  // Set initial location
    layer: 0,  // First layer
    layerOrder: 0,
    ports: [
      { portId: "Pwr", label: "Pwr", spot: go.Spot.Right },
    ]
  },
  { key: 'Rack 4', isGroup: true, label: "Rack 4", layer: 0, layerOrder: 1 },
  { key: 'Rack 3', isGroup: true, label: "Rack 3", layer: 0, layerOrder: 2 },
  { key: 'Rack 2', isGroup: true, label: "Rack 2", layer: 0, layerOrder: 3 },
  { key: 'Rack 1', isGroup: true, label: "Rack 1", layer: 0, layerOrder: 4 },
  {
    key: 'GAS Box 1', isGroup: false, label: "GASBox", layer: 1, layerOrder: 0, category: "normalParent",
    ports: [
      { portId: "1", label: "1", spot: go.Spot.Left },
      { portId: "2", label: "P406", spot: go.Spot.Right },
    ]
  },
  {
    key: 'OuterOutlet1', isGroup: false, label: "Outlet", description: "L5-20R", layer: 1, layerOrder: 0, category: "normalParent",
    ports: [
      { portId: "1", label: "1", spot: go.Spot.Left },
      { portId: "2", label: "2", spot: go.Spot.Right },
    ]
  },
  {
    key: 'OuterOutlet2', isGroup: false, label: "Outlet", description: "L5-20R", layer: 1, layerOrder: 0, category: "normalParent",
    ports: [
      { portId: "1", label: "1", spot: go.Spot.Left },
      { portId: "2", label: "2", spot: go.Spot.Right },
    ]
  },
  {
    key: 'OuterOutlet3', isGroup: false, label: "Outlet", description: "L5-20R", layer: 1, layerOrder: 0, category: "normalParent",
    ports: [
      { portId: "1", label: "1", spot: go.Spot.Left },
      { portId: "2", label: "2", spot: go.Spot.Right },
    ]
  },
  {
    key: 'OuterOutlet4', isGroup: false, label: "Outlet", description: "L5-20R", layer: 1, layerOrder: 0, category: "normalParent",
    ports: [
      { portId: "1", label: "1", spot: go.Spot.Left },
      { portId: "2", label: "2", spot: go.Spot.Right },
    ]
  },
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
    key: 'PDU-Rack 1',
    group: 'Rack 1',
    text: 'PDU',
    category: "PDU",
    ports: PDU_PORTS[0].ports
  },
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
  { key: 'PDU-Rack 2', group: 'Rack 2', text: 'PDU', category: "PDU", ports: PDU_PORTS[1].ports },
  {
    key: 'Outlets Rack 31', label: "Outlets 1", group: 'Rack 3', text: 'Outlets 1', isBold: true, category: "InnerOutlet", ports: [
      { portId: "311", label: "311", spot: go.Spot.Left, fromLinkable: true, toLinkable: true },
      { portId: "312", label: "312", spot: go.Spot.Left, fromLinkable: true, toLinkable: true },
      { portId: "313", label: "313", spot: go.Spot.Right, fromLinkable: true, toLinkable: true },
    ]
  },
  {
    key: 'Outlets Rack 32', label: "Outlets 2", group: 'Rack 3', text: 'Outlets 2', isBold: true, category: "InnerOutlet", ports: [
      { portId: "321", label: "321", spot: go.Spot.Left, fromLinkable: true, toLinkable: true },
      { portId: "322", label: "322", spot: go.Spot.Left, fromLinkable: true, toLinkable: true },
      { portId: "323", label: "323", spot: go.Spot.Right, fromLinkable: true, toLinkable: true },
    ]
  },
  {
    key: 'ES3',
    group: 'Rack 3',
    text: 'ES3',
    ports: [
      { portId: "T1/T2", label: "T1/T2", spot: go.Spot.Left },
      { portId: "T5/T7", label: "T5/T7", spot: go.Spot.Left },
    ],
    label: "ES3"
  },
  {
    key: 'ES4',
    group: 'Rack 3',
    text: 'ES4',
    ports: [
      { portId: "T1/T3", label: "T1/T3", spot: go.Spot.Left },
    ],
    label: "ES4"
  },
  { key: 'PDU-Rack 3', group: 'Rack 3', text: 'PDU', category: "PDU", ports: PDU_PORTS[2].ports },
  {
    key: 'Outlets Rack 41', label: "Outlets", group: 'Rack 4', text: 'Outlets', isBold: true, category: "InnerOutlet", ports: [
      { portId: "411", label: "411", spot: go.Spot.Right, fromLinkable: true, toLinkable: true },
      { portId: "412", label: "412", spot: go.Spot.Right, fromLinkable: true, toLinkable: true },
      { portId: "413", label: "413", spot: go.Spot.Right, fromLinkable: true, toLinkable: true },
    ]
  },
  {
    key: 'Z-Lift',
    group: 'Rack 4',
    text: 'Z-Lift',
    ports: [
      { portId: "Pwr in", label: "Pwr in", spot: go.Spot.Right },
    ],
    label: "Z-Lift"
  },
  {
    key: 'Analog',
    group: 'Rack 4',
    text: 'Analog Box',
    ports: [
      { portId: "X14", label: "X14", spot: go.Spot.Left },
      { portId: "X1", label: "X1", spot: go.Spot.Right },
    ],
    label: "Analog"
  },
  {
    key: 'Outlets Rack 42', label: "Outlets", group: 'Rack 4', text: 'Outlets', isBold: true, category: "InnerOutlet", ports: [
      { portId: "421", label: "421", spot: go.Spot.Right, fromLinkable: true, toLinkable: true },
      { portId: "422", label: "422", spot: go.Spot.Right, fromLinkable: true, toLinkable: true },
    ]
  },
  {
    key: 'ES4',
    group: 'Rack 3',
    text: 'ES4',
    ports: [
      { portId: "T1/T3", label: "T1/T3", spot: go.Spot.Left },
    ],
    label: "ES4"
  },
  {
    key: 'FCS Rack',
    group: 'Rack 4',
    text: 'FCS Rack',
    ports: [
      { portId: "X2", label: "X2", spot: go.Spot.Left, voltage: "+/-15V" },
      { portId: "X1", label: "X1", spot: go.Spot.Left, voltage: "+24V" },

    ],
    label: "FCS Rack"
  },
  {
    key: 'ES1',
    group: 'Rack 4',
    text: 'ES1-cRIO',
    ports: [
      { portId: "Pwr in", label: "Pwr in", spot: go.Spot.Left },
    ],
    label: "ES1-cRIO"
  },
  {
    key: 'ES2-InterLocks',
    group: 'Rack 4',
    text: 'ES2 – Interlocks',
    isGroup: true,
    category: "Interlocks",
    label: "ES2 – Interlocks",
    numberOfRows: 4,
    numberOfColumns: 1,
  },
  {
    key: 'T10/T11',
    group: 'ES2-InterLocks',
    text: 'T10/T11',
    position: "1st row 1st column",
    ports: [
      { portId: "1", label: "1", spot: go.Spot.Left },
      { portId: "2", label: "2", spot: go.Spot.Bottom },
      { portId: "3", label: "3", spot: go.Spot.Bottom },
    ],
    label: "T10/T11"
  },
  {
    key: 'VALVES 1',
    group: 'ES2-InterLocks',
    text: 'VALVES 1',
    position: "2nd row 2nd column",
    ports: [
      { portId: "X5", label: "X5", spot: go.Spot.Left },
    ],
    label: "VALVES 1"
  },
  {
    key: 'VALVES 2',
    group: 'ES2-InterLocks',
    text: 'VALVES 2',
    position: "3rd row 2nd column",
    ports: [
      { portId: "X5", label: "X5", spot: go.Spot.Left },
    ],
    label: "VALVES 2"
  },
  {
    key: 'T35/T40',
    group: 'ES2-InterLocks',
    text: 'T35/T40',
    position: "4th row 2nd column",
    ports: [
      { portId: "1", label: "1", spot: go.Spot.Right },
    ],
    label: "T35/T40"
  },
  { key: 'PDU-Rack 4', group: 'Rack 4', text: 'ES1 - PDU', category: "PDU", ports: PDU_PORTS[3].ports },
];

// Preprocess Interlocks children to extract row/column from position
nodeDataArray.forEach((node: NodeData) => {
  if (node.group === 'ES2-InterLocks' && typeof node.position === 'string') {
    const rowMatch = node.position.match(/(\d+)[a-z]{2} row/i);
    const colMatch = node.position.match(/(\d+)[a-z]{2} column/i);
    if (rowMatch) node.row = parseInt(rowMatch[1], 10) - 1;
    if (colMatch) node.column = parseInt(colMatch[1], 10) - 1;
  }
});

const linkDataArray = [
  // Rack 1 connections
  {
    from: 'Outlets Rack 1',
    to: 'PDU-Rack 1',
    label: 'ETB-092',
    color: '#1b8ea6',
    fromPort: '13',
    toPort: 'X5',
    group: 'Rack 1'
  },
  {
    from: 'HV-Pwr in',
    to: 'PDU-Rack 1',
    label: 'ETB-094',
    color: '#1b8ea6',
    fromPort: 'Pwr in',
    toPort: 'X9',
    group: 'Rack 1'
  },
  {
    from: 'TMP2-Pwr in',
    to: 'PDU-Rack 1',
    label: 'ETB-093',
    color: '#1b8ea6',
    fromPort: 'Pwr in',
    toPort: 'X7',
    group: 'Rack 1'
  },
  {
    from: 'TMP1-Pwr in',
    to: 'PDU-Rack 1',
    label: 'ETB-091',
    color: '#1b8ea6',
    fromPort: 'Pwr in',
    toPort: 'X4',
    group: 'Rack 1'
  },
  {
    from: 'TMP3-Pwr in',
    to: 'PDU-Rack 1',
    label: 'ETB-221',
    color: '#1b8ea6',
    fromPort: 'Pwr in',
    toPort: 'X3',
    group: 'Rack 1'
  },
  {
    from: 'RF1-Pwr in',
    to: 'PDU-Rack 1',
    label: 'ETB-089',
    color: '#1b8ea6',
    fromPort: 'Pwr in',
    toPort: 'X2',
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
  {
    from: 'APC',  // Changed to use the node key instead of port ID
    to: 'Analog',
    label: 'ETB-072',
    color: '#1b8ea6',
    fromPort: 'Pwr',  // This specifies which port on the node to use
    toPort: 'X14',
    // group: 'Rack 2'
  },
  // Rack 3 connections
  // Rack 4 connections
  {
    from: 'T10/T11',
    to: 'PDU-Rack 4',
    label: 'ETB-123',
    color: 'purple',
    fromPort: '1',
    toPort: 'X3',
    group: 'Rack 4'
  },
  {
    from: 'FCS Rack',
    to: 'PDU-Rack 4',
    label: 'ETB-124',
    color: 'purple',
    fromPort: 'X1',
    toPort: 'X4',
    group: 'Rack 4'
  },
  {
    from: 'ES1',
    to: 'PDU-Rack 4',
    label: 'ETB-122',
    color: 'purple',
    fromPort: 'Pwr in',
    toPort: 'X2',
    group: 'Rack 4'
  },
  {
    from: 'T10/T11',
    to: 'VALVES 2',
    label: 'ETB-127',
    color: 'purple',
    fromPort: '2',
    toPort: 'X5',
    group: 'ES2-InterLocks'
  },
  {
    from: 'T10/T11',
    to: 'VALVES 1',
    label: 'ETB-126',
    color: 'purple',
    fromPort: '3',
    toPort: 'X5',
    group: 'ES2-InterLocks'
  },
  {
    from: 'Outlets Rack 42',
    to: 'PDU-Rack 4',
    label: 'ETB-144',
    color: 'purple',
    fromPort: '422',
    toPort: 'X1',
    group: 'Rack 4'
  },
  //other connections
  {
    from: 'T35/T40',
    to: 'GAS Box 1',
    label: 'ETB-143',
    color: 'purple',
    fromPort: '1',
    toPort: '2',
  }
];

export default function BasicSchematic() {
  const diagramRef = useRef<HTMLDivElement>(null);
  function assignCurvinessToLinks(links: any[]) {
    const linkMap = new Map<string, number>();
    links.forEach(link => {
      const key = `${link.from}->${link.to}`;
      const revKey = `${link.to}->${link.from}`;

      const count = linkMap.get(key) || 0;
      link.curviness = 50 * (count + 1); // Increased curviness value

      linkMap.set(key, count + 1);
      linkMap.set(revKey, count + 1);
    });
  }

  useEffect(() => {
    const $ = go.GraphObject.make;

    if (!diagramRef.current) return;
    // 1) Create your Diagram
    const diagram: go.Diagram = $(go.Diagram, diagramRef.current, {
      'undoManager.isEnabled': true,
      // ... existing code ...
      // layout: $(go.LayeredDigraphLayout, {
      //   direction: 90,
      //   layerSpacing: 0,  // Increased spacing between layers
      //   columnSpacing: 100,
      //   setsPortSpots: false,
      //   aggressiveOption: go.LayeredDigraphLayout.AggressiveMore,
      //   // layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource,
      //   // initializeOption: go.LayeredDigraphLayout.InitDepthFirstOut,
      //   // cycleRemoveOption: go.LayeredDigraphLayout.CycleDepthFirst,
      //   // packOption: go.LayeredDigraphLayout.PackStraighten
      // }),
      // ... existing code ...
      // layout: $(go.Layout ),
      layout: $(go.GridLayout, {
        wrappingColumn: 5,
        spacing: new go.Size(10, 100),
      }),
      initialContentAlignment: go.Spot.Center,
      allowZoom: true,
      allowMove: true,
    });

    // 2) Register your AvoidsLinksRouter with the Diagram's routers collection
    diagram.routers.add(new AvoidsLinksRouter({
      linkSpacing: 10,  // Keep this at 4 for basic spacing
      // ignoreContainingGroups: true,  // Add this to control spacing between groups
    }));
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
      // Add BOTTOM ports panel
      $(go.Panel, "Table",
        {
          alignment: go.Spot.Bottom,
          alignmentFocus: go.Spot.Bottom,
          margin: new go.Margin(0, 0, 0, 0),
          itemTemplate: $(go.Panel, "Vertical",
            new go.Binding("column", "column"),
            $(go.TextBlock,
              {
                margin: new go.Margin(0, 0, 4, 0),
                font: "10pt sans-serif",
                alignment: go.Spot.Center
              },
              new go.Binding("text", "label"),
              new go.Binding("visible", "spot", s => s === go.Spot.Bottom)
            ),
            $(go.Shape, "Circle",
              {
                fromSpot: go.Spot.Bottom,
                toSpot: go.Spot.Bottom,
                fill: "black",
                stroke: null,
                desiredSize: new go.Size(8, 8),
                fromLinkable: true,
                toLinkable: true
              },
              new go.Binding("portId", "portId"),
              new go.Binding("visible", "spot", s => s === go.Spot.Bottom)
            )
          )
        },
        new go.Binding("itemArray", "ports", ports =>
          ports.filter((p: any) => p.spot === go.Spot.Bottom)
            .map((p: any, idx: number) => ({ ...p, column: idx }))
        )
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
      "Vertical",
      {
        layout: $(go.GridLayout, {
          wrappingColumn: 1,
          spacing: new go.Size(10, 0),
        }),
        isSubGraphExpanded: true,
        selectable: true,
        computesBoundsAfterDrag: true,
        handlesDragDropForMembers: true,
      },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.TextBlock, { font: 'bold 12pt sans-serif', margin: 4 }, new go.Binding('text', 'key')),
      $(go.Panel, 'Auto',
        $(go.Shape, { fill: null, stroke: '#999', strokeWidth: 1, strokeDashArray: [4, 2] }),
        $(go.Placeholder, { padding: 20 })
      )
    );

    // Link template
    diagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        corner: 20,
        fromEndSegmentLength: 80,  // Increased from 60
        toEndSegmentLength: 80,    // Increased from 60
        curviness: 200,    // Increased from 150
        segmentOffset: new go.Point(30, 30),  // Increased from 20,20
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true,
        adjusting: go.Link.End,
        fromShortLength: 4,
        toShortLength: 4,
        layerName: "Background"
      },
      $(go.Shape, {
        stroke: "#357",
        strokeWidth: 2,
        segmentOffset: new go.Point(10, 10)
      },
        new go.Binding("stroke", "color")
      ),
      new go.Binding("curviness", "curviness"),
      new go.Binding("fromSpot", "fromSpot", go.Spot.parse).makeTwoWay(go.Spot.stringify),
      new go.Binding("toSpot", "toSpot", go.Spot.parse).makeTwoWay(go.Spot.stringify),
      $(go.Shape, { toArrow: "Standard", fill: "#357" },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color")
      ),
      $(go.TextBlock,
        { segmentOffset: new go.Point(0, -10) },
        new go.Binding("text", "label")
      )
    );


    // Inner Outlet node template
    diagram.nodeTemplateMap.add("InnerOutlet",
      $(go.Node, "Auto",
        {
          width: 180,
          minSize: new go.Size(180, NaN),
          maxSize: new go.Size(NaN, NaN),
          margin: new go.Margin(0, 0, 10, 0)
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
        { width: 180, height: 180, margin: new go.Margin(0, 0, 10, 0) },
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
    diagram.groupTemplateMap.add("Interlocks",
      $(go.Group, "Vertical",
        {
          isSubGraphExpanded: true,
          selectable: true,
          computesBoundsAfterDrag: true,
          handlesDragDropForMembers: true,
          minSize: new go.Size(200, NaN),
          maxSize: new go.Size(NaN, NaN),
          margin: 10
        },
        // Dynamically set layout based on "layout" or "numberOfRows"
        new go.Binding("layout", "", function (data) {
          // Prefer layout string like "2X4" or "4x4"
          if (typeof data.layout === "string" && data.layout.match(/^\d+[xX]\d+$/)) {
            const [cols] = data.layout.split(/[xX]/).map(Number);
            return $(go.GridLayout, {
              wrappingColumn: cols,
              spacing: new go.Size(10, 10)
            });
          }
          // Fallback to numberOfColumns if present
          if (typeof data.numberOfColumns === "number" && data.numberOfColumns > 0) {
            return $(go.GridLayout, {
              wrappingColumn: data.numberOfColumns,
              spacing: new go.Size(10, 10)
            });
          }

          // Default layout
          return $(go.GridLayout, {
            wrappingColumn: 1,
            spacing: new go.Size(10, 10)
          });
        }),
        $(go.TextBlock, { font: 'italic bold 12pt sans-serif', margin: 4 }, new go.Binding('text', 'text')),
        $(go.Panel, 'Auto',
          $(go.Shape, { fill: null, stroke: '#999', strokeWidth: 1, strokeDashArray: [4, 2] }),
          $(go.Placeholder, { padding: 20 })
        )
      )
    );
    diagram.nodeTemplateMap.add("normalParent",
      $(go.Node, "Auto",
        { height: 60, minSize: new go.Size(300, 100), maxSize: new go.Size(300, 100) },
        $(go.Shape, "Rectangle",
          { fill: "white", stroke: "#1E88E5", strokeWidth: 2 }
        ),
        $(go.Panel, "Vertical",
          { alignment: go.Spot.Center },
          $(go.TextBlock,
            { font: "bold 12pt sans-serif", margin: new go.Margin(4, 8), alignment: go.Spot.Center },
            new go.Binding("text", "label")
          ),
          $(go.TextBlock,
            { font: "italic 10pt sans-serif", margin: new go.Margin(0, 8, 4, 8), alignment: go.Spot.Center },
            new go.Binding("text", "description")
          )
        ),
        // LEFT ports with labels
        $(go.Panel, "Table",
          {
            alignment: go.Spot.Left,
            alignmentFocus: go.Spot.Left,
            margin: new go.Margin(0, 0, 0, 4),
            itemTemplate: $(go.Panel, "Horizontal",
              new go.Binding("row", "row"),
              $(go.Shape, "Circle",
                {
                  width: 8, height: 8,
                  fill: "black",
                  fromSpot: go.Spot.Left,
                  toSpot: go.Spot.Left
                },
                new go.Binding("portId", "portId"),
                new go.Binding("visible", "spot", s => s === go.Spot.Left)
              ),
              $(go.TextBlock,  // Added label
                {
                  margin: new go.Margin(0, 0, 0, 4),
                  font: "10pt sans-serif"
                },
                new go.Binding("text", "label"),
                new go.Binding("visible", "spot", s => s === go.Spot.Left)
              )
            )
          },
          new go.Binding("itemArray", "ports", ports =>
            ports.filter((p: any) => p.spot === go.Spot.Left)
              .map((p: any, idx: number) => ({ ...p, row: idx }))
          )
        ),
        // RIGHT ports with labels
        $(go.Panel, "Table",
          {
            alignment: go.Spot.Right,
            alignmentFocus: go.Spot.Right,
            margin: new go.Margin(0, 4, 0, 0),
            itemTemplate: $(go.Panel, "Horizontal",
              new go.Binding("row", "row"),
              $(go.TextBlock,  // Added label
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
                  width: 8, height: 8,
                  fill: "black",
                  fromSpot: go.Spot.Right,
                  toSpot: go.Spot.Right
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
    assignCurvinessToLinks(linkDataArray);
    diagram.model = new go.GraphLinksModel(
      nodeDataArray,
      linkDataArray
    );

    // Tell GoJS which properties to use for port-to-port linking
    (diagram.model as go.GraphLinksModel).linkFromPortIdProperty = "fromPort";
    (diagram.model as go.GraphLinksModel).linkToPortIdProperty = "toPort";
    return () => (diagram as any).dispose();
  }, []);

  return <div ref={diagramRef} style={{ width: '100%', height: '600px', border: '1px solid #ccc' }} />;
}