import styles from './styles.module.css'
import type { AriaLabels, StyleProps } from './types.js'

export type {
    AriaLabels,
    BigIntSnippetProps,
    BooleanSnippetProps,
    DateSnippetProps,
    FunctionSnippetProps,
    LabelSnippetProps,
    NodeExpandingEvent,
    NullSnippetProps,
    NumberSnippetProps,
    Props,
    SnippetOverrides,
    StringSnippetProps,
    StyleProps,
    UndefinedSnippetProps
} from './types.js'
export { allExpanded, collapseAllNested } from './utils/expandStrategies.js'

const baseAriaLabels: AriaLabels = {
    collapseJson: 'collapse JSON',
    expandJson: 'expand JSON'
}

/**
 * Correctly-spelled default aria labels. Introduced in the Svelte port;
 * prefer this over the typoed `StyleProps.ariaLables` shipped by
 * `react-json-view-lite`.
 */
export const defaultAriaLabels: AriaLabels = baseAriaLabels

const buildStyles = (variant: 'light' | 'dark'): StyleProps => ({
    container: styles[`container-${variant}`],
    basicChildStyle: styles['basic-element-style'],
    childFieldsContainer: styles['child-fields-container'],
    label: styles[`label-${variant}`],
    clickableLabel: styles[`clickable-label-${variant}`],
    nullValue: styles[`value-null-${variant}`],
    undefinedValue: styles[`value-undefined-${variant}`],
    stringValue: styles[`value-string-${variant}`],
    booleanValue: styles[`value-boolean-${variant}`],
    numberValue: styles[`value-number-${variant}`],
    otherValue: styles[`value-other-${variant}`],
    punctuation: styles[`punctuation-${variant}`],
    collapseIcon: styles[`collapse-icon-${variant}`],
    expandIcon: styles[`expand-icon-${variant}`],
    collapsedContent: styles[`collapsed-content-${variant}`],
    noQuotesForStringValues: false,
    quotesForFieldNames: false,
    ariaLabels: baseAriaLabels,
    stringifyStringValues: false
})

export const defaultStyles: StyleProps = buildStyles('light')
export const darkStyles: StyleProps = buildStyles('dark')
