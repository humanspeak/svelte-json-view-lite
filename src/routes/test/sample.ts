/**
 * Canonical demo payload, mirrored verbatim from
 * react-json-view-lite's `src/stories/JsonView.stories.tsx` so our
 * playground demos can be compared 1:1 against the AnyRoad Storybook.
 *
 * Covers: strings (including an empty-key field), bigints, dates,
 * booleans, null, arrays, nested objects, functions, and a lorem-ipsum
 * wrap test.
 */
export const jsonData = {
    'string property': 'my string',
    '': 'empty name property',
    'bigint property': 9007199254740991n,
    'number property': 42.42,
    'date property': new Date(0),
    'boolean property': true,
    'null property': null,
    'empty array': [],
    'array propery': [1, 2, 3, 4, 5],
    'empty object': {},
    'nested object': {
        first: true,
        second: 'another value',
        'sub nested': {
            sub1: [true, true, true],
            longText:
                ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam pharetra at dolor eu egestas. Mauris bibendum a sem vel euismod. Proin vitae imperdiet diam. In sed gravida nisi, in convallis felis. Fusce convallis dapibus molestie. In tristique dapibus velit et rutrum. Nam vestibulum sodales tortor. Integer gravida aliquet sollicitudin. Duis at nulla varius, congue risus sit amet, gravida ipsum. Cras placerat pellentesque ipsum, a consequat magna pretium et. Duis placerat dui nisi, eget varius dui egestas eget. Etiam leo mauris, mattis et aliquam hendrerit, dapibus eu massa. Phasellus vitae vestibulum elit. Nulla congue eleifend massa at efficitur. '
        }
    },
    func: () => {
        /* no-op */
    }
}
