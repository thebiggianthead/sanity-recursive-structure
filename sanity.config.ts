import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'Basic Studio',

  projectId: 'pjpqerlt',
  dataset: 'recursive-desk',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,

    templates: (prev) => {
      const prevFiltered = prev.filter((template) => template.id !== 'lesson')

      return [
        ...prevFiltered,
        {
          id: 'page-parent',
          title: 'Page with Parent',
          schemaType: 'page',
          parameters: [{name: 'parent', type: 'string'}],
          value: (params: {parent: string}) => ({
            parent: {
              "_ref": params.parent,
              "_type": "reference"
            },
          }),
        },
      ]
    },
  },
})
