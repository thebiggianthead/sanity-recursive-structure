import type {StructureResolver} from 'sanity/structure'
import parentChild from './parentChild'

export const structure: StructureResolver = (S, context) =>
  S.list()
    .id('root')
    .title('Content')
    .items([parentChild('page', S, context.documentStore)])
