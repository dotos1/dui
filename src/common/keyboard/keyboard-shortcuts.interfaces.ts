
export interface Shortcut {


    key: string | string[];


    command(event: ShortcutEventOutput): any;

    description?: string;

    throttleTime?: number;

    label?: string;
    
    preventDefault?: boolean;
}

/**
 * The shortcut input type for ng-keyboard-shortcuts component
 */
export interface ShortcutInput extends Shortcut {
    /**
     * textarea, select and input are ignored by default, this is used to override
     * this behavior.
     * allow in node names, accepts: ["TEXTAREA", "SELECT", "INPUT", "CONTENTEDITABLE"]
     */
    allowIn?: AllowIn[];
    /**
     * Only trigger the command when the target is in focus.
     */
    target?: HTMLElement;
}

export enum AllowIn {
    Textarea = 'TEXTAREA',
    Input = 'INPUT',
    Select = 'SELECT',
    ContentEditable = "CONTENT-EDITABLE"
}

export interface ParsedShortcut extends ShortcutInput {
    key: string[];
    predicates: Function[][];
    id: string;
    priority?: number;
    fullMatch?: boolean;
    partialMatch?: boolean;
    isSequence: boolean;
    sequence?: string[][];
    event?: KeyboardEvent;
}

/**
 * The output type fired by the command when shortcut is triggered.
 */
export interface ShortcutEventOutput {
    /**
     * The browser keyboard event
     */
    event: KeyboardEvent;
    /**
     * The registered key that was triggered
     */
    key: string[] | string;
}
