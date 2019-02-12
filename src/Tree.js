import React, { Fragment, useState } from "react";
import styled from "styled-components";
import * as R from "ramda";

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons'

import { colors } from "./Theme";
import CheckboxInput from "./CheckboxInput";
import getAllChildNodes from "./util/getAllChildNodes";

library.add(faCaretRight);
library.add(faCaretDown);

const TreeWrapper = styled.div`
  font-family: Roboto, sans-serif;
  border: 1px solid ${colors.whiteSmoke.medium};
  max-height: 300px;
  overflow: auto;
  background-color: ${colors.white.medium};
  position: absolute;
  z-index: 100;
  width: 50%;
  top: auto;
`;

const TreeNodeWrapper = styled.div`
  padding: 5px 15px 5px 20px;
  white-space: nowrap;
  //height: 30px;
  cursor: pointer;
  background-color: ${props => {
    if (props.depth === 0) {
        return colors.whiteSmoke.light;
    }
    return colors.white.medium;
}};
  border-bottom: 1px solid ${colors.whiteSmoke.medium};
  &:hover {
    background-clip: padding-box;
    background-color: ${props => {
    if (props.depth === 0) {
        return colors.white.medium;
    }
    return colors.whiteSmoke.light;
}};
  }
`;

const ContentWrapper = styled.div`
  padding-left: ${props => {
        const offset = props.hasChildren ? 0 : 20;
        return `${20 * props.depth + offset}px`;
    }};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-weight: 400;
  font-size: 14px;
  color: ${colors.black.dark};
  i {
    padding-right: 20px;
  }
`;

const SelectAllWrapper = styled.div`
  padding: 5px 15px 5px 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-weight: 400;
  font-size: 14px;
  color: ${colors.black.dark};
  background-color: ${colors.whiteSmoke.light};
  border-bottom: 1px solid ${colors.whiteSmoke.medium};
  &:hover {
    background-clip: padding-box;
    background-color: ${colors.white.medium};
  }
`;

const CaptionWrapper = styled.div`
  flex-basis: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
`;

const Tree = (props) => {
    const [selectedNodes, updateSelectedNodes] = useState({});
    const [toggle, setToggleState] = useState({});

    function toggleState(id, stateHash) {
        const updatedState = {
            [stateHash]: {
                ...toggle[stateHash],
                ...{ [id]: !R.pathOr(false, [stateHash, id], toggle) }
            }
        };

        return setToggleState(updatedState);
    }

    function updateCheckbox(checkedItem) {
        return (data, item, selectAll) => {
            const allChildNodes = getAllChildNodes(data, item, selectAll);

            updateSelectedNodes(
                checkedItem.target.checked
                    ? { ...selectedNodes, ...{ [item.id]: item }, ...allChildNodes }
                    : R.omit([item.id, ...R.keys(allChildNodes)], selectedNodes)
            );
        };
    }

    function renderNodes(data = [], depth = 0) {
        let childNodes;

        if (R.isEmpty(data)) {
            return null;
        }

        return data.map(item => {
            const childList = R.propOr([], "childList", item);
            const toggledNodeState = R.pathOr(false, ["toggledNodes", item.id], toggle);

            const selectedNode = !R.isEmpty(childList) && toggledNodeState;

            childNodes = selectedNode ? renderNodes(childList, depth + 1) : null;

            const hasChildren = !R.isEmpty(childList);

            const checkbox = (
                <CheckboxInput
                    id={item.id}
                    isChecked={R.has(item.id, selectedNodes)}
                    isIndeterminate={false}
                    onChange={(checkedItem) => updateCheckbox(checkedItem)(data, item)}
                />
            );

            const nodeIcon = toggledNodeState
                ? <FontAwesomeIcon icon="caret-down" style={{paddingRight: '15px'}} />
                : <FontAwesomeIcon icon="caret-right" style={{paddingRight: '15px'}} />;

            return (
                <Fragment key={item.id}>
                    <TreeNodeWrapper depth={depth}>
                        <ContentWrapper depth={depth} hasChildren={hasChildren}>
                            <CaptionWrapper onClick={() => toggleState(item.id, "toggledNodes")}>
                                {hasChildren ? nodeIcon : null}{item.caption}
                            </CaptionWrapper>
                            <div>{checkbox}</div>
                        </ContentWrapper>
                    </TreeNodeWrapper>
                    {childNodes}
                </Fragment>
            );
        });
    }

    return (
        <Fragment>
            <TreeWrapper>
                <SelectAllWrapper>
                    Select All
                    <CheckboxInput
                        id="selectAll"
                        isIndeterminate={false}
                        onChange={(checkedItem) => updateCheckbox(checkedItem)(props.data, {}, true)}
                    />
                </SelectAllWrapper>

                {renderNodes(props.data)}
            </TreeWrapper>
        </Fragment>
    );
};

export default Tree;
