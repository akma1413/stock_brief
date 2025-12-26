import LoginButton from '@/features/auth/components/LoginButton'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 text-center">
                <h1 className="text-3xl font-bold">Welcome to Stock Brief</h1>
                <p className="text-gray-600">Sign in to manage your portfolio</p>
                <LoginButton />
            </div>
        </div>
    )
}
