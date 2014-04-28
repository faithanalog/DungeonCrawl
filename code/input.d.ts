declare class Input {
    constructor(elem: Element);
    elem: Element;
    keys: boolean[];
    isKeyDown(key: number): boolean;
    isCharDown(char: string): boolean;
}
