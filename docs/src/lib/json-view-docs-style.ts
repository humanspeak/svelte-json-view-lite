import { darkStyles, defaultStyles, type StyleProps } from '@humanspeak/svelte-json-view-lite'

const withDocsTheme = (style: StyleProps): StyleProps => ({
    ...style,
    container: `${style.container ?? ''} sjv-docs-theme`.trim()
})

export const docsDefaultJsonViewStyles = withDocsTheme(defaultStyles)
export const docsDarkJsonViewStyles = withDocsTheme(darkStyles)
