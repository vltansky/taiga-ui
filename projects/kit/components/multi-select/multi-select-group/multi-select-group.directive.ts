import {Directive, forwardRef, Optional} from '@angular/core';
import {NG_VALUE_ACCESSOR, NgControl} from '@angular/forms';
import {EMPTY_FUNCTION} from '@taiga-ui/cdk';
import {TUI_DATA_LIST_HOST, TUI_OPTION_CONTENT, TuiDataListHost} from '@taiga-ui/core';
import {TUI_MULTI_SELECT_OPTION} from '@taiga-ui/kit/components/multi-select-option';
import {TuiMultiSelectComponent} from '../multi-select.component';

export function hostFallbackFactory<T>(
    control: NgControl,
    host: TuiDataListHost<T> | null,
): TuiDataListHost<T> {
    return (
        host || {
            handleOption: option => {
                if (!control.control) {
                    return;
                }

                const value = control.value || [];
                const index = value.indexOf(option);

                control.control.setValue(
                    index === -1
                        ? [...value, option]
                        : [...value.slice(0, index), ...value.slice(index + 1)],
                );
            },
        }
    );
}

@Directive({
    selector: '[tuiMultiSelectGroup]',
    providers: [
        {
            provide: TUI_OPTION_CONTENT,
            useValue: TUI_MULTI_SELECT_OPTION,
        },
        {
            provide: TUI_DATA_LIST_HOST,
            deps: [
                NgControl,
                [new Optional(), forwardRef(() => TuiMultiSelectComponent)],
            ],
            useFactory: hostFallbackFactory,
        },
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useValue: {
                writeValue: EMPTY_FUNCTION,
                registerOnChange: EMPTY_FUNCTION,
                registerOnTouched: EMPTY_FUNCTION,
            },
        },
    ],
})
export class TuiMultiSelectGroupDirective {}
