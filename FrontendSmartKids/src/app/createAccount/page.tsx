import CreateAccount from '@/components/createAccount'

export default function Page() {
  return (
    <main className="flex-1 bg-gradient-to-b from-gray-50 to-gray-200 dark:from-black dark:to-gray-900 flex items-center justify-center p-6 font-[family-name:var(--font-geist-sans)]">
      <CreateAccount />
    </main>
  )
}