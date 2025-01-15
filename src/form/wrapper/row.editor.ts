import { ChangeDetectionStrategy, Component, Inject,Optional } from '@angular/core';
import { FieldArrayType, FormBuilder, FormConfig } from '@dotos/dui/core/form';

@Component({
  selector: 'row-editor',
  templateUrl: './row.editor.html',
  styleUrls: ['./row.editor.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  
})
export class RowEditorComponent extends FieldArrayType {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(@Inject(FormConfig) @Optional() builder?: FormBuilder) {
    super();
  }
  override add() {
    super.add();
  }
  override remove(i: number) {
    super.remove(i);
  }
}
