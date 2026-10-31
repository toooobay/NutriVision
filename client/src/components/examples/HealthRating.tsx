import HealthRating from '../HealthRating'

export default function HealthRatingExample() {
  return (
    <div className="space-y-6">
      <HealthRating 
        rating="Sangat Baik" 
        reason="Makanan ini kaya protein dan serat dengan kandungan gula yang rendah." 
      />
      <HealthRating 
        rating="Baik" 
        reason="Porsi seimbang namun bisa ditambah sayuran hijau untuk nutrisi optimal." 
      />
      <HealthRating 
        rating="Kurang" 
        reason="Kandungan gula dan sodium tinggi, sebaiknya dikurangi porsinya." 
      />
    </div>
  )
}