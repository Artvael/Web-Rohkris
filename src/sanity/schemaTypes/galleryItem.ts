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
      name: 'date',
      title: 'Tanggal',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
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
