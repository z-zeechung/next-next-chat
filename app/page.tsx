// import { Analytics } from "@vercel/analytics/react";

import { Home } from "./components/home";

// import { getServerSideConfig } from "./config/server";
import { ThemeWrapper } from "./themes/theme";

// const serverConfig = getServerSideConfig();

export default async function App() {
  return (
    //很多UI库都要加这么一层wrapper，哎……
    <ThemeWrapper>
      <Home />
      {/* {serverConfig?.isVercel && (
        <>
          <Analytics />
        </>
      )} */}
    </ThemeWrapper>
  );
}
