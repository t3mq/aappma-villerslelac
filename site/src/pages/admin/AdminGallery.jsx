import { useState } from 'react';
import { Upload, Trash2, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function AdminGallery() {
  const { gallery, addPhoto, deletePhoto } = useData();
  const [preview, setPreview] = useState(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-semibold text-green-dark">Galerie photos</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-dark hover:bg-green-medium text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
          <Upload size={16} /> Uploader
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 mb-6 border-2 border-dashed border-gray-200 hover:border-green-dark/30 transition-colors cursor-pointer text-center">
        <Upload size={32} className="mx-auto text-gray-400 mb-3" />
        <p className="text-sm text-gray-500">Glissez vos photos ici ou cliquez pour uploader</p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG (max 10 Mo par photo)</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((photo) => (
          <div key={photo.id} className="group relative overflow-hidden rounded-xl aspect-square bg-gray-100">
            <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover cursor-pointer" onClick={() => setPreview(photo)} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            <button
              onClick={() => deletePhoto(photo.id)}
              className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer"><X size={28} /></button>
          <img src={preview.src} alt={preview.alt} className="max-w-full max-h-[85vh] rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
