export const formatDpt = (dpt) => (
    dpt === 'All' ? 'All' :
    dpt.charAt(0).toUpperCase() + dpt.slice(1)
        .replace(/and/gi, ' and ')
        .replace(/social/gi, ' Social')
        .replace(/foundation/gi, ' Foundation')
        .replace(/administration/gi, ' Administration')
        .trim()
)