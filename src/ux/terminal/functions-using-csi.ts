/**
 *
 * It is a CSI sequences generator
 * https://invisible-island.net/xterm/ctlseqs/ctlseqs.html#h2-Functions-using-CSI-_-ordered-by-the-final-character_s_

 * @zh 常量/变量 `CSI`，定义 `src/ux/terminal` 中的CSI。
 */
let CSI = '\x9b'
/**
 * Class `FunctionsUsingCSI` encapsulating functions using csi data structures and logic in `src/ux/terminal`.
 * @zh 类 `FunctionsUsingCSI`，封装 `src/ux/terminal` 中的函数使用CSI数据结构与处理逻辑。
 */
export class FunctionsUsingCSI {
    /**
     *  CSI Ps @  Insert Ps (Blank) Character(s) (default = 1) (ICH). 
     * 
     *
     * @zh 执行 `insertBlank`，用于插入Blank。
     */
    static insertBlank(count: number){
        return `${CSI}${count}@`; 
    }
    /**
     *  CSI Ps SP @ */
    /**
     *  CSI Ps A  Cursor Up Ps Times (default = 1) (CUU). 
     * \x9b3A
     * @zh 执行 `cursorUp`，用于光标向上。
     */
    static cursorUp(count: number){
        return `${CSI}${count}A`;
    }
    /**
     *  CSI Ps SP A */
    /**
     *  CSI Ps B  Cursor Down Ps Times (default = 1) (CUD).
     * \x9b3B
     * @zh 执行 `cursorDown`，用于光标向下。
     */
    static cursorDown(count: number){
        return `${CSI}${count}B`;
    }
    /**
     *  CSI Ps C  Cursor Forward Ps Times (default = 1) (CUF). 
     * \x9b3C
     * @zh 执行 `cursorForward`，用于光标向前。
     */
    static cursorForward(count: number){
        return `${CSI}${count}C`;
    }
    /**
     *  CSI Ps D  Cursor Backward Ps Times (default = 1) (CUB). 
     * \x9b3D
     * @zh 执行 `cursorBackward`，用于光标向后。
     */
    static cursorBackward(count: number){
        return `${CSI}${count}D`;
    }
    /**
     *  CSI Ps E  Cursor Next Line Ps Times (default = 1) (CNL). 
     * \x9b3E
     *
     * @zh 执行 `cursorNextLine`，用于光标下一个线段。
     */
    static cursorNextLine(count: number){
        return `${CSI}${count}E`;
    }
    /**
     *  CSI Ps F  Cursor Preceding Line Ps Times (default = 1) (CPL).
     * \x9b3F
     *
     * @zh 执行 `cursorPrecedingLine`，用于光标Preceding线段。
     */
    static cursorPrecedingLine(count: number){
        return `${CSI}${count}F`;
    }
    /**
     *  CSI Ps G  Cursor Character Absolute  [column] (default = [row,1]) (CHA).
     *  \x9b9G
     *
     * @zh 执行 `cursorColumn`，用于光标列。
     */
    static cursorColumn(count: number){
        return `${CSI}${count}G`;
    }
    /**
     *  CSI Ps ; Ps H  Cursor Position [row;column] (default = [1,1]) (CUP).
     * \x9b2;2H
     *
     * @zh 执行 `cursorPosition`，用于光标位置。
     */
    static cursorPosition(row: number, col: number){
        return `${CSI}${row};${col}H`;
    }
    /**
     *  CSI Ps I  Cursor Forward Tabulation Ps tab stops (default = 1) (CHT). */
    /**
     *  CSI Ps J  Erase in Display (ED), VT100.
     *      Ps = 0  -> Erase Below (default).
     *      Ps = 1  -> Erase Above.
     *      Ps = 2  -> Erase All.
     *      Ps = 3  -> Erase Saved Lines (xterm).
     * \x9b2J
     *
     * @zh 执行 `eraseInDisplay`，用于erase在Display。
     */
    static eraseInDisplay(category: KindOfEraseInDisplay){
        return `${CSI}${category}J`;
    }

    /**
     *  CSI ? Ps J
     *  Erase in Display (DECSED), VT220.
     *    Ps = 0  -> Selective Erase Below (default).
     *    Ps = 1  -> Selective Erase Above.
     *    Ps = 2  -> Selective Erase All.
     *    Ps = 3  -> Selective Erase Saved Lines (xterm).
     * \x9b?2J 
     *
     * @zh 执行 `eraseSelectiveThingsInDisplay`，用于eraseSelectiveThings在Display。
     */
    static eraseSelectiveThingsInDisplay(category: KindOfEraseInDisplay){
        return `${CSI}?${category}J`;
    }
    /**
     *  CSI Ps K  
     *   Erase in Line (EL), VT100.
     *     Ps = 0  -> Erase to Right (default).
     *     Ps = 1  -> Erase to Left.
     *     Ps = 2  -> Erase All.
     * \x9b?1K
     *
     * @zh 执行 `eraseInLine`，用于erase在线段。
     */
    static eraseInLine(category: KindOfEraseInLine){
        return `${CSI}${category}K`;
    }
    /**
     *  CSI ? Ps K 
     *    Erase in Line (DECSEL), VT220.
     *      Ps = 0  -> Selective Erase to Right (default).
     *      Ps = 1  -> Selective Erase to Left.
     *      Ps = 2  -> Selective Erase All.
     * \x9b?1K
     *
     * @zh 执行 `eraseSelectiveThingsInLine`，用于eraseSelectiveThings在线段。
     */
    static eraseSelectiveThingsInLine(category: KindOfEraseInLine){
        return `${CSI}?${category}K`;
    }
    /**
     *  CSI Ps L  Insert Ps Line(s) (default = 1) (IL).
     * \x9b2L
     *
     * @zh 执行 `insertLines`，用于插入线段。
     */
    static insertLines(count: number){
        return `${CSI}${count}L`;
    }
    /**
     *  CSI Ps M  Delete Ps Line(s) (default = 1) (DL).
     * \x9b2M
     *
     * @zh 执行 `deleteLines`，用于删除线段。
     */
    static deleteLines(count: number){
        return `${CSI}${count}M`;
    }
    /**
     *  CSI Ps P  Delete Ps Character(s) (default = 1) (DCH).
     * \x9b2P
     *
     * @zh 执行 `deleteCharacter`，用于删除字符。
     */
    static deleteCharacter(count: number){
        return `${CSI}${count}P`;
    }
    /**
     *  CSI Ps S  Scroll up Ps lines (default = 1) (SU), VT420, ECMA-48.
     * \x9b2S
     *
     * @zh 执行 `scrollUpLines`，用于滚动向上线段。
     */
    static scrollUpLines(count: number){
        return `${CSI}${count}S`;
    }
    /**
     *  CSI ? Pi ; Pa ; Pv S */
    /**
     *  CSI Ps T  Scroll down Ps lines (default = 1) (SD), VT420. 
     * \x9b2T
     *
     * @zh 执行 `scrollDownLines`，用于滚动向下线段。
     */
    static scrollDownLines(count: number){
        return `${CSI}${count}T`;
    }
    /**
     *  CSI Ps ; Ps ; Ps ; Ps ; Ps T */
    /**
     *  CSI > Ps ; Ps T */
    /**
     *  CSI Ps X  Erase Ps Character(s) (default = 1) (ECH).
     * \x9b2X
     *
     * @zh 执行 `eraseCharacters`，用于erase字符。
     */
    static eraseCharacters(count: number){
        return `${CSI}${count}X`;
    }
    /**
     *  CSI Ps Z  Cursor Backward Tabulation Ps tab stops (default = 1) (CBT). */
    /**
     *  CSI Ps ^  Scroll down Ps lines (default = 1) (SD), ECMA-48. */
    /**
     *  CSI Pm `  Character Position Absolute  [column] (default = [row,1]) */
    /**
     *  CSI Pm a  Character Position Relative  [columns] (default = [row,col+1]) */
    /**
     *  CSI Ps b  Repeat the preceding graphic character Ps times (REP). */
    /**
     *  CSI Ps c  Send Device Attributes (Primary DA). */
    /**
     *  CSI = Ps c */
    /**
     *  CSI > Ps c */
    /**
     *  CSI Pm d  Line Position Absolute  [row] (default = [1,column]) (VPA). */
    /**
     *  CSI Pm e  Line Position Relative  [rows] (default = [row+1,column]) */
    /**
     *  CSI Ps ; Ps f */
    /**
     *  CSI Ps g  Tab Clear (TBC). */
    /**
     *  CSI Pm h  Set Mode (SM). */
    /**
     *  CSI ? Pm h */
    /**
     *  CSI Pm i  Media Copy (MC). */
    /**
     *  CSI ? Pm i */
    /**
     *  CSI Pm l  Reset Mode (RM). */
    /**
     *  CSI ? Pm l */
    /**
     *  CSI Pm m  Character Attributes (SGR). */
    /**
     *  CSI > Ps ; Ps m */
    /**
     *  CSI Ps n  Device Status Report (DSR). */
    /**
     *  CSI > Ps n */
    /**
     *  CSI ? Ps n */
    /**
     *  CSI > Ps p */
    /**
     *  CSI ! p   Soft terminal reset (DECSTR), VT220 and up. */
    /**
     *  CSI Ps ; Ps " p */
    /**
     *  CSI Ps $ p */
    /**
     *  CSI ? Ps $ p */
    /**
     *  CSI # p */
    /**
     *  CSI Ps ; Ps # p */
    /**
     *  CSI Ps q  Load LEDs (DECLL), VT100. */
    /**
     *  CSI Ps SP q */
    /**
     *  CSI Ps " q */
    /**
     *  CSI # q   Pop video attributes from stack (XTPOPSGR), xterm.  This is an */
    /**
     *  CSI Ps ; Ps r */
    /**
     *  CSI ? Pm r */
    /**
     *  CSI Pt ; Pl ; Pb ; Pr ; Ps $ r */
    /**
     *  CSI s     Save cursor, available only when DECLRMM is disabled (SCOSC, */
    /**
     *  CSI Pl ; Pr s */
    /**
     *  CSI ? Pm s */
    /**
     *  CSI Ps ; Ps ; Ps t */
    /**
     *  CSI > Ps ; Ps t */
    /**
     *  CSI Ps SP t */
    /**
     *  CSI Pt ; Pl ; Pb ; Pr ; Ps $ t */
    /**
     *  CSI u     Restore cursor (SCORC, also ANSI.SYS). */
    /**
     *  CSI Ps SP u */
    /**
     *  CSI Pt ; Pl ; Pb ; Pr ; Pp ; Pt ; Pl ; Pp $ v */
    /**
     *  CSI Ps $ w */
    /**
     *  CSI Pt ; Pl ; Pb ; Pr ' w */
    /**
     *  CSI Ps x  Request Terminal Parameters (DECREQTPARM). */
    /**
     *  CSI Ps * x */
    /**
     *  CSI Pc ; Pt ; Pl ; Pb ; Pr $ x */
    /**
     *  CSI Ps # y */
    /**
     *  CSI Pi ; Pg ; Pt ; Pl ; Pb ; Pr * y */
    /**
     *  CSI Ps ; Pu ' z */
    /**
     *  CSI Pt ; Pl ; Pb ; Pr $ z */
    /**
     *  CSI Pm ' { */
    /**
     *  CSI # { */
    /**
     *  CSI Ps ; Ps # { */
    /**
     *  CSI Pt ; Pl ; Pb ; Pr $ { */
    /**
     *  CSI Pt ; Pl ; Pb ; Pr # | */
    /**
     *  CSI Ps $ | */
    /**
     *  CSI Ps ' | */
    /**
     *  CSI Ps * | */
    /**
     *  CSI # }   Pop video attributes from stack (XTPOPSGR), xterm.  Popping */
    /**
     *  CSI Pm ' } */
    /**
     *  CSI Pm ' ~ */
}
/**
 * Enumeration `KindOfEraseInDisplay` defining supported kind of erase in display constants.
 * @zh 枚举 `KindOfEraseInDisplay`，定义支持的种类的Erase在Display常量集合。
 */
export enum KindOfEraseInDisplay{
    /**
     * Enum member `KindOfEraseInDisplay.Below` = 0 representing below.
     * @zh 枚举项 `KindOfEraseInDisplay.Below` = 0，表示Below。
     */
    Below=0, Above=1, All=2, SavedLines=3
}
/**
 * Enumeration `KindOfEraseInLine` defining supported kind of erase in line constants.
 * @zh 枚举 `KindOfEraseInLine`，定义支持的种类的Erase在线段常量集合。
 */
export enum KindOfEraseInLine{
    /**
     * Enum member `KindOfEraseInLine.Right` = 0 representing right.
     * @zh 枚举项 `KindOfEraseInLine.Right` = 0，表示右侧位置。
     */
    Right=0, Left=1, All=2
}