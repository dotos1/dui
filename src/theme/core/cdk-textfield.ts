export function cdkTextfieldAutosize(): Object {
    return {
        'textarea.cdk-textarea-autosize': {
            resize: 'none'
        },
        'textarea.cdk-textarea-autosize-measuring': {
            'padding': '2px 0 !important',
            'box-sizing': 'content-box !important',
            'height': 'auto !important',
            'overflow': 'hidden !important'
        },
        'textarea.cdk-textarea-autosize-measuring-firefox': {
            'padding': '2px 0 !important',
            'box-sizing': 'content-box !important',
            'height': '0 !important',
        }
    }
}
export function cdkTextfieldAutoFill(): Object {
    return {
        '.cdk-text-field-autofill-monitored:-webkit-autofill': {
        },
        '.cdk-text-field-autofill-monitored:not(:-webkit-autofill)': {
        },
    }
}