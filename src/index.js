import React from "react";
import ReactDOM from "react-dom";

import Tree from "./Tree";
import sampleData from './sample/tree-data';
import "./styles.css";

const rootElement = document.getElementById("root");

ReactDOM.render(
    <Tree data={sampleData}/>,
    rootElement
);
