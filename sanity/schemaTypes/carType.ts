import {RocketIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const carType = defineType({
  name: 'car',
  title: 'Car',
  type: 'document',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
    defineField({
      name: 'logoUrl',
      title: 'Brand Logo URL (temporary)',
      type: 'url',
    }),
    defineField({
      name: 'imageUrls',
      title: 'Gallery Image URLs (temporary)',
      type: 'array',
      of: [defineArrayMember({type: 'url'})],
    }),
    defineField({
      name: 'logo',
      title: 'Brand Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
    defineField({
      name: 'priceDaily',
      title: 'Daily Price (Mon-Thu)',
      type: 'number',
    }),
    defineField({
      name: 'priceWeekend',
      title: 'Weekend Price',
      type: 'number',
    }),
    defineField({
      name: 'priceWeekly',
      title: 'Weekly Price',
      type: 'number',
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category.title',
      media: 'images.0',
    },
  },
})
