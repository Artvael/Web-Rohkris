export const galleryItem = {
  name: 'galleryItem',
  title: 'Galeri Foto',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Judul / Nama Acara',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Foto',
      type: 'image',
      options: {
        hotspot: true, // Allows user to crop / focal point
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Kategori Kegiatan',
      type: 'string',
      options: {
        list: [
          { title: 'Paskah', value: 'Paskah' },
          { title: 'Natal', value: 'Natal' },
          { title: 'Ibadah Rutin', value: 'Ibadah Rutin' },
          { title: 'Retreat', value: 'Retreat' },
          { title: 'Fellowship', value: 'Fellowship' },
          { title: 'Latihan', value: 'Latihan' },
          { title: 'Lainnya', value: 'Lainnya' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'Paskah',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'date',
      title: 'Tanggal / Keterangan Waktu',
      type: 'string',
      description: 'Misal: 15 April 2026 atau April 2026',
    },
    {
      name: 'description',
      title: 'Deskripsi Singkat',
      type: 'text',
      rows: 3,
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      subtitle: 'date',
    },
  },
};
