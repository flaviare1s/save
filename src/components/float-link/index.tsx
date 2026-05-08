import { Plus } from "lucide-react"
import { Link } from "react-router-dom"

export const FloatLink = () => {
  return (
    <Link to="/onboarding" className="absolute bottom-5 right-5 bg-primary rounded-full h-14 w-14 md:h-18 md:w-18">
      <Plus className="w-10 h-10 md:h-12 md:w-12 text-white ml-2 mt-2 md:ml-3 md:mt-3" />
    </Link>
  )
}
