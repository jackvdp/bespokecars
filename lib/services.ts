export const serviceOptions = [
  { value: '', label: 'Select a service' },
  { value: 'wedding', label: 'Wedding Car Hire' },
  { value: 'photoshoot', label: 'Photoshoot & Film Hire' },
  { value: 'limousine', label: 'Limousine Service' },
  { value: 'self-drive', label: 'Self Drive Experience' },
  { value: 'corporate', label: 'Corporate & Event Hire' },
  { value: 'chauffeur', label: 'Private Chauffeur Services' },
  { value: 'security', label: 'Close Protection' },
  { value: 'leasing', label: 'Vehicle Leasing' },
  { value: 'other', label: 'Other' },
] as const

export type ServiceValue = typeof serviceOptions[number]['value']
