import { InputOption } from '@fiction/ui'
import { z } from 'zod'

// Define schema for map styling
const mapStyles = [
  'satellite',
  'streets',
  'outdoors',
  'light',
  'dark',
  'satellite',
  'satellite-streets',
  'mode',
  'navigation-night',
  'navigation-day',
] as const

// Define aspect ratio options
const aspectRatios = [
  'square',
  'video',
  'landscape',
  'portrait',
  'ultrawide',
  'custom',
] as const

// Schema for a single marker
const markerSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  label: z.string().optional(),
})

// Schema for a single map configuration
const mapSchema = z.object({
  lat: z.number().optional(),
  lng: z.number().optional(),
  zoom: z.number().optional(),
  pitch: z.number().optional(),
  mapStyle: z.enum(mapStyles).optional(),
  markers: z.array(markerSchema).optional(),
  aspectRatio: z.enum(aspectRatios).optional(),
  customRatio: z.string().optional(),
})

// Main user config schema
export const schema = z.object({
  maps: z.array(mapSchema).optional(),
})

export type MapUserConfig = z.infer<typeof mapSchema>
export type UserConfig = z.infer<typeof schema>

export const defaultMap = {
  lat: 33.652199,
  lng: -117.747719,
  zoom: 13,
  pitch: 0,
  mapStyle: 'mode' as const,
  markers: [{ lat: 33.652199, lng: -117.747719, label: 'Headquarters' }],
  aspectRatio: 'landscape' as const,
}

export function getOptions(): InputOption[] {
  return [
    new InputOption({
      input: 'InputList',
      label: 'Maps',
      key: 'maps',
      props: { itemLabel: 'Map' },
      options: [
        new InputOption({
          key: 'lat',
          label: 'Latitude',
          input: 'InputNumber',
          props: {
            step: 0.000001,
            precision: 6,
          },
        }),
        new InputOption({
          key: 'lng',
          label: 'Longitude',
          input: 'InputNumber',
          props: {
            step: 0.000001,
            precision: 6,
          },
        }),
        new InputOption({
          key: 'zoom',
          label: 'Zoom Level',
          input: 'InputRange',
          props: { min: 1, max: 20 },
        }),
        new InputOption({
          key: 'pitch',
          label: 'Tilt Angle',
          input: 'InputRange',
          props: { min: 0, max: 85 },
        }),
        new InputOption({
          key: 'mapStyle',
          label: 'Map Style',
          input: 'InputSelect',
          props: {
            options: mapStyles.map(style => ({
              label: style.charAt(0).toUpperCase() + style.slice(1).replace(/-/g, ' '),
              value: style,
            })),
          },
        }),
        new InputOption({
          key: 'aspectRatio',
          label: 'Aspect Ratio',
          input: 'InputSelect',
          props: {
            options: aspectRatios.map(ratio => ({
              label: ratio.charAt(0).toUpperCase() + ratio.slice(1),
              value: ratio,
            })),
          },
        }),
        new InputOption({
          key: 'customRatio',
          label: 'Custom Ratio (w/h)',
          input: 'InputText',
          props: {
            placeholder: '16/9',
          },
        }),
        new InputOption({
          label: 'Markers',
          key: 'markers',
          props: { itemLabel: 'Location Pin' },
          options: [
            new InputOption({
              key: 'lat',
              label: 'Latitude',
              input: 'InputNumber',
              props: {
                step: 0.000001,
                precision: 6,
              },
            }),
            new InputOption({
              key: 'lng',
              label: 'Longitude',
              input: 'InputNumber',
              props: {
                step: 0.000001,
                precision: 6,
              },
            }),
            new InputOption({
              key: 'label',
              label: 'Tooltip Label',
              input: 'InputText',
              props: {
                placeholder: 'Location description',
              },
            }),
          ],
        }),
      ],
    }),
  ]
}

export function getDefaultConfig(): UserConfig {
  return {
    maps: [defaultMap],
  }
}

export function getDemoConfigs(templateId: string): Record<string, { templateId: string, userConfig: UserConfig }> {
  return {
    default: {
      templateId,
      userConfig: getDefaultConfig(),
    },
    multiLocation: {
      templateId,
      userConfig: {
        maps: [{
          ...defaultMap,
          lat: 34.0522,
          lng: -118.2437,
          zoom: 12,
          mapStyle: 'navigation-night',
          aspectRatio: 'ultrawide',
          markers: [
            { lat: 34.0522, lng: -118.2437, label: 'LA Headquarters' },
            { lat: 34.0407, lng: -118.2468, label: 'Downtown Office' },
          ],
        }],
      },
    },
    satelliteView: {
      templateId,
      userConfig: {
        maps: [{
          ...defaultMap,
          mapStyle: 'satellite',
          zoom: 15,
          pitch: 60,
          aspectRatio: 'square',
        }],
      },
    },
    gridLayout: {
      templateId,
      userConfig: {
        maps: [
          { ...defaultMap, mapStyle: 'light', aspectRatio: 'landscape' },
          { ...defaultMap, mapStyle: 'dark', aspectRatio: 'landscape' },
          { ...defaultMap, mapStyle: 'satellite', aspectRatio: 'landscape' },
          { ...defaultMap, mapStyle: 'streets', aspectRatio: 'landscape' },
        ],
      },
    },
  }
}

export async function getConfig(args: { templateId: string }) {
  const { templateId } = args
  return {
    schema,
    options: getOptions(),
    userConfig: getDefaultConfig(),
    demoPage: {
      cards: Object.values(getDemoConfigs(templateId)),
    },
  }
}
