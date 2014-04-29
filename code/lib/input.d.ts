declare class Input {
    constructor(elem: Element);
    elem: Element;
    keys: boolean[];
    isKeyDown(key: number): boolean;
    isCharDown(char: string): boolean;
    
    onkeydown(evt: KeyboardEvent): void;
    onkeyup(evt: KeyboardEvent): void;
    onmousedown(evt: MouseEvent): void;
    onmouseup(evt: MouseEvent): void;
}
