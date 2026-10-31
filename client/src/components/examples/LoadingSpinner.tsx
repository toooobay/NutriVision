import LoadingSpinner from '../LoadingSpinner'

export default function LoadingSpinnerExample() {
  return (
    <div className="space-y-6">
      <LoadingSpinner stage="uploading" message="Sedang mengunggah foto makanan Anda..." />
      <LoadingSpinner stage="analyzing" message="AI sedang mengidentifikasi jenis makanan..." />
      <LoadingSpinner stage="processing" message="Menghitung kandungan nutrisi dan kalori..." />
    </div>
  )
}