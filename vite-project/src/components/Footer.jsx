import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-[#deded9] bg-[#f5f5f2] dark:border-[#363636] dark:bg-[#1b1b1b]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-[#64646d] sm:flex-row lg:px-10 dark:text-[#aaaab2]">
        <p>© {new Date().getFullYear()} All rights reserved.</p>

        <p>
          Built by{" "}
          <Link
            to="/contact"
            className="font-semibold text-[#18181b] transition-colors hover:text-blue-600 dark:text-[#f5f5f2] dark:hover:text-[#75a7ff]"
          >
            AZ.
          </Link>
        </p>
      </div>
    </footer>
  );
}