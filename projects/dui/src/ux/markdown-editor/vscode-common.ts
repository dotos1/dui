import {Range} from "./extHostTypes";

export interface TextLine {

    readonly lineNumber: number;


    readonly text: string;

 
    readonly range: Range;


    readonly rangeIncludingLineBreak: Range;


    readonly firstNonWhitespaceCharacterIndex: number;


    readonly isEmptyOrWhitespace: boolean;
}
