/**
 * @fileoverview Module `src/container/dock-layout/utils/dom-constants.ts` providing dom constants definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/utils/dom-constants.ts`，提供DOM节点constants相关的定义与实现。
 */

export namespace DomConstants {
    /**
     * Enumeration `ClassName` defining supported class name constants.
     * @zh 枚举 `ClassName`，定义支持的类名名称常量集合。
     */
    export const enum ClassName {
        /**
         * Enum member `ClassName.DockLayout` = 'lm_docklayout' representing dock layout.
         * @zh 枚举项 `ClassName.DockLayout` = 'lm_docklayout'，表示停靠面板布局。
         */
        DockLayout = 'lm_docklayout',
        /**
         * Enum member `ClassName.Focused` = 'lm_focused' representing focused.
         * @zh 枚举项 `ClassName.Focused` = 'lm_focused'，表示已聚焦。
         */
        Focused = 'lm_focused',
        /**
         * Enum member `ClassName.Item` = 'lm_item' representing item.
         * @zh 枚举项 `ClassName.Item` = 'lm_item'，表示条目。
         */
        Item = 'lm_item',
        /**
         * Enum member `ClassName.Items` = 'lm_items' representing items.
         * @zh 枚举项 `ClassName.Items` = 'lm_items'，表示条目列表。
         */
        Items = 'lm_items',
        /**
         * Enum member `ClassName.Stack` = 'lm_stack' representing stack.
         * @zh 枚举项 `ClassName.Stack` = 'lm_stack'，表示栈。
         */
        Stack = 'lm_stack',
        /**
         * Enum member `ClassName.MaximisePlace` = 'lm_maximise_place' representing maximise place.
         * @zh 枚举项 `ClassName.MaximisePlace` = 'lm_maximise_place'，表示最大化Place。
         */
        MaximisePlace = 'lm_maximise_place',
        /**
         * Enum member `ClassName.DropTabPlaceholder` = 'lm_drop_tab_placeholder' representing drop tab placeholder.
         * @zh 枚举项 `ClassName.DropTabPlaceholder` = 'lm_drop_tab_placeholder'，表示放置选项卡占位提示。
         */
        DropTabPlaceholder = 'lm_drop_tab_placeholder',
        /**
         * Enum member `ClassName.DragHandle` = 'lm_drag_handle' representing drag handle.
         * @zh 枚举项 `ClassName.DragHandle` = 'lm_drag_handle'，表示拖拽连接手柄。
         */
        DragHandle = 'lm_drag_handle',
        /**
         * Enum member `ClassName.Splitter` = 'lm_splitter' representing splitter.
         * @zh 枚举项 `ClassName.Splitter` = 'lm_splitter'，表示分割条。
         */
        Splitter = 'lm_splitter',
        /**
         * Enum member `ClassName.Vertical` = 'lm_vertical' representing vertical.
         * @zh 枚举项 `ClassName.Vertical` = 'lm_vertical'，表示垂直。
         */
        Vertical = 'lm_vertical',
        /**
         * Enum member `ClassName.Horizontal` = 'lm_horizontal' representing horizontal.
         * @zh 枚举项 `ClassName.Horizontal` = 'lm_horizontal'，表示水平。
         */
        Horizontal = 'lm_horizontal',
        /**
         * Enum member `ClassName.Dragging` = 'lm_dragging' representing dragging.
         * @zh 枚举项 `ClassName.Dragging` = 'lm_dragging'，表示拖拽中。
         */
        Dragging = 'lm_dragging',
        /**
         * Enum member `ClassName.DragProxy` = 'lm_dragProxy' representing drag proxy.
         * @zh 枚举项 `ClassName.DragProxy` = 'lm_dragProxy'，表示拖拽Proxy。
         */
        DragProxy = 'lm_dragProxy',
        /**
         * Enum member `ClassName.Header` = 'lm_header' representing header.
         * @zh 枚举项 `ClassName.Header` = 'lm_header'，表示表头。
         */
        Header = 'lm_header',
        /**
         * Enum member `ClassName.Tabs` = 'lm_tabs' representing tabs.
         * @zh 枚举项 `ClassName.Tabs` = 'lm_tabs'，表示选项卡组。
         */
        Tabs = 'lm_tabs',
        /**
         * Enum member `ClassName.Tab` = 'lm_tab' representing tab.
         * @zh 枚举项 `ClassName.Tab` = 'lm_tab'，表示选项卡。
         */
        Tab = 'lm_tab',
        /**
         * Enum member `ClassName.CloseTab` = 'lm_close_tab' representing close tab.
         * @zh 枚举项 `ClassName.CloseTab` = 'lm_close_tab'，表示关闭选项卡。
         */
        CloseTab = 'lm_close_tab',
        /**
         * Enum member `ClassName.MaterialCloseTab` = 'material-symbols-outlined' representing material close tab.
         * @zh 枚举项 `ClassName.MaterialCloseTab` = 'material-symbols-outlined'，表示Material关闭选项卡。
         */
        MaterialCloseTab = 'material-symbols-outlined',
        /**
         * Enum member `ClassName.Controls` = 'lm_controls' representing controls.
         * @zh 枚举项 `ClassName.Controls` = 'lm_controls'，表示控件集合。
         */
        Controls = 'lm_controls',
        /**
         * Enum member `ClassName.TabDropdown` = 'lm_tabdropdown' representing tab dropdown.
         * @zh 枚举项 `ClassName.TabDropdown` = 'lm_tabdropdown'，表示选项卡下拉框。
         */
        TabDropdown = 'lm_tabdropdown',
        /**
         * Enum member `ClassName.TabDropdownList` = 'lm_tabdropdown_list' representing tab dropdown list.
         * @zh 枚举项 `ClassName.TabDropdownList` = 'lm_tabdropdown_list'，表示选项卡下拉框列表。
         */
        TabDropdownList = 'lm_tabdropdown_list',
        /**
         * Enum member `ClassName.Title` = 'lm_title' representing title.
         * @zh 枚举项 `ClassName.Title` = 'lm_title'，表示标题。
         */
        Title = 'lm_title',
        /**
         * Enum member `ClassName.Popout` = 'lm_popout' representing popout.
         * @zh 枚举项 `ClassName.Popout` = 'lm_popout'，表示弹出窗口。
         */
        Popout = 'lm_popout',
        /**
         * Enum member `ClassName.Popin` = 'lm_popin' representing popin.
         * @zh 枚举项 `ClassName.Popin` = 'lm_popin'，表示Popin。
         */
        Popin = 'lm_popin',
        /**
         * Enum member `ClassName.Maximise` = 'lm_maximise' representing maximise.
         * @zh 枚举项 `ClassName.Maximise` = 'lm_maximise'，表示最大化。
         */
        Maximise = 'lm_maximise',
        /**
         * Enum member `ClassName.Close` = 'lm_close' representing close.
         * @zh 枚举项 `ClassName.Close` = 'lm_close'，表示关闭。
         */
        Close = 'lm_close',
        /**
         * Enum member `ClassName.Active` = 'lm_active' representing active.
         * @zh 枚举项 `ClassName.Active` = 'lm_active'，表示激活。
         */
        Active = 'lm_active',
        /**
         * Enum member `ClassName.Maximised` = 'lm_maximised' representing maximised.
         * @zh 枚举项 `ClassName.Maximised` = 'lm_maximised'，表示最大化。
         */
        Maximised = 'lm_maximised',
        /**
         * Enum member `ClassName.Content` = 'lm_content' representing content.
         * @zh 枚举项 `ClassName.Content` = 'lm_content'，表示内容。
         */
        Content = 'lm_content',
        /**
         * Enum member `ClassName.Left` = 'lm_left' representing left.
         * @zh 枚举项 `ClassName.Left` = 'lm_left'，表示左侧位置。
         */
        Left = 'lm_left',
        /**
         * Enum member `ClassName.Right` = 'lm_right' representing right.
         * @zh 枚举项 `ClassName.Right` = 'lm_right'，表示右侧位置。
         */
        Right = 'lm_right',
        /**
         * Enum member `ClassName.Bottom` = 'lm_bottom' representing bottom.
         * @zh 枚举项 `ClassName.Bottom` = 'lm_bottom'，表示底部位置。
         */
        Bottom = 'lm_bottom',
        /**
         * Enum member `ClassName.Column` = 'lm_column' representing column.
         * @zh 枚举项 `ClassName.Column` = 'lm_column'，表示列。
         */
        Column = 'lm_column',
        /**
         * Enum member `ClassName.Row` = 'lm_row' representing row.
         * @zh 枚举项 `ClassName.Row` = 'lm_row'，表示行。
         */
        Row = 'lm_row',
        /**
         * Enum member `ClassName.Root` = 'lm_root' representing root.
         * @zh 枚举项 `ClassName.Root` = 'lm_root'，表示根节点。
         */
        Root = 'lm_root',
        /**
         * Enum member `ClassName.Icon` = 'lm_icon' representing icon.
         * @zh 枚举项 `ClassName.Icon` = 'lm_icon'，表示图标。
         */
        Icon = 'lm_icon',
        /**
         * Enum member `ClassName.Bg` = 'lm_bg' representing bg.
         * @zh 枚举项 `ClassName.Bg` = 'lm_bg'，表示背景。
         */
        Bg = 'lm_bg',
        /**
         * Enum member `ClassName.DropTargetIndicator` = 'lm_dropTargetIndicator' representing drop target indicator.
         * @zh 枚举项 `ClassName.DropTargetIndicator` = 'lm_dropTargetIndicator'，表示放置目标指示器。
         */
        DropTargetIndicator = 'lm_dropTargetIndicator',
        /**
         * Enum member `ClassName.Inner` = 'lm_inner' representing inner.
         * @zh 枚举项 `ClassName.Inner` = 'lm_inner'，表示内部。
         */
        Inner = 'lm_inner',
        /**
         * Enum member `ClassName.TransitionIndicator` = 'lm_transition_indicator' representing transition indicator.
         * @deprecated
         * @zh 枚举项 `ClassName.TransitionIndicator` = 'lm_transition_indicator'，表示过渡动画指示器。
         */
        TransitionIndicator = 'lm_transition_indicator',
    }
}
