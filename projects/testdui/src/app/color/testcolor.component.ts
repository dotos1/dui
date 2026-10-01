import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { FormComponent } from "@dotos/dui/form";

@Component({
    selector: 'test-color',
    template: `
        <dui-form #iconForm  [config]="iconFormConfig" style="width:100%"></dui-form>
     `,
    changeDetection: ChangeDetectionStrategy.Default
  })
export class TestColorComponent {
    @ViewChild('commonForm', { static: false }) commonForm: FormComponent;
    iconFormConfig = {
        items: [
            {
                name: 'color',
                label: '颜色',
                colorType: 'sketch',
                wrappers: ['form-field'],
                flex:  50,
                openOnFocus: true,
                defaultValue: '#00FF00',
                xtype: 'color-picker-field'
              },
              { 
                xtype: 'icon-picker-field',
                label: 'GIS.STYLE.ICON',
                name: 'icon',
                allow: ['font', 'custom'],
                custompath: 'marker',
                fontpath: 'map/font',
                required: true,
                wrappers: ['form-field'],
                flex: 100
              },
              {
                xtype: 'icon-picker-field',
                label: 'TOPMENU.ICON',
                name: 'icon_url',
                required: false,
                allow:['material','svg'],
                iconpath:'svgicon',
                wrappers: ['form-field'],
                flex: 25,
             },
             { 
              xtype: 'icon-picker-field',
              label: 'GIS.STYLE.ICON',
              name: 'icon_font',
              allow: ['font', 'custom','material','svg'],
              custompath: 'marker',
              fontpath: 'map/font',
              iconpath:'svgicon',
              required: true,
              wrappers: ['form-field'],
              flex: 100
            },
        ]
    }
}
