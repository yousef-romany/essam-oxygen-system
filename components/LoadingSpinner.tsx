import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: number
}

export function LoadingSpinner({ size = 24 }: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center items-center h-full">
      <Loader2 className="animate-spin text-primary" style={{ width: size, height: size }} />
      <span className="sr-only">جاري التحميل...</span>
    </div>
  )
}
