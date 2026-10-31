import NutritionCard from '../NutritionCard'

export default function NutritionCardExample() {
  // TODO: remove mock data
  const mockNutrition = {
    calories: 485,
    protein: 28,
    carbs: 45,
    fat: 22,
    fiber: 8,
    sugar: 12,
    sodium: 420
  }

  return (
    <NutritionCard 
      foodName="Nasi Gudeg dengan Ayam" 
      nutrition={mockNutrition}
      confidence={94}
    />
  )
}