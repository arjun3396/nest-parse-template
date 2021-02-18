declare interface TypeNode {
    nodeName: string;
    fieldName: string;
    questionId: string;
    class: string;
    table: string;
    redirect: {
        [key: string]: string,
        _default?: string;
    };
}

declare interface TypeTree {
    [key: string]: TypeNode;
}

export { TypeNode, TypeTree };
