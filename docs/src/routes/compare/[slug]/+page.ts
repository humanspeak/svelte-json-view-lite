import { comparisons } from '$lib/compare-data'
import { createCompareSlugLoad } from '@humanspeak/docs-kit'

export const prerender = true
export const { entries, load } = createCompareSlugLoad(comparisons)
