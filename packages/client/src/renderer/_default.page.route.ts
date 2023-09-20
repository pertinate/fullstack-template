export { onBeforeRoute }
function onBeforeRoute(pageContext: any) {
    // const { urlWithoutLocale, locale } = extractLocale(pageContext.urlOriginal)
    console.log(pageContext)
    return {
        pageContext: {
            // // We make `locale` available as `pageContext.locale`. We can then use https://vite-plugin-ssr.com/pageContext-anywhere to access pageContext.locale in any React/Vue component.
            // locale,
            // // We overwrite the original URL
            // urlOriginal: urlWithoutLocale,
        },
    }
}
