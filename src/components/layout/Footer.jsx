const Footer = () => {
  return (
    <footer className="bg-[#3572EF] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Tentang Kami */}
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Tentang Kami</h3>
            <p className="text-white/70 leading-relaxed text-sm sm:text-base">
              Platform quiz interaktif untuk meningkatkan pengetahuan Anda di berbagai bidang.
            </p>
          </div>

          {/* Link Cepat */}
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Link Cepat</h3>
            <ul className="space-y-1.5 sm:space-y-2 list-none pl-0">
              <li>
                <a
                  href="/dashboard"
                  className="text-white/70 hover:text-white transition-colors text-sm sm:text-base inline-block no-underline "
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors text-sm sm:text-base inline-block no-underline "
                >
                  Quiz
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors text-sm sm:text-base inline-block no-underline "
                >
                  Leaderboard
                </a>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Kontak</h3>
            <p className="text-white/70 text-sm sm:text-base mb-1">
              Email: info@quizdashboard.com
            </p>
            <p className="text-white/70 text-sm sm:text-base">
              Telp: +62 123 4567 890
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center">
          <p className="text-white/60 text-xs sm:text-sm">
            &copy; 2026 Quiz Dashboard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer