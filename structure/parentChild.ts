import type {StructureBuilder, ListBuilder, ItemChild} from 'sanity/structure'
import type {DocumentStore, ListenQueryOptions, SanityDocument} from 'sanity'
import {Observable, switchMap, map} from 'rxjs'
import {distinctUntilChanged} from 'rxjs/operators'
import {isEqual} from 'lodash'
import {AddIcon} from '@sanity/icons'

export default function parentChild(
  schemaType: string = 'yourSchemaType',
  S: StructureBuilder,
  documentStore: DocumentStore,
) {
  const query = `*[_type == "${schemaType}" && !defined(parent)]{ _id, title, slug }`
  const queryId = (id: string) => `*[_id == "${id}"][0]{ _id, title, slug, parent, children }`
  const queryGetChildren = (id: string, schemaType: string) =>
    `*[_type == "${schemaType}" && parent._ref == "${id}"]`

  const options: ListenQueryOptions = {apiVersion: `2023-01-01`, perspective: 'previewDrafts'}

  const getChildrenFn = (
    id: string,
    S: StructureBuilder,
    fn: any,
  ): Observable<ListBuilder | ItemChild> => {
    return documentStore.listenQuery(queryGetChildren(id, schemaType), {}, options).pipe(
      distinctUntilChanged(isEqual),
      switchMap((children) => {
        return documentStore.listenQuery(queryId(id), {}, options).pipe(
          distinctUntilChanged(isEqual),
          map((parent) => {
            console.log(parent.title, children)
            if (children && children.length > 0) {
              return S.list()
                .title(parent.title)
                .items([
                  S.listItem()
                    .id(parent._id)
                    .title(parent.title)
                    .child(S.document().documentId(parent._id).schemaType(schemaType)),

                  S.divider(),

                  ...children
                    .filter(({_id}: {_id: string}) => id !== _id)
                    .map((child: any) => {
                      return S.listItem()
                        .id(child._id)
                        .title(child.title)
                        .showIcon(true)
                        .schemaType(schemaType)
                        .child((_id) => fn(_id, S, fn))
                    }),
                ])
            } else {
              return S.document().schemaType(schemaType).documentId(id)
            }
          }),
        )
      }),
    )
  }

  return S.listItem()
    .title('Pages')
    .child(() =>
      documentStore.listenQuery(query, {}, options).pipe(
        distinctUntilChanged(isEqual),
        map((parents) =>
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('All')
                .schemaType(schemaType)
                .child(() =>
                  S.documentList()
                    .schemaType(schemaType)
                    .title('All')
                    .apiVersion('X')
                    .filter('_type == $schemaType')
                    .params({schemaType})
                    .canHandleIntent(
                      (intentName, params) => intentName === 'edit' && params.type === schemaType,
                    )
                    .child((id) => S.document().documentId(id).schemaType(schemaType)),
                ),
              S.divider(),

              ...parents.map((parent: any) => {
                return S.listItem()
                  .id(parent._id)
                  .title(parent.title)
                  .schemaType(schemaType)
                  .child((id) => getChildrenFn(id, S, getChildrenFn))
              }),
            ]),
        ),
      ),
    )
}
