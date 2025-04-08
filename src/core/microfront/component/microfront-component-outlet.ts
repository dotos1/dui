import {
    Directive,
    ViewContainerRef,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    Input,
    AfterViewInit,
    ElementRef,
    NgZone,
    Output,
    EventEmitter
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MicroFrontComponentLoader } from './microfront-component-loader';
import { MicroFrontComponentRef } from './microfront-component-types';
import { PlantComponentProjectableNode } from './microfront-component.config';

@Directive({
    selector: '[planetComponentOutlet]',
    standalone: true
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class MicroFrontComponentOutlet implements OnChanges, OnDestroy, AfterViewInit {
    @Input() planetComponentOutlet: string;

    @Input() planetComponentOutletApp: string;

    @Input() planetComponentOutletProjectableNodes: PlantComponentProjectableNode[];

    @Input() planetComponentOutletInitialState: any;

    @Output() planetComponentLoaded = new EventEmitter<MicroFrontComponentRef>();

    private componentRef: MicroFrontComponentRef;

    private destroyed$ = new Subject<void>();

    constructor(
        private elementRef: ElementRef,
        private planetComponentLoader: MicroFrontComponentLoader,
        private ngZone: NgZone
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (this.planetComponentOutlet && !changes['planetComponentOutlet'].isFirstChange()) {
            this.loadComponent();
        }
    }

    ngAfterViewInit(): void {
        this.loadComponent();
    }

    loadComponent() {
        this.clear();
        if (this.planetComponentOutlet && this.planetComponentOutletApp) {
            this.planetComponentLoader
                .load(this.planetComponentOutletApp, this.planetComponentOutlet, {
                    container: this.elementRef.nativeElement,
                    initialState: this.planetComponentOutletInitialState,
                    projectableNodes: this.planetComponentOutletProjectableNodes
                })
                .pipe(takeUntil(this.destroyed$))
                .subscribe(componentRef => {
                    this.componentRef = componentRef;
                    this.ngZone.run(() => {
                        Promise.resolve().then(() => {
                            this.planetComponentLoaded.emit(this.componentRef);
                        });
                    });
                });
        }
    }

    ngOnDestroy(): void {
        this.clear();
        this.destroyed$.complete();
    }

    clear() {
        this.componentRef?.dispose();
        this.destroyed$.next();
    }
}
