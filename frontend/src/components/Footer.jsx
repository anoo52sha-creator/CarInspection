export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-10 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Auto Vera. All rights reserved.</p>
        <p className="mt-2">
          Built with precision for smart vehicle verification.
        </p>
      </div>
    </footer>
  );
}
