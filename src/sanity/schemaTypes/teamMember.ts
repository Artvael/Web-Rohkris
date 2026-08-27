export const teamMember = {
  name: 'teamMember',
  title: 'Anggota Pengurus',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nama Lengkap',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'role',
      title: 'Peran / Jabatan',
      type: 'string',
      description: 'Misal: Ketua, Wakil Ketua, Pemusik, Anggota, dll (Opsional)',
      initialValue: 'Anggota',
    },
    {
      name: 'grade',
      title: 'Kelas / Jurusan',
      type: 'string',
      description: 'Misal: XI DKV 1, XII RPL 1, X RPL 1, dll',
    },
    {
      name: 'division',
      title: 'Divisi / Angkatan',
      type: 'string',
      options: {
        list: [
          { title: 'Pembina & BPH', value: 'bph' },
          { title: 'Angkatan XII', value: 'xii' },
          { title: 'Angkatan XI', value: 'xi' },
          { title: 'Angkatan X', value: 'x' },
        ],
        layout: 'radio',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'instagram',
      title: 'Username Instagram',
      type: 'string',
      description: 'Tanpa tanda @, misal: rohkris_smkn64',
    },
    {
      name: 'quote',
      title: 'Ayat Favorit / Pesan Singkat',
      type: 'text',
      rows: 2,
    },
    {
      name: 'order',
      title: 'Urutan (Order)',
      type: 'number',
      description: 'Digunakan untuk mengurutkan posisi kartu (Angka lebih kecil tampil lebih dulu)',
      initialValue: 10,
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'division',
    },
    prepare(selection: any) {
      const { title, subtitle } = selection;
      const divisionMap: Record<string, string> = {
        bph: 'Pembina & BPH',
        xii: 'Angkatan XII',
        xi: 'Angkatan XI',
        x: 'Angkatan X',
      };
      return {
        title: title,
        subtitle: divisionMap[subtitle] || subtitle,
      };
    },
  },
};
