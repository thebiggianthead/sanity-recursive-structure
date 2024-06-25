# Example recursive desk

This is a Studio with an example of a recursive desk structure, where parent / child relationships can be handled by using the Desk Structure API and listening to changes in the Document Store.

Caveats:

- Not tested at scale.
- Performance will be impacted - lists are not optimised and virtualized like default desk lists are.
- Intent handling is janky - adding new pages in this context jumps to the "master" page list.
- Custom doc list with parent and children pages removes the doc list search.

## Alternatives

Often the editor need for a hierarchy can be met in others ways:

- More accurate content modelling (a person or product should be a content type, not a page!)
- Using the Structure Builder API to organise content groupings in the Studio in different ways
- The Presentation tool can help visualise a lot of this
- If the relationships are part of a taxonomy, I'd suggest checking out the [Taxonomy Manager plugin](https://www.sanity.io/plugins/taxonomy-manager) to see if this could meet your needs.
- The [Hierarchical Document List plugin](https://github.com/sanity-io/hierarchical-document-list) can be useful in offering a convenient and visual way of managing a tree structure. The approach this takes is storing the hierarchy in a separate document - this allows you to include a document in multiple hierarchies, and separates the content itself from where is it presented in a hierarchy.
