import { Button } from "../ui/button";
import Nav from "./nav";

const Header = () => {
  return (
    <>
      <div className="flex flex-col w-full h-full relative overflow-hidden">
        <Nav />
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-gradient-to-bl from-accent/6 via-accent/3 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-tr from-secondary/4 to-transparent rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
        </div>
        <div className="grow flex flex-col justify-center items-center px-6 py-20 text-center space-y-8 relative">
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full animate-ping"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`,
                  animationDelay: `${i * 2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-6 duration-1200">
            <div className="relative">
              <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter bg-gradient-to-br from-foreground via-primary/80 to-foreground/60 bg-clip-text text-transparent drop-shadow-2xl">
                Shotty
              </h1>
              <div className="absolute inset-0 text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter text-primary/5 blur-2xl -z-10">
                Shotty
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50"></div>
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
              <div className="h-1 w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-500"></div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50"></div>
            </div>
          </div>
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-1200 delay-300">
            <p className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground font-medium max-w-3xl leading-relaxed">
              Transform long URLs into{" "}
              <span className="relative inline-block">
                <span className="font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  powerful
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/20 rounded-full block"></span>
              </span>
              ,{" "}
              <span className="relative inline-block">
                <span className="font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  trackable
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/20 rounded-full block"></span>
              </span>{" "}
              short links
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 items-center animate-in fade-in-0 slide-in-from-bottom-4 duration-1200 delay-500">
            <Button
              size="lg"
              className="group relative px-10 py-4 text-lg font-bold shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-110 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              {/* Shimmer effect */}
              <div className="absolute inset-0 -top-px overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_ease-in-out] group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
