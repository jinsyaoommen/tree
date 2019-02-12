import * as R from "ramda";

/**
 * Given a predicate node, find all the child nodes.
 * @param treeData - [ { id: foo, childList: [{ id: bar }, { id: bloop }] } ]
 * @param selectedNode - { id: bar }
 * @param selectAll - bool
 */
export default function getAllChildNodes(treeData, selectedNode, selectAll=false) {
    if (R.isNil(treeData) || R.isEmpty(treeData)) {
        return {};
    }

    if ((R.isNil(selectedNode) || R.isEmpty(selectedNode)) && !selectAll) {
        return {};
    }

    let allNodes = {};

    function traverseTree(tree) {
        for (let i = 0; i < tree.length; i += 1) {
            allNodes = { ...allNodes, ...{ [tree[i].id]: tree[i] } };

            if (R.has("childList", tree[i])) {
                traverseTree(tree[i].childList);
            }
        }
        return allNodes;
    }

    if (selectAll) {
        return traverseTree(treeData);
    }

    return R.has("childList", selectedNode) ? traverseTree(selectedNode.childList) : allNodes;
}
