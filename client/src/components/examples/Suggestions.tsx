import Suggestions from '../Suggestions'

export default function SuggestionsExample() {
  // TODO: remove mock data
  const excellentSuggestions: string[] = []
  const goodSuggestions = [
    "Tambahkan lebih banyak sayuran hijau untuk meningkatkan asupan serat",
    "Pertimbangkan mengurangi sedikit porsi nasi untuk keseimbangan optimal"
  ]
  const poorSuggestions = [
    "Kurangi porsi makanan yang digoreng untuk mengurangi lemak jenuh",
    "Tambahkan sayuran segar sebagai pelengkap",
    "Pilih protein tanpa lemak seperti ikan atau ayam tanpa kulit"
  ]

  return (
    <div className="space-y-6">
      <Suggestions rating="Sangat Baik" suggestions={excellentSuggestions} />
      <Suggestions rating="Baik" suggestions={goodSuggestions} />
      <Suggestions rating="Kurang" suggestions={poorSuggestions} />
    </div>
  )
}