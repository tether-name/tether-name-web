export function Footer() {
  return (
    <footer className="border-t border-[#444] bg-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <a href="https://commit451.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-white transition-colors">&copy; Commit 451</a>
        <div className="flex gap-6">
          <a href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</a>
          <a href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms</a>
          <a href="/support" className="text-sm text-gray-400 hover:text-white transition-colors">Support</a>
          <a
            href="https://github.com/orgs/tether-name/repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Source
          </a>
        </div>
      </div>
    </footer>
  );
}
