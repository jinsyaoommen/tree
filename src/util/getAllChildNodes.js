import * as R from "ramda";

/**
 * Given a predicate node, find all the child nodes.
 * @param treeData - [ { id: foo, childList: [{ id: bar }, { id: bloop }] } ]
 * @param selectedNode - { id: bar }
 */
export default function getAllChildNodes(treeData, selectedNode) {
    if (R.isNil(treeData) || R.isEmpty(treeData)) {
        return {};
    }

    if (R.isNil(selectedNode) || R.isEmpty(selectedNode)) {
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

    return R.has("childList", selectedNode) ? traverseTree(selectedNode.childList) : allNodes;
}
