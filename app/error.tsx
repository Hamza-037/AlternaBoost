'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center px-4 max-w-md">
        <h1 className="text-9xl font-black text-gray-200">Oops!</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Une erreur s&apos;est produite</h2>
        <p className="text-gray-600 mb-8">
          Quelque chose s&apos;est mal passé. Veuillez réessayer.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={reset}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Réessayer
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            size="lg"
          >
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    </div>
  )
}

