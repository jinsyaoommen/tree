import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import * as R from 'ramda';

import "./styles.css";
import sampleData from './sample/data';

function App() {
    function renderNodes(data = [], depth = 0) {
        let childNodes;

        if (R.isEmpty(data)) {
            return null;
        }

        return data.map(item => {
            // Only render child nodes if the parent node is clicked.
            const childList = R.propOr([], "childList", item);

            // const selectedNode = !R.isEmpty(childList) && toggledNodes[item.id];

            childNodes = !R.isEmpty(childList) ? renderNodes(childList, depth + 1) : null;

            // const nodeIcon = toggledNodes[item.id] ? <IconDown /> : <IconRight />;

            // const hasChildren = !R.isEmpty(childList);


            return (
                <Fragment key={item.id}>
                    <div style={{paddingLeft:`${(depth * 20)}px`}}>
                      {item.caption}
                    </div>
                    {childNodes}
                </Fragment>
            );
        });
    }


    return (
        <div className="App">
            {renderNodes(sampleData)}
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
