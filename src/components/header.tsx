import Image from "next/image";
import crest from "@/assets/ceuma.png";

export function Header() {
  return <header className="site-header">
    <div className="wrap header-inner">
      <Image className="brand-crest" src={crest} alt="" width={35} height={35} />
      <div className="brand"><span>Manual de Sobrevivência</span><small>CEUMA · Campus Renascença</small></div>
    </div>
  </header>;
}
