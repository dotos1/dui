/**
 * @fileoverview Module `src/ux/editor/plugins/image-resize.ts` providing image resize definitions and implementation.
 * @zh 模块文件 `src/ux/editor/plugins/image-resize.ts`，提供图像调整尺寸相关的定义与实现。
 */

import { ApplicationRef, createComponent, ComponentRef, Injector } from '@angular/core';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { NodeSelection, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView, NodeView } from 'prosemirror-view';
import { Subscription } from 'rxjs';

import { ImageViewComponent } from '../components/image-view/image-view.component';

/**
 * Class `ImageRezieView` encapsulating image rezie view data structures and logic in `src/ux/editor/plugins`.
 * @zh 类 `ImageRezieView`，封装 `src/ux/editor/plugins` 中的图像Rezie视图数据结构与处理逻辑。
 */
class ImageRezieView implements NodeView {
  /**
   * Property `dom` (`HTMLElement`) storing dom.
   * @zh 属性 `dom`（类型：`HTMLElement`），用于存储或配置DOM节点。
   */
  dom: HTMLElement;
  /**
   * Property `view` (`EditorView`) storing view.
   * @zh 属性 `view`（类型：`EditorView`），用于存储或配置视图。
   */
  view: EditorView;
  /**
   * Property `getPos` (`() => number`) storing get pos.
   * @zh 属性 `getPos`（类型：`() => number`），用于存储或配置获取位置。
   */
  getPos: () => number;

  /**
   * Property `applicationRef` (`ApplicationRef`) storing application ref.
   * @zh 属性 `applicationRef`（类型：`ApplicationRef`），用于存储或配置application引用。
   */
  applicationRef: ApplicationRef;
  /**
   * Property `imageComponentRef` (`ComponentRef<ImageViewComponent>`) storing image component ref.
   * @zh 属性 `imageComponentRef`（类型：`ComponentRef<ImageViewComponent>`），用于存储或配置图像组件引用。
   */
  imageComponentRef: ComponentRef<ImageViewComponent>;
  /**
   * Property `resizeSubscription` (`Subscription`) storing resize subscription.
   * @zh 属性 `resizeSubscription`（类型：`Subscription`），用于存储或配置调整尺寸订阅对象。
   */
  resizeSubscription: Subscription;

  /**
   * Property `node` (`ProseMirrorNode`) storing node.
   * @zh 属性 `node`（类型：`ProseMirrorNode`），用于存储或配置节点。
   */
  node: ProseMirrorNode;
  /**
   * Property `updating` (`boolean`) storing updating (default: `false`).
   * @zh 属性 `updating`（类型：`boolean`），用于存储或配置更新（默认值：`false`）。
   */
  updating = false;

  /**
   * Creates an instance of `ImageRezieView` and initializes its dependencies and internal state.
   * @zh 创建 `ImageRezieView` 实例，并初始化其依赖项与内部状态。
   * @param node - Injected or initial node (`ProseMirrorNode`) / 注入或传入的节点（`ProseMirrorNode`）
   * @param view - Injected or initial view (`EditorView`) / 注入或传入的视图（`EditorView`）
   * @param getPos - Injected or initial get pos (`() => number`) / 注入或传入的获取位置（`() => number`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   */
  constructor(node: ProseMirrorNode, view: EditorView, getPos: () => number, injector: Injector) {
    this.applicationRef = injector.get(ApplicationRef);

    // Create the component and wire it up with the element
    this.imageComponentRef = createComponent(ImageViewComponent, {
      environmentInjector: this.applicationRef.injector,
      elementInjector: injector,
    });
    // Attach to the view so that the change detector knows to run
    this.applicationRef.attachView(this.imageComponentRef.hostView);

    this.setNodeAttributes(node.attrs);
    this.imageComponentRef.instance.view = view;

    this.dom = this.imageComponentRef.location.nativeElement;
    this.view = view;
    this.node = node;
    this.getPos = getPos;

    this.resizeSubscription = this.imageComponentRef.instance.imageResize.subscribe(() => {
      this.handleResize();
    });
  }

  /**
   * Executes `computeChanges` to handle compute changes.
   * @zh 执行 `computeChanges`，用于计算变更集合。
   * @param prevAttrs - prev attrs parameter (`any`) / 前一个属性集合参数（`any`）
   * @param newAttrs - new attrs parameter (`any`) / 新属性集合参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private computeChanges(prevAttrs, newAttrs): boolean {
    return JSON.stringify(prevAttrs) !== JSON.stringify(newAttrs);
  }

  /**
   * Executes `setNodeAttributes` to handle set node attributes.
   * @zh 执行 `setNodeAttributes`，用于集合节点属性列表。
   * @param attrs - attrs parameter (`any`) / 属性集合参数（`any`）
   */
  private setNodeAttributes(attrs): void {
    this.imageComponentRef.instance.src = attrs['src'];
    this.imageComponentRef.instance.alt = attrs['alt'];
    this.imageComponentRef.instance.title = attrs['title'];
    this.imageComponentRef.instance.outerWidth = attrs['width'];
  }

  /**
   * Property `handleResize` (`() => void`) storing handle resize.
   * @zh 属性 `handleResize`（类型：`() => void`），用于存储或配置连接手柄调整尺寸。
   */
  handleResize = (): void => {
    if (this.updating) {
      return;
    }

    const { state, dispatch } = this.view;
    const { tr } = state;

    const transaction = tr.setNodeMarkup(this.getPos(), undefined, {
      ...this.node.attrs,
      width: this.imageComponentRef.instance.outerWidth,
    });

    const resolvedPos = transaction.doc.resolve(this.getPos());
    const newSelection = new NodeSelection(resolvedPos);

    transaction.setSelection(newSelection);
    dispatch(transaction);
  };

  /**
   * Executes `update` to handle update.
   * @zh 执行 `update`，用于更新。
   * @param node - node parameter (`ProseMirrorNode`) / 节点参数（`ProseMirrorNode`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  update(node: ProseMirrorNode): boolean {
    if (node.type !== this.node.type) {
      return false;
    }

    const changed = this.computeChanges(this.node.attrs, node.attrs);
    this.node = node;
    if (changed) {
      this.updating = true;
      this.setNodeAttributes(node.attrs);
      this.updating = false;
    }
    return true;
  }

  /**
   * Executes `ignoreMutation` to handle ignore mutation.
   * @zh 执行 `ignoreMutation`，用于忽略Mutation。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  ignoreMutation(): boolean {
    return true;
  }

  /**
   * Executes `selectNode` to handle select node.
   * @zh 执行 `selectNode`，用于下拉选择节点。
   */
  selectNode(): void {
    this.imageComponentRef.instance.selected = true;
  }

  /**
   * Executes `deselectNode` to handle deselect node.
   * @zh 执行 `deselectNode`，用于取消选中节点。
   */
  deselectNode(): void {
    this.imageComponentRef.instance.selected = false;
  }

  /**
   * Executes `destroy` to handle destroy.
   * @zh 执行 `destroy`，用于销毁。
   */
  destroy(): void {
    this.resizeSubscription.unsubscribe();
    this.applicationRef.detachView(this.imageComponentRef.hostView);
    this.imageComponentRef.destroy();
  }
}

/**
 * Constant/variable `imageResizePlugin` defining image resize plugin in `src/ux/editor/plugins`.
 * @zh 常量/变量 `imageResizePlugin`，定义 `src/ux/editor/plugins` 中的图像调整尺寸Plugin。
 */
const imageResizePlugin = (injector: Injector): Plugin => {
  return new Plugin({
    key: new PluginKey('image-resize'),
    props: {
      nodeViews: {
        image: (node: ProseMirrorNode, view: EditorView, getPos: () => number) => {
          return new ImageRezieView(node, view, getPos, injector);
        },
      },
    },
  });
};

export default imageResizePlugin;
