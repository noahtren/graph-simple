import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Editor, Node, Config, MenuItem } from 'react-flow-editor';
import { Connection } from 'react-flow-editor/dist/types';

import {inputFactory, denseFactory, reluFactory} from './nn_nodes';

require('./simple.scss');

type LogProps = { subscribe: (update: (log: string) => void) => void };
type LogState = { content: string };

class Log extends React.Component<LogProps, LogState> {
    constructor(props: LogProps) {
        super(props);
        this.state = { content: '' };
        props.subscribe(this.update.bind(this));
    }

    private update(log: string) {
        this.setState({ content: log });
    }

    render() {
        return (
            <div className="log" >
                <p >{this.state.content}</p>
            </div>
        );
    }
}

const node1Factory = (connections?: { input: (Connection | Connection[])[] }) => ({
    name: 'Node 1',
    id: 'Node_1',
    type: 'node-type-1',
    payload: { h1: 'hello' },
    inputs: [{
        connection: connections ? connections.input[0] : [],
        name: 'input 1',
        renderer: () => <input style={{ width: '80px' }} type="range" min="1" max="100" className="slider" />
    }],
    outputs: []
});

const node2Factory = (connections?: { input: (Connection | Connection[])[], output: (Connection | Connection[])[] }) => ({
    name: 'Node 2',
    id: 'Node_2',
    type: 'node-type-2',
    payload: { h1: 'world' },
    inputs: [
        { connection: connections ? connections.input[0] : [], name: 'input 1' },
        { connection: connections ? connections.input[1] : [], name: 'input 2' },
        { connection: connections ? connections.input[2] : [], name: 'input 3' }
    ],
    outputs: [
        { connection: connections ? connections.output[0] : [], name: 'output 1' },
        { connection: connections ? connections.output[1] : [], name: 'output 2' },
        { connection: connections ? connections.output[2] : [], name: 'output 3' }
    ]
});

const node3Factory = (connections?: { output: (Connection | Connection[])[] }) => ({
    name: 'Node 3',
    id: 'Node_3',
    type: 'node-type-3',
    payload: { h1: '!' },
    inputs: [],
    outputs: [{ connection: connections ? connections.output[0] : [], name: 'output 1' }]
});

const nodes: Node[] = [
    {
        ...node1Factory({
            input: [[{ nodeId: 'Node_2', port: 0 }]]
        }), id: 'Node_1'
    },
    {
        ...node2Factory({
            input: [[{ nodeId: 'Node_3', port: 0 }]],
            output: [{ nodeId: 'Node_1', port: 0 }]
        }), id: 'Node_2'
    },
    {
        ...node3Factory({
            output: [[{ nodeId: 'Node_2', port: 0 }]]
        }), id: 'Node_3'
    }
];

function resolver(node: Node): JSX.Element {
    if (node.payload.type === '') return <h2 />;
    return (
        <p style={{ height: '100px', width: '60px' }}>{node.payload.h1}</p>
    );
}

let log: (log: string) => void = undefined;
const onChanged: Config['onChanged'] = data => {
    if (log === undefined) return;
    if (data.type === 'ConnectionRemoved')
        log(`Connection '${data.id}' was removed.`);
    else if (data.type === 'NodeRemoved')
        log(`Node '${data.id}' was removed.`);
    else if (data.type === 'NodeCreated')
        log(`Node '${data.node.id}' was created.`);
    else if (data.type === 'ConnectionCreated')
        log(`New connection between nodes '${data.input.nodeId}' [${data.input.port}]  and '${data.output.nodeId}' [${data.output.port}] created.`);
    else if (data.type === 'NodeCollapseChanged')
        log(`Collapse state of Node '${data.id}' is now ${data.shouldBeCollapsed}.`);
};

const config: Config = {
    resolver,
    connectionType: 'bezier',
    onChanged,
    grid: true,
    demoMode: true,
    direction: 'we'
};



ReactDOM.render(
    <div>
        <div className="flow-menu">
            <MenuItem name="Input Layer" factory={inputFactory} />
            <MenuItem name="Dense Layer" factory={denseFactory} />
            <MenuItem name="ReLU Activation" factory={reluFactory} />
        </div>
        <Log subscribe={update => log = update} />
        <Editor config={config} nodes={nodes} />
    </div>,
    document.getElementById('root')
);
