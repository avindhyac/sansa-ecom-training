import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Authentication Error</h1>
        <p className="text-foreground/80 mb-6">
          There was an error signing in. Please try again.
        </p>
        <Link
          href="/"
          className="inline-block bg-jade hover:bg-jade-dark text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
