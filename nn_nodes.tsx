import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Editor, Node, Config, MenuItem } from 'react-flow-editor';
import { Connection } from 'react-flow-editor/dist/types';


/* WIDGES */
var inputSlider = <input style={{ width: '80px' }} 
    type="range" min="1" max="100" className="slider" />


const inputFactory = (connections?: { input: (Connection | Connection[])[] }) => ({
    name: 'Input',
    id: 'Node_1',
    type: 'node-type-1',
    payload: { h1: 'test' },
    inputs: [{
        connection: connections ? connections.input[0] : [],
        name: 'input 1',
        renderer: () => inputSlider
    }],
    outputs: []
});
export {inputFactory}


const denseFactory = (connections?: { input: (Connection | Connection[])[], output: (Connection | Connection[])[] }) => ({
    name: 'Dense',
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
export {denseFactory}


const reluFactory = (connections?: { input: (Connection | Connection[])[] }) => ({
    name: 'Relu',
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
export {reluFactory}
